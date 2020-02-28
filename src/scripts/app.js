const header = require("./header")
const repoListTemplate = require("./repo-list")
const rankListTemplate = require("./rank-list")
const api = require("./api")
const resources = require("./resources")
const config = require('./config')

const repoList = repoListTemplate.repoList
const developerList = rankListTemplate.developerList

const programLanguages = resources.getProgramLanguages() 
const langColors = resources.getLangColors()

const dataTypeCacheKey = "type"
const sinceCacheKey = "since"
const spokenCacheKey = "spoken"
const programLanguageCacheKey = "programLanguage"

const defaultDataTypeValue= "repo"
const defaultSinceValue = "Daily"
const defaultSpokenValue = ""
const defaultProgramLanguageValue = ""

const conditionButtonSize = $size(80,25)

var menu = {
    type: "view",
    props: {
        id:"menu",
        bgcolor: resources.transparent
    },
    layout: function (make, view) {
        var headerView = $('header')
        make.left.right.inset(0)
        make.height.equalTo(35)
        make.top.equalTo(headerView.bottom)
    },
    views: [
        {
            type: "button",
            props: {
                id: "sinceButton",
                bgcolor: resources.gray,
                font: resources.getMonoFont(10),
                title: $l10n("DEFAULT_CONDITION"),
                icon: $icon("029", resources.drakgray, resources.getSize(12)),
                imageEdgeInsets: $insets(0, 0, 0, 10),
                titleColor: resources.drakgray,
            },
            layout: function (make) {
                make.top.inset(5)
                make.left.inset(10)
                make.size.equalTo(conditionButtonSize)
            },
            events:{
                tapped: sinceButtonClicked
            }
        },
        {
            type: "button",
            props: {
                id:"langButton",
                bgcolor: resources.gray,
                font: resources.getMonoFont(10),
                title: $l10n("DEFAULT_CONDITION"),
                titleColor: resources.drakgray,
                icon: $icon("119", resources.drakgray, resources.getSize(12)),
                imageEdgeInsets: $insets(0, 0, 0, 10),
            },
            layout: function(make){
                make.top.equalTo($('sinceButton').top)
                make.left.equalTo($('sinceButton').right).offset(10)
                make.size.equalTo(conditionButtonSize)
            },
            events:{
                tapped: programLangButtonClicked
            }
        },
        {
            type: "button",
            props: {
                id:"spokenButton",
                bgcolor: resources.gray,
                font: resources.getMonoFont(10),
                title: $l10n("DEFAULT_CONDITION"),
                icon: $icon("053", resources.drakgray, resources.getSize(12)),
                imageEdgeInsets: $insets(0, 0, 0, 10),
                titleColor: resources.drakgray,
            },
            layout: function(make){
                make.top.equalTo($('langButton').top)
                make.left.equalTo($('langButton').right).offset(10)
                make.size.equalTo(conditionButtonSize)
            },
            events:{
                tapped: spokenLangButtonClicked
            }
        }
    ]
}

function spokenLangButtonClicked(){
    resources.taptic()
    var items = []
    items.push($l10n("DEFAULT_CONDITION"))

    for(let item of programLanguages.keys()) {
        items.push(item)
    }

    $ui.menu({
        items: items,
        handler: function(title, idx) {
            var spokenButton = $("spokenButton")
            spokenButton.title = title

            $cache.set(spokenCacheKey,title == $l10n("DEFAULT_CONDITION") ? "" : programLanguages.get(title));
            loadTrendingData()
        }
    });
}

function programLangButtonClicked(){
    resources.taptic()
    var items = []
    items.push($l10n("DEFAULT_CONDITION"))

    for(let item of langColors.keys()) {
        items.push(item)
    }

    $ui.menu({
        items: items,
        handler: function(title, idx) {
            var langButton = $("langButton")
            langButton.title = title
            $cache.set(programLanguageCacheKey, title == $l10n("DEFAULT_CONDITION") ? "": title);
            loadTrendingData()
        }
    });
}

function sinceButtonClicked(){
    resources.taptic()
    $ui.menu({
        items: [$l10n("DEFAULT_CONDITION"),$l10n("DAILY"),$l10n("WEEKLY"),$l10n("MONTHLY")],
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
    $cache.set(sinceCacheKey, title == $l10n("DEFAULT_CONDITION") ? $l10n("DAILY") : title)
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
    const res = await api.getTrendingData(since,spoken,programLang,type)
    list.stopLoading()

    list.data = res
}

function ChangeTreandDataView() {
    resources.taptic()
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
            statusBarStyle: 0,
            bgcolor: $color("#e9e9e9")
        },
        views: [
            header.header,
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
    
    loadTrendingData()

    var userName = config.getUserName()
    if(userName == ""){
        header.showSettingButton()
    } else {
        header.showAvatar(userName)
    }
        
}
