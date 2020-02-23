let host = "http://192.168.0.108:8080/";
let trendingRequestUrl = host + "trending";
let developerTrendingRequestUrl = trendingRequestUrl+ "/developers"
let contributionRequestUrl = host + "contributions?user="

const crypto = require('crypto-js')
const source = crypto.SHA256($device.info).toString()
const langColors = require('./resources').getLangColors()

exports.getVersion() = async () => {
    
}

exports.getTrendingData = async(since,spoken,programLang,dataType) => {
    var isRepoRequest = dataType == "repo"
    var requestUrl = isRepoRequest ? trendingRequestUrl + getRequestPath(since,spoken,programLang) : developerTrendingRequestUrl+getRequestPath(since,spoken,programLang)

    var resp = await $http.get(requestUrl)
    var dataArray = resp.data.data
    var dataSource = []
    if(dataArray == null){
        return dataSource
    }

    for (let index = 0; index < dataArray.length; index++) {
        var item = isRepoRequest ? repoTrendDataParser(dataArray[index]) : developerTrendDataParser(dataArray[index])
        dataSource.push(item)
    }

    return dataSource
}

exports.getContributionData = async(userName) => {
    var requestUrl = contributionRequestUrl + userName + "&source=" + source
    var resp = await $http.get(requestUrl)
    var contributions = []
    var data_array = resp.data.data
    for (let index = 0; index < data_array.length; index++) {
        const contribution = data_array[index];
        contributions.push({
            level: contribution.level,
            total:contribution.total,
            weekday: contribution.weekday,
            defaultColor: contribution.color
        })
    }

    return contributions
}

function developerTrendDataParser(item){
    return {
        index: {
            text: item.index 
        },
        userName: {
            text: item.user.name
        },
        nickName: {
            text: item.user.nick_name
        },
        homePage: item.user.website,
        avatar: {
            src: item.user.avatar
        },
        repo_name: {
            text: item.popular_repository.name
        },
        url:{
            text: item.popular_repository.url
        },
        description:{
            text: item.popular_repository.description
        }}
}

function repoTrendDataParser(item) {
    var array = item.name.split('/')
    var repo = {
        name: { text: array[2] },
        author: {title: "@"+array[1]},
        lang: { text: item.lang },
        description: { text: item.description.replace(/<g-emoji [\s\S]*?>|<\/g-emoji>|<a[\s\S]*?>|<\/a>/g, "") },
        star: { text: item.star },
        fork: { text: item.fork },
        langColor:{bgcolor: null},
        url: item.url
    }

    var langColor = langColors.get(item.lang)
    var colorValue = "black"
    if(langColor != null && langColor.color != null) {
        colorValue = langColor.color
    } 

    repo.langColor.bgcolor = $color(colorValue)
    return repo
}

function getRequestPath(since,spoken,programLang){
    var query = "";
    var containsPathValue = false

    if(programLang != "") {
        query += "/"+$text.URLEncode(programLang) + "?"
        containsPathValue = true
    }

    query += ("since="+since)

    if(spoken != "") {
        if(query != ""){
            query += "&"
        }

        query += "spoken_language_code=" + spoken
    }

    if(query == "") {
       return "" 
    }

    return containsPathValue ? query : "?"+query
}