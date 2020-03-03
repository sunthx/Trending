const header = require("./header")
const menu = require('./menu')
const navMenu = require("./nav-menu")
const repoList = require("./repo-list").repoList
const api = require("./api")
const db = require("./db")
const cacheKeys = require("./resources").cacheKey
const config = require('./config')

async function loadTrendingData() {
    const list = $("list")
    list.data = []

    var since = $cache.get(cacheKeys.sinceCacheKey)
    var spoken = $cache.get(cacheKeys.spokenCacheKey)
    var programLang = $cache.get(cacheKeys.programLanguageCacheKey)
    var type = $cache.get(cacheKeys.dataTypeCacheKey);

    list.startLoading()
    const data = await api.getTrendingData(since,spoken,programLang,type)
    list.stopLoading()

    list.data = data
}

async function render() {
    var main_view = {
        type: "view",
        layout: $layout.fill,
        props: {
            id: "mainView",
            navBarHidden: true,
            statusBarStyle: 0,
            bgcolor: $color("#e9e9e9")
        },
        views: [
            header.header,
            menu.view,
            navMenu.view,
            repoList,
        ]
    }

    $ui.render(main_view);
}

exports.startup = ()=>{
    $cache.set(cacheKeys.sinceCacheKey,cacheKeys.defaultSinceValue);
    $cache.set(cacheKeys.dataTypeCacheKey,cacheKeys.defaultDataTypeValue)
    $cache.set(cacheKeys.spokenCacheKey,cacheKeys.defaultSpokenValue)
    $cache.set(cacheKeys.programLanguageCacheKey,cacheKeys.defaultProgramLanguageValue);
    render()
    loadTrendingData()

    var userName = config.getUserName()
    if(userName == ""){
        header.showSettingButton()
    } else {
        header.showAvatar(userName)
    }
        
}
