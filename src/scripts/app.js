const header = require("./header")
const menu = require('./menu')
const navMenu = require("./nav-menu")
const repoList = require("./repo-list")
const resources = require("./resources")
const cacheKeys = resources.cacheKey
const config = require('./config')

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
            repoList.view,
        ]
    }

    $ui.render(main_view);
}

exports.startup = async () => {
    $cache.set(cacheKeys.sinceCacheKey, cacheKeys.defaultSinceValue);
    $cache.set(cacheKeys.dataTypeCacheKey, cacheKeys.defaultDataTypeValue)
    $cache.set(cacheKeys.spokenCacheKey, cacheKeys.defaultSpokenValue)
    $cache.set(cacheKeys.programLanguageCacheKey, cacheKeys.defaultProgramLanguageValue);
    render()
    await repoList.loadRepoList()

    var userName = config.getUserName()
    if (userName == "") {
        header.showSettingButton()
    } else {
        header.showAvatar(userName)
    }

}
