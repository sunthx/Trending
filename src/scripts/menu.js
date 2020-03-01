const resources = require('./resources')
const conditionButtonSize = $size(80,25)
const spokenLangs = resources.getSpokenLangs() 
const programLangs = resources.getProgramLangs()
const cacheKeys = resources.cacheKey

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
                icon: $icon("112", resources.drakgray, resources.getSize(12)),
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

function sinceMenuSelected(title,idx){
    var sinceButton = $("sinceButton")
    sinceButton.title = title
    $cache.set(cacheKeys.sinceCacheKey, title == $l10n("DEFAULT_CONDITION") ? $l10n("DAILY") : title)
    loadTrendingData()
}

function spokenLangButtonClicked(){
    resources.taptic()
    var items = []
    items.push($l10n("DEFAULT_CONDITION"))

    for(let item of spokenLangs.keys()) {
        items.push(item)
    }

    $ui.menu({
        items: items,
        handler: function(title, idx) {
            var spokenButton = $("spokenButton")
            spokenButton.title = title

            $cache.set(cacheKeys.spokenCacheKey,title == $l10n("DEFAULT_CONDITION") ? "" : spokenLangs.get(title));
            loadTrendingData()
        }
    });
}

function programLangButtonClicked(){
    resources.taptic()
    var items = []
    items.push($l10n("DEFAULT_CONDITION"))

    for(let item of programLangs) {
        items.push(item)
    }

    $ui.menu({
        items: items,
        handler: function(title, idx) {
            var langButton = $("langButton")
            langButton.title = title
            $cache.set(cacheKeys.programLanguageCacheKey, title == $l10n("DEFAULT_CONDITION") ? "": title);
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

exports.view = menu