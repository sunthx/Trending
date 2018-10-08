package main

import (
	"net/http"
	"encoding/json"
	"fmt"
	"time"
	"io/ioutil"
	"github.com/dlclark/regexp2"
	"github.com/pkg/errors"
	"regexp"
	"strconv"
)

func main() {
	fmt.Println(":8080")
	http.HandleFunc("/contributions",contributionAPIHandle)
	http.HandleFunc("/trending",trendingAPIHandle)

	http.ListenAndServe(":8080",nil)
}

func contributionAPIHandle(writer http.ResponseWriter,request *http.Request) {
	err := request.ParseForm()
	if err != nil {
		return
	}

	user := request.Form.Get("user")
	contributions,_ := getContributions(user)
	result,_ := json.Marshal(contributions)

	writer.Header().Set("Content-Type","application/json; charset=utf-8")
	fmt.Fprint(writer,string(result))
}

func trendingAPIHandle(writer http.ResponseWriter,request *http.Request) {
	trending,_ := getTrending()
	result,_ := json.Marshal(trending)

	writer.Header().Set("Content-Type","application/json; charset=utf-8")
	fmt.Fprint(writer,string(result))
}

type Trending struct {
	[]Repository Repositories
}

type Repository struct {
	Name		string		`json:"name"`
	Description	string		`json:"description"`
	Url			string		`json:"url"`
	Star		int			`json:"star"`	
	Fork		int			`json:"fork"`
	Lang		string		`json:"lang"`
}

func getTrending() (Trending,error){
	trendingExp := `<li class="col-12 d-block width-full py-4 border-bottom" [^]*?>[^]*?<\/li>`
}

func resolveRepositorys(content string) []Repository {

}

func resolveRepositoryTag(tag string) Repository {

}

type Contribution struct {
	DataCount int		`json:"count"`
	Date      string	`json:"date"`
	Color	  string	`json:"color"`
}

func getContributions(userName string) ([]Contribution, error) {
	if userName == "" {
		return nil,errors.New("required:username")
	}

	currentTime := time.Now()
	requestUrl := "https://github.com/users/" + userName + "/contributions?to=" + currentTime.Format("2006-01-02")
	res,err := http.Get(requestUrl)
	if err != nil {
		return nil,err
	}

	contentBytes,err := ioutil.ReadAll(res.Body)
	if err != nil || contentBytes == nil {
		return nil,err
	}

	contentString := string(contentBytes)
	return resolveContributions(contentString),nil
}

func resolveContributions(content string) []Contribution {
	rectTags := resolveRectTags(content)
	if len(rectTags) == 0 {
		return nil
	}

	contributions := make([]Contribution,0)
	for i:=0;i<len(rectTags);i++{
		contribution := createContributionByRectTag(rectTags[i])
		contributions = append(contributions,contribution)
	}

	return contributions
}

func resolveRectTags(content string)[]string{
	exp := `<rect.*?\/>`
	regexp := regexp.MustCompile(exp)
	match := regexp.FindAll([]byte(content),-1)
	if match == nil {
		return nil
	}

	result := make([]string,0)
	for i := 0; i< len(match);i++  {
		result = append(result,string(match[i]))
	}

	return result
}

func createContributionByRectTag(tag string) Contribution {
	exp := `(?<=<rect.*data-count=").*(?="\s*data-date.*\/>)|(?<=<rect.*\s*data-date=").*(?="\s?.*\/>)|(?<=<rect.*fill=").*(?="\s*data-count.*\/>)`
	regexp2 := regexp2.MustCompile(exp,0)
	colorMatchResult,err := regexp2.FindStringMatch(tag)
	if err != nil || colorMatchResult == nil {
		return Contribution{}
	}

	dataCountMatch,_ := regexp2.FindNextMatch(colorMatchResult)
	if dataCountMatch == nil {
		return Contribution{}
	}

	dateMatchResult,_ := regexp2.FindNextMatch(dataCountMatch)
	if dateMatchResult == nil {
		return Contribution{}
	}

	dataCount,_ := strconv.Atoi(dataCountMatch.String())
	date := dateMatchResult.String()
	color := colorMatchResult.String()

	return Contribution{Color:color,DataCount:dataCount,Date:date}
}
