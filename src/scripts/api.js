let host = "http://192.168.0.108:8080/";
let trendingRequestUrl = host + "trending";
let developerTrendingRequestUrl = trendingRequestUrl+ "/developers"

exports.getTrendingData = async(since,spoken,programLang,dataType) => {
    var isRepoRequest = dataType == "repo"
    var requestUrl = isRepoRequest ? trendingRequestUrl + getRequestPath(since,spoken,programLang) : developerTrendingRequestUrl+getRequestPath(since,spoken,programLang)
    $console.info("reqesut url:" + requestUrl)

    var resp = await $http.get(requestUrl)
    $console.info(resp);
    var dataArray = resp.data.data
    var dataSource = []
    if(dataArray == null){
        return dataSource
    }

    for (let index = 0; index < dataArray.length; index++) {
        var item = isRepoRequest ? repoTrendDataParser(dataArray[index]) : developerTrendDataParser(dataArray[index])
        dataSource.push(item)
    }

    $console.info(dataSource.length);
    return dataSource
}

function developerTrendDataParser(item){
    $console.info("name:" + item.user.name);
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
            title: item.popular_repository.name
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
        star: { title: item.star },
        fork: { title: item.fork },
        url: item.url
    }
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

    // query = $text.URLEncode(query)
    $console.info("request path:" + query);
    return containsPathValue ? query : "?"+query
}