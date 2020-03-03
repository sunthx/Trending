let host = "http://api.trending.sunth.cn/";
let trendingRequestUrl = host + "trending";
let userRequestUrl = host + "user?name="
let developerTrendingRequestUrl = trendingRequestUrl + "/developers"
let contributionRequestUrl = host + "contributions?user="

const crypto = require('crypto-js')
const source = crypto.SHA256($device.info).toString()
const resources = require('./resources')
const langColors = resources.getLangColors()

exports.getUser = async (name) => {
    if (name == "") {
        return
    }

    var resp = await $http.get(userRequestUrl + name)
    var respContent = resp.data
    if (respContent.code != 200) {
        return null
    }

    return {
        name: respContent.data.name,
        nickname: respContent.data.nick_name,
        avatar: resources.formatAvatarUrl(respContent.data.avatar, 120),
        website: respContent.data.website
    }
}

exports.getInfo = async () => {
    var url = "https://raw.githubusercontent.com/sunthx/jsbox-github-trending/master/update.json"
    var resp = await $http.get(url)
    if (resp.error != null) {
        return null;
    }

    return {
        url: resp.data.url,
        version: resp.data.version,
        name: resp.data.name
    }
}

exports.getTrendingData = async (since, spoken, programLang, dataType) => {
    var isRepoRequest = dataType == "repo"
    var requestUrl = isRepoRequest ? trendingRequestUrl + getRequestPath(since, spoken, programLang) : developerTrendingRequestUrl + getRequestPath(since, spoken, programLang)

    var resp = await $http.get(requestUrl)
    var dataArray = resp.data.data
    var dataSource = []
    if (dataArray == null) {
        return dataSource
    }

    for (let index = 0; index < dataArray.length; index++) {
        var item = isRepoRequest ? repoTrendDataParser(dataArray[index],index) : developerTrendDataParser(dataArray[index])
        dataSource.push(item)
    }

    return dataSource
}

exports.getContributionData = async (userName) => {
    var requestUrl = contributionRequestUrl + userName + "&source=" + source
    var resp = await $http.get(requestUrl)
    var contributions = []
    var data_array = resp.data.data
    for (let index = 0; index < data_array.length; index++) {
        const contribution = data_array[index];
        contributions.push({
            level: contribution.level,
            total: contribution.total,
            weekday: contribution.weekday,
            defaultColor: contribution.color
        })
    }

    return contributions
}

function developerTrendDataParser(item) {
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
        url: {
            text: item.popular_repository.url
        },
        description: {
            text: item.popular_repository.description
        }
    }
}

function repoTrendDataParser(item,index) {
    var array = item.name.split('/')
    var repo = {
        name: { text: array[2] },
        author: { text: "@" + array[1] },
        lang: { text: item.lang },
        description: { text: item.description.replace(/<g-emoji [\s\S]*?>|<\/g-emoji>|<a[\s\S]*?>|<\/a>/g, "") },
        star: { text: item.star },
        fork: { text: item.fork },
        langColor: { bgcolor: null },
        url: item.url,
        avatar: { src: resources.formatAvatarUrl(item.avatar, 120) },
        today: { text: "+" + item.star_today },
        like: { info: null }
    }

    var langColor = langColors.get(item.lang)
    var colorValue = "black"
    if (langColor != null && langColor.color != null) {
        colorValue = langColor.color
    }

    repo.langColor.bgcolor = $color(colorValue)
    repo.like.info = { 
        index: index,
        data: {
            id: crypto.SHA256(repo.name+repo.author).toString(),
            data: JSON.stringify(repo),
            isSelected: false
        }
    } 
    return repo
}

function getRequestPath(since, spoken, programLang) {
    var query = "";
    var containsPathValue = false

    if (programLang != "") {
        query += "/" + $text.URLEncode(programLang) + "?"
        containsPathValue = true
    }

    query += ("since=" + since)

    if (spoken != "") {
        if (query != "") {
            query += "&"
        }

        query += "spoken_language_code=" + spoken
    }

    if (query == "") {
        return ""
    }

    return containsPathValue ? query : "?" + query
}