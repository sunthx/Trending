const resources = require('./resources')
const data = require('./data')
const api = require("./api")
const langColors = resources.getLangColors()
const crypto = require('crypto-js')
const cacheKeys = resources.cacheKey
const iconSize = resources.getSize(10)
var dataSource = []
var showingTrending = true

const repoDetailView = [
    {
        type: "image",
        props: {
            id: "avatar",
            circular: true,
            bgcolor: resources.lightGray,
        },
        layout: function (make, view) {
            make.size.equalTo(resources.getSize(30))
            make.top.left.inset(10)
        }
    },
    {
        type: "image",
        props: {
            id: "imgRepoIcon",
            icon: $icon('057', resources.black, iconSize)
        },
        layout: function (make) {
            let avatar = $('avatar')
            make.top.equalTo(avatar.top)
            make.left.equalTo(avatar.right).offset(5)
        }
    },
    {
        type: "label",
        props: {
            id: "name",
            bgcolor: resources.transparent,
            textColor: resources.black,
            font: resources.getBoldFont(14),
            align: $align.left,
        },
        layout: function (make) {
            let width = $device.info.screen.width - 120
            make.width.equalTo(width)

            let repo = $('imgRepoIcon')
            make.left.equalTo(repo.right).offset(5)
            make.top.equalTo(repo.top).offset(-4)
        }
    },
    {
        type: "button",
        props: {
            id: "like",
            bgcolor: resources.transparent,
            icon: resources.icons.defaultLike
        },
        layout: function (make, view) {
            make.top.equalTo(0)
            make.size.equalTo(resources.getSize(30))
            make.right.inset(0)
        },
        events: {
            tapped: LikeButtonClicked
        },
    },
    {
        type: "label",
        props: {
            id: "description",
            lines: 2,
            font: resources.getFont(12),
            textColor: resources.drakgray,
            align: $align.left
        },
        layout: function (make) {
            let width = $device.info.screen.width - 80
            make.width.equalTo(width)
            make.height.equalTo(30)
            make.left.equalTo($('imgRepoIcon').left)
            make.top.equalTo($('name').bottom).offset(5)
        }
    },
    {
        type: "view",
        props: {
            id: "langColor",
            circular: true
        },
        layout: function (make) {
            let left = $('imgRepoIcon').left
            let top = $('description').bottom

            make.width.equalTo(8)
            make.height.equalTo(8)

            make.left.equalTo(left)
            make.top.equalTo(top).offset(10)
        }

    },
    {
        type: "label",
        props: {
            id: "lang",
            font: resources.getFont(10),
            textColor: resources.black
        },
        layout: function (make) {
            make.width.equalTo(65)
            let cl = $('langColor')
            make.left.equalTo(cl.right).offset(2)
            make.top.equalTo(cl.top).offset(-2)
        }
    }
]

const countView = [
    {
        type: "image",
        props: {
            id: "imgStar",
            icon: $icon("062", resources.black, iconSize)
        },
        layout: function (make) {
            make.left.equalTo($('lang').right).offset(3)
            make.top.equalTo($('langColor').top).offset(-1)
        }
    },
    {
        type: "label",
        props: {
            id: "star",
            bgcolor: resources.transparent,
            font: resources.getFont(10)
        },
        layout: function (make) {
            make.top.equalTo($('lang').top)
            make.left.equalTo($('imgStar').right).offset(3)
        }
    },
    {
        type: "image",
        props: {
            id: "imgFork",
            icon: $icon('163', resources.black, iconSize)
        },
        layout: function (make) {
            make.left.equalTo($('imgStar').right).offset(55)
            make.top.equalTo($('langColor').top).offset(-0.5)
        }
    },
    {
        type: "label",
        props: {
            id: "fork",
            bgcolor: resources.transparent,
            titleColor: resources.lightGray,
            font: resources.getFont(10)
        },
        layout: function (make) {
            make.left.equalTo($('imgFork').right).offset(3)
            make.top.equalTo($('lang').top)
        }
    },
    {
        type: "image",
        props: {
            id: "imgToday",
            icon: $icon('164', resources.black, iconSize)
        },
        layout: function (make) {
            make.left.equalTo($('imgFork').right).offset(55)
            make.top.equalTo($('langColor').top).offset(-1)
        }
    },
    {
        type: "label",
        props: {
            id: "today",
            bgcolor: resources.transparent,
            titleColor: resources.lightGray,
            font: resources.getFont(10)
        },
        layout: function (make) {
            make.left.equalTo($('imgToday').right).offset(3)
            make.top.equalTo($('lang').top)
        }
    }
]

function getDetailView(showAll) {
    if(showAll) {
        countView.forEach(function(item){
            repoDetailView.push(item)
        })
    }

    return repoDetailView
}

const repoList = {
    type: "list",
    props: {
        id: "list",
        bgcolor: resources.transparent,
        separatorHidden: true,
        selectable: true,
        rowHeight: 100,
        template: {
            type: "view",
            props: {
                bgcolor: resources.transparent,
            },
            views: [
                {
                    type: "view",
                    props: {
                        id: "itemTemplate",
                        bgcolor: resources.white,
                        circular: true,
                        smoothRadius: 3,
                        shadowColor: resources.orange,
                    },
                    layout: function (make, view) {
                        make.height.equalTo(90)
                        make.left.right.insets(10)
                    },
                    views: getDetailView(true) 
                }
            ],
        }
    },
    layout: function (make, view) {
        make.top.equalTo($('menu').bottom)
        make.right.left.inset(0)
        make.bottom.equalTo($('navMenu').top)
    },
    events: {
        didSelect: repolistClicked,
        didLongPress: function (sender, indexPath, data) {
            var data = sender.object(indexPath)
            $share.sheet([data.url])
        }
    }
}

function repolistClicked(sender, indexPath, data) {
    let title = data.name.text
    let url = data.url
    $ui.push({
        props:{
            title: title,
            navBarHidden: true,
            statusBarStyle: 0
        },
        views: [
            {
                type:"view",
                props:{
                    id:"nav",
                    bgcolor: resources.white
                },
                layout: function(make){
                    make.top.left.right.insets(0)
                    make.height.equalTo(30)
                }
            },
            {
            type: "web",
            props: {
                title: title,
                text: title,
                url: url
            },
            layout: function(make) {
                let nav = $('nav')
                make.top.equalTo(nav.bottom)
                make.left.right.bottom.inset(0)
            }
        }]
    })
}

function genRepoItemView(item,index) {
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
            data: JSON.stringify(item),
        }
    } 

    return repo
}

function genRepoItems(dataArray) {
    $console.info(dataArray.length);

    let res = []
    let likeList = data.getRepo()
    for (let index = 0; index < dataArray.length; index++) {
      
        let item = genRepoItemView(dataArray[index],index)
        item.like.icon = likeList.has(item.like.info.data.id) ? resources.icons.liked : resources.icons.defaultLike
        res.push(item)
    }

    return res;
}

async function loadTrendingData() {
    let since = $cache.get(cacheKeys.sinceCacheKey)
    let spoken = $cache.get(cacheKeys.spokenCacheKey)
    let programLang = $cache.get(cacheKeys.programLanguageCacheKey)
    let type = $cache.get(cacheKeys.dataTypeCacheKey);
    let dataArray = await api.getTrendingData(since,spoken,programLang,type)
    return genRepoItems(dataArray)
}

function LikeButtonClicked(view){
    let info = view.info
    if (data.checkRepoExist(info.data.id)) {
        data.deleteRepo(info.data.id)
        view.icon = resources.icons.defaultLike
    } else {
        data.addRepo(view.info.data)
        view.icon = resources.icons.liked
    }

    dataSource[info.index].like.icon = view.icon

    let list = $('list')
    let repoList = list.contentOffset.y
    list.data = []
    list.data = dataSource 
    list.contentOffset = $point(0, repoList)
}

async function loadRepoList() {
    showingTrending = true
    let list = $("list")
    list.startLoading()
    dataSource = await loadTrendingData()
    list.stopLoading()
    list.data = dataSource
}

function loadLikedList() {
    showingTrending = false
    let likeList = data.getRepo() 
    let list = $('list')
    let dataArray = []
    for (let value of likeList.values()) {
        dataArray.push(value.data)
    }

    dataSource = genRepoItems(dataArray)
    list.data = dataSource
}

exports.repoListData = dataSource
exports.view = repoList
exports.loadRepoList = loadRepoList
exports.loadLikedList = loadLikedList


