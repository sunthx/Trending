let host = "http://api.trending.sunth.cn/";
let trendingRequestUrl = host + "trending";
let userRequestUrl = host + "user?name="
let developerTrendingRequestUrl = trendingRequestUrl + "/developers"
let contributionRequestUrl = host + "contributions?user="

const crypto = require('crypto-js')
const source = crypto.SHA256($device.info).toString()
const resources = require('./resources')

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
    return dataArray
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