package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/dlclark/regexp2"
	"github.com/pkg/errors"
)

func main() {
	fmt.Println(":8090")
	http.HandleFunc("/contributions", contributionAPIHandle)
	http.HandleFunc("/trending", trendingAPIHandle)

	http.ListenAndServe(":8090", nil)
}

func contributionAPIHandle(writer http.ResponseWriter, request *http.Request) {
	err := request.ParseForm()
	if err != nil {
		return
	}

	user := request.Form.Get("user")
	contributions, _ := getContributions(user)
	result, _ := json.Marshal(contributions)

	writer.Header().Set("Content-Type", "application/json; charset=utf-8")
	fmt.Fprint(writer, string(result))
}

func trendingAPIHandle(writer http.ResponseWriter, request *http.Request) {
	trending, _ := getTrending()
	result, _ := json.Marshal(trending)

	writer.Header().Set("Content-Type", "application/json; charset=utf-8")
	fmt.Fprint(writer, string(result))
}

type Trending struct {
	Repositories []Repository
}

type Repository struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Url         string `json:"url"`
	Star        string `json:"star"`
	Fork        string `json:"fork"`
	Lang        string `json:"lang"`
}

func getTrending() (Trending, error) {
	requestUrl := "https://github.com/trending"
	res, err := http.Get(requestUrl)
	if err != nil {
		return Trending{}, err
	}

	contentBytes, err := ioutil.ReadAll(res.Body)
	if err != nil || contentBytes == nil {
		return Trending{}, err
	}

	htmlContent := string(contentBytes)
	repositories := resolveRepositories(htmlContent)
	return Trending{Repositories: repositories}, nil
}

func resolveRepositories(content string) []Repository {
	repositoryItemExp := `<li class="col-12 d-block width-full py-4 border-bottom"[\s\S]*?>[\s\S]*?<\/li>`

	regexp := regexp.MustCompile(repositoryItemExp)
	match := regexp.FindAll([]byte(content), -1)
	if match == nil {
		return nil
	}

	result := make([]Repository, 0)
	for i := 0; i < len(match); i++ {
		result = append(result, resolveRepositoryTag(string(match[i])))
	}

	return result
}

func resolveRepositoryTag(content string) Repository {
	name := stringFormat(getRepositoryName(content))
	lang := stringFormat(getRepositoryLang(content))
	desc := stringFormat(getRepositoryDescription(content))
	star := stringFormat(getRepositoryStar(content))
	fork := stringFormat(getRepositoryFork(content))
	url := "https://github.com" + name

	return Repository{Name: name, Description: desc, Lang: lang, Star: star, Fork: fork, Url: url}
}

func stringFormat(content string) string {
	content = strings.Replace(content, "\n", "", -1)
	content = strings.TrimSpace(content)
	return content
}

func getRepositoryName(content string) string {
	repositoryItemNameExp := `(?<=<h3>[\s\S]+<a href=").*(?=">)`
	return findFirstOrDefaultMatch(content, repositoryItemNameExp)
}

func getRepositoryLang(content string) string {
	repositoryItemLangExp := `(?<=<span itemprop="programmingLanguage">)[\s\S]+?(?=<\/span>)`
	return findFirstOrDefaultMatch(content, repositoryItemLangExp)
}

func getRepositoryDescription(content string) string {
	repositoryItemDescriptionExp := `(?<=<p class="col-9 d-inline-block text-gray m-0 pr-4">)[\s\S]+?(?=<\/p>)`
	return findFirstOrDefaultMatch(content, repositoryItemDescriptionExp)
}

func getRepositoryStar(content string) string {
	repositoryItemStarTagExp := `<a class="muted-link d-inline-block mr-3" href="[\s\S]*?\/stargazers">[\s\S]*?<\/a>`
	starTagContent := findFirstOrDefaultMatch(content, repositoryItemStarTagExp)
	if starTagContent == "" {
		return starTagContent
	}

	repositoryItemStarValueExp := `<\/svg>([\s\S]*)<\/a>`
	starValue := findFirstOrDefaultMatch(starTagContent, repositoryItemStarValueExp)
	return starValue
}

func getRepositoryFork(content string) string {
	repositoryItemForkTagExp := `<a class="muted-link d-inline-block mr-3" href=".*\/network">[\s\S]*?<\/a>`
	forkTagContent := findFirstOrDefaultMatch(content, repositoryItemForkTagExp)
	if forkTagContent == "" {
		return forkTagContent
	}

	repositoryItemForkValueExp := `<\/svg>([\s\S]*)<\/a>`
	forkValue := findFirstOrDefaultMatch(forkTagContent, repositoryItemForkValueExp)
	return forkValue
}

func findFirstOrDefaultMatch(content string, exp string) string {
	regexp2 := regexp2.MustCompile(exp, 0)
	match, err := regexp2.FindStringMatch(content)
	if err != nil || match == nil {
		return ""
	}

	groups := match.Groups()
	if len(groups) > 1 {
		return groups[1].Capture.String()
	}

	return match.String()
}

type Contribution struct {
	DataCount int    `json:"count"`
	Date      string `json:"date"`
	Color     string `json:"color"`
}

func getContributions(userName string) ([]Contribution, error) {
	if userName == "" {
		return nil, errors.New("required:username")
	}

	currentTime := time.Now()
	requestUrl := "https://github.com/users/" + userName + "/contributions?to=" + currentTime.Format("2006-01-02")
	res, err := http.Get(requestUrl)
	if err != nil {
		return nil, err
	}

	contentBytes, err := ioutil.ReadAll(res.Body)
	if err != nil || contentBytes == nil {
		return nil, err
	}

	contentString := string(contentBytes)
	return resolveContributions(contentString), nil
}

func resolveContributions(content string) []Contribution {
	rectTags := resolveRectTags(content)
	if len(rectTags) == 0 {
		return nil
	}

	contributions := make([]Contribution, 0)
	for i := 0; i < len(rectTags); i++ {
		contribution := createContributionByRectTag(rectTags[i])
		contributions = append(contributions, contribution)
	}

	return contributions
}

func resolveRectTags(content string) []string {
	exp := `<rect.*?\/>`
	regexp := regexp.MustCompile(exp)
	match := regexp.FindAll([]byte(content), -1)
	if match == nil {
		return nil
	}

	result := make([]string, 0)
	for i := 0; i < len(match); i++ {
		result = append(result, string(match[i]))
	}

	return result
}

func createContributionByRectTag(tag string) Contribution {
	exp := `(?<=<rect.*data-count=").*(?="\s*data-date.*\/>)|(?<=<rect.*\s*data-date=").*(?="\s?.*\/>)|(?<=<rect.*fill=").*(?="\s*data-count.*\/>)`
	regexp2 := regexp2.MustCompile(exp, 0)
	colorMatchResult, err := regexp2.FindStringMatch(tag)
	if err != nil || colorMatchResult == nil {
		return Contribution{}
	}

	dataCountMatch, _ := regexp2.FindNextMatch(colorMatchResult)
	if dataCountMatch == nil {
		return Contribution{}
	}

	dateMatchResult, _ := regexp2.FindNextMatch(dataCountMatch)
	if dateMatchResult == nil {
		return Contribution{}
	}

	dataCount, _ := strconv.Atoi(dataCountMatch.String())
	date := dateMatchResult.String()
	color := colorMatchResult.String()

	return Contribution{Color: color, DataCount: dataCount, Date: date}
}
