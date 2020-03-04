const header = require("./header")
const menu = require('./menu')
const navMenu = require("./nav-menu")
const repoList = require("./repo-list").repoList

const resources = require("./resources")
const cacheKeys = resources.cacheKey
const config = require('./config')
const data = require("./data")


async function loadTrendingData() {
    let list = $("list")
    
    list.startLoading()
    await data.loadRepoListData()
    list.stopLoading()

    list.data = data.repoListData 
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
