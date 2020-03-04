const trendingDbFilePath = "shared://trending_data.db"
const resources = require('./resources')
const langColors = resources.getLangColors()
const crypto = require('crypto-js')
const api = require("./api")
const cacheKeys = resources.cacheKey

function deleteDbFile() {
    if ($file.exists(trendingDbFilePath)) {
        $file.delete(trendingDbFilePath);
    }
}

function init() {
    if ($file.exists(trendingDbFilePath)) {
        return
    }

    var db = $sqlite.open(trendingDbFilePath)
    db.update("CREATE TABLE repo_like(id text,data text)")
    $sqlite.close(db)
}

function addRepo(data) {
    let db = $sqlite.open(trendingDbFilePath)
    db.update({
        sql: "INSERT INTO repo_like values(?,?)",
        args: [data.id, data.data]
    })
    $sqlite.close(db)
}

function checkRepoExist(id) {
    let db = $sqlite.open(trendingDbFilePath)
    let res = db.query({
        sql: "SELECT * FROM repo_like WHERE id = ?",
        args: [id]
    })

    let exist = res.result.next()
    $sqlite.close(db)

    return exist
}

function getRepo() {
    var query = $cache.get(resources.cacheKey.repoLikeDataListCacheKey)
    if (query != undefined && query instanceof Map) {
        return query
    }

    let repoMap = new Map()
    let db = $sqlite.open(trendingDbFilePath)
    db.query({
        sql: "SELECT * FROM repo_like"
    },(rs,err) => {
        while (rs.next()) {
            let values = rs.values
            let repo = {
                id: values.id,
                data: JSON.parse(values.data)
            }
            repoMap.set(repo.id, repo)
        }
        rs.close()
    })

    $cache.set(resources.cacheKey.repoLikeDataListCacheKey, repoMap)
    $sqlite.close(db)

    return repoMap
}

function deleteRepo(id) {
    let db = $sqlite.open(trendingDbFilePath)
    db.update({
        sql: "delete from repo_like where id = ?",
        args: [id]
    })
    $sqlite.close(db)
}

exports.init = init
exports.deleteDbFile = deleteDbFile
exports.addRepo = addRepo
exports.getRepo = getRepo
exports.deleteRepo = deleteRepo
exports.checkRepoExist = checkRepoExist

function genRepoItemData(item,index) {
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
        like: { 
            info: null,
            icon: null
        }
    }

    var langColor = langColors.get(item.lang)
    var colorValue = "black"
    if (langColor != null && langColor.color != null) {
        colorValue = langColor.color
    }

    repo.langColor.bgcolor = $color(colorValue)

    let id = repo.name.text.concat(repo.author.text)
    repo.like.info = { 
        index: index,
        data: {
            id: crypto.SHA256(id).toString(),
            data: JSON.stringify(repo),
        }
    } 

    return repo
}

var dataSource = []
async function loadTrendingData() {
    let since = $cache.get(cacheKeys.sinceCacheKey)
    let spoken = $cache.get(cacheKeys.spokenCacheKey)
    let programLang = $cache.get(cacheKeys.programLanguageCacheKey)
    let type = $cache.get(cacheKeys.dataTypeCacheKey);
    let data = await api.getTrendingData(since,spoken,programLang,type)
    
    let likeList = getRepo()
    for (let index = 0; index < data.length; index++) {
        let item = genRepoItemData(data[index],index)
        item.like.icon = likeList.has(item.like.info.data.id) ? resources.icons.liked : resources.icons.defaultLike
        dataSource.push(item)
    }
}

exports.loadRepoListData = loadTrendingData
exports.repoListData = dataSource