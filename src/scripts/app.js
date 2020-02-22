const header = require("./header").header
const templates = require("./list_view_template")
const api = require("./api")
const helper = require("./helper")

const repoList = templates.repoList
const developerList = templates.developerList

const programLanguages = helper.getProgramLanguages() 
const langColors = helper.getLangColors()

const dataTypeCacheKey = "type"
const sinceCacheKey = "since"
const spokenCacheKey = "spoken"
const programLanguageCacheKey = "programLanguage"

const defaultDataTypeValue= "repo"
const defaultSinceValue = "Daily"
const defaultSpokenValue = ""
const defaultProgramLanguageValue = ""

var menu = {
    type: "view",
    props: {
        id:"menu",
        bgcolor: $color.clear
    },
    layout: function (make, view) {
        var headerView = $('header')
        make.left.right.inset(0)
        make.height.equalTo(50)
        make.top.equalTo(headerView.bottom)
    },
    views: [
        {
            type: "tab",
            layout: function (make, view) {
                make.left.top.inset(10)
            },
            props: {
                id: "menuTab",
                items: ["Repo", "Rank"],
                tintColor: $color('#586069'),
            },
            events: {
                changed: trendingTypeChanged
            }
        },
        {
            type: "button",
            props: {
                id:"spokenButton",
                bgcolor: $color('#586069'),
                title: "ALL",
                font: $font(12)
            },
            layout: function(make){
                make.top.inset(10)
                make.size.equalTo($size(60,30))
                make.right.inset(140)
            },
            events:{
                tapped: spokenLangButtonClicked
            }
        },
        {
            type: "button",
            props: {
                id:"langButton",
                bgcolor: $color('#586069'),
                title: "ALL",
                font: $font(12)
            },
            layout: function(make){
                make.top.inset(10)
                make.size.equalTo($size(60,30))
                make.right.inset(75)
            },
            events:{
                tapped: programLangButtonClicked
            }
        },
        {
            type: "button",
            props: {
                id: "sinceButton",
                bgcolor: $color('#586069'),
                font: $font(12)
            },
            layout: function (make) {
                make.top.inset(10)
                make.right.inset(10)
                make.size.equalTo($size(60, 30))
            },
            events:{
                tapped: sinceButtonClicked
            }
        }
    ]
}

function spokenLangButtonClicked(){
    var items = []
    items.push("ALL")

    for(let item of programLanguages.keys()) {
        items.push(item)
    }

    $ui.menu({
        items: items,
        handler: function(title, idx) {
            var spokenButton = $("spokenButton")
            spokenButton.title = title

            $cache.set(spokenCacheKey,title == "ALL" ? "" : programLanguages.get(title));
            loadTrendingData()
        }
    });
}

function programLangButtonClicked(){
    var items = []
    items.push("ALL")

    for(let item of langColors.keys()) {
        items.push(item)
    }

    $ui.menu({
        items: items,
        handler: function(title, idx) {
            var langButton = $("langButton")
            langButton.title = title
            $cache.set(programLanguageCacheKey, title == "ALL" ? "" : title);
            loadTrendingData()
        }
    });
}

function sinceButtonClicked(){
    $ui.menu({
        items: ["Daily","Weekly","Monthly"],
        handler: sinceMenuSelected
    });
}

function sinceMenuSelected(title,idx){
    var currentSince = $cache.get(sinceCacheKey)
    if(currentSince == title){
        return
    }

    var sinceButton = $("sinceButton")
    sinceButton.title = title
    $cache.set(sinceCacheKey, title);
    loadTrendingData()
}

function trendingTypeChanged(sender) {
    ChangeTreandDataView()
    var dataList = $("list");
    dataList.data = [];
    $cache.set(dataTypeCacheKey, sender.index == 0 ?"repo" : "developer")
    loadTrendingData()
}

async function loadTrendingData() {
    const list = $("list")
    list.data = []

    var since = $cache.get(sinceCacheKey)
    var spoken = $cache.get(spokenCacheKey)
    var programLang = $cache.get(programLanguageCacheKey)

    $console.warn("since:" + since);
    $console.warn("spoken:"+spoken)
    $console.warn("programlang:"+programLang);

    var type = $cache.get(dataTypeCacheKey);

    list.startLoading()
    const res = await api.getTrendingData(since,spoken,programLang,type);
    list.stopLoading()

    list.data = res
}

function ChangeTreandDataView() {
    var dataType = $cache.get(dataTypeCacheKey);
    var mainView = $("mainView")
    if(dataType == defaultDataTypeValue){
        $('list').remove()
        $('spokenButton').hidden = true
        mainView.add(developerList)
    } else {
        $('list').remove()
        $('spokenButton').hidden = false
        mainView.add(repoList)
    }
}

async function render() {
    var main_view = {
        type: "view",
        layout: $layout.fill,
        props: {
            id: "mainView",
            navBarHidden: true,
            statusBarStyle: 0
        },
        views: [
            header,
            menu,
            repoList
        ]
    }

    $ui.render(main_view);
}

$console.clear();
$cache.set(sinceCacheKey,defaultSinceValue);
$cache.set(dataTypeCacheKey,defaultDataTypeValue)
$cache.set(spokenCacheKey,defaultSpokenValue)
$cache.set(programLanguageCacheKey,defaultProgramLanguageValue);
render()

$('sinceButton').title = $cache.get(sinceCacheKey);
loadTrendingData()