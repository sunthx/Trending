const header = require("./header").header
const templates = require("./list_view_template")
const api = require("./api")
const resouces = require("./resources")

const repoList = templates.repoList
const developerList = templates.developerList

const programLanguages = resouces.getProgramLanguages() 
const langColors = resouces.getLangColors()

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
        bgcolor: resouces.transparent
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
                tintColor: resouces.gray,
            },
            events: {
                changed: trendingTypeChanged
            }
        },
        {
            type: "button",
            props: {
                id:"spokenButton",
                bgcolor: resouces.gray,
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
                bgcolor: resouces.gray,
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
                bgcolor: resouces.gray,
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
    $device.taptic(0)
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
    $device.taptic(0)
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
    $device.taptic(0)
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

    var type = $cache.get(dataTypeCacheKey);

    list.startLoading()
    const res = await api.getTrendingData(since,spoken,programLang,type);
    list.stopLoading()

    list.data = res
}

function ChangeTreandDataView() {
    $device.taptic(0)
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

exports.startup = ()=>{
    $cache.set(sinceCacheKey,defaultSinceValue);
    $cache.set(dataTypeCacheKey,defaultDataTypeValue)
    $cache.set(spokenCacheKey,defaultSpokenValue)
    $cache.set(programLanguageCacheKey,defaultProgramLanguageValue);
    render()
    
    $('sinceButton').title = $cache.get(sinceCacheKey);
    loadTrendingData()
}
