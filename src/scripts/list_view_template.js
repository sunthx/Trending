const grayColor = $color('#586069')
const secondColor = $color('#0366d6')
const iconSize14 = $size(14, 14)

const repoDetailView = [
    {
        type: "image",
        props: {
            src: "/assets/repo.png"
        },
        layout: function (make) {
            make.top.inset(8)
            make.left.inset(10)
            make.size.equalTo($size(16, 16))
        }
    },
    {
        type: "label",
        props: {
            id: "name",
            bgcolor: $color('clear'),
            textColor: secondColor,
            font: $font('bold', 16)
        },
        layout: function (make) {
            make.top.inset(5)
            make.left.inset(30)
        }
    },
    {
        type: "label",
        props: {
            id: "description",
            lines: 2,
            font: $font(13),
            textColor: $color('#696969')
        },
        layout: function (make) {
            make.top.inset(30)
            make.left.right.inset(10)
        }
    },
    {
        type: "image",
        props: {
            id: "imgStar",
            icon: $icon("062", grayColor, $size(14, 14))
        },
        layout: function (make) {
            make.bottom.inset(5)
            make.left.inset(10)
        }
    },
    {
        type: "button",
        props: {
            id: "star",
            bgcolor: $color('clear'),
            titleColor: grayColor,
            font: $font('14')
        },
        layout: function (make) {
            make.left.equalTo($('imgStar').right).offset(3)
            make.bottom.inset(-3)
        }
    },
    {
        type: "image",
        props: {
            id: "imgFork",
            icon: $icon('163', grayColor, iconSize14)
        },
        layout: function (make) {
            make.left.equalTo($('imgStar').right).offset(65)
            make.bottom.inset(5)
        }
    },
    {
        type: "button",
        props: {
            id: "fork",
            bgcolor: $color('clear'),
            titleColor: grayColor,
            font: $font('14')
        },
        layout: function (make) {
            make.left.equalTo($('imgFork').right).offset(2)
            make.bottom.inset(-3)
        }
    },
    {
        type: "button",
        props: {
            id: "author",
            textColor: grayColor,
            bgcolor: $color('clear'),
            titleColor: secondColor,
            font: $font('14')
        },
        layout: function (make) {
            make.bottom.inset(-1)
            make.right.inset(10)
        }
    }
]

const developerDetailView = [
    {
        type: "label",
        props: {
            id: "index",
            textColor: grayColor,
            font: $font("bold",16),
            lines:2
        },
        layout: function (make) {
            make.top.inset(5)
            make.left.inset(5)
        }
    },
    {
        type: "image",
        props: {
            id: "avatar",
            bgcolor: $color('#cccccc')
        },
        layout: function (make) {
            make.size.equalTo($size(48, 48))
            make.top.insets(5)
            make.left.equalTo($('index').right).offset(10)
        }
    },
    {
        type: "label",
        props: {
            id: "userName",
            textColor: secondColor,
            font: $font("bold",18),
        },
        layout: function (make) {
            make.top.inset(5)
            make.left.equalTo($('avatar').right).offset(10)
        }
    },
    {
        type: "label",
        props: {
            id: "nickName",
            textColor: grayColor,
            font: $font('16')
        },
        layout: function(make){
            make.top.equalTo($('userName').bottom).offset(5)
            make.left.equalTo($('avatar').right).offset(10)
        }
    },
    {
        type:"image",
        props:{
            id:"imgPopularRepo",
            icon: $icon('135',$color('#e36209'),$size(16,16)),
        },
        layout:function(make){
            make.left.equalTo($('index').right).offset(10) 
            make.top.equalTo($('avatar').bottom).offset(10)
        }
    },
    {
        type:"button",
        props:{
            id:"repo_name",
            bgcolor: $color('clear'),
            titleColor: secondColor
        },
        layout:function(make){
            make.left.equalTo($('imgPopularRepo').right).offset(5) 
            make.top.equalTo($('imgPopularRepo').top).offset(-9)
        }
    },
    {
        type:"label",
        props:{
            id:"description",
            titleColor: grayColor,
            font: $font('12')
        },
        layout:function(make){
            make.left.equalTo($('repo_name').left) 
            make.top.equalTo($('repo_name').bottom).offset(-5)
        } 
    }
]

var repoList = {
    type: "list",
    props: {
        id: "list",
        separatorHidden: false,
        style: 0,
        selectable: true,
        rowHeight: 100,
        template: {
            type: "view",
            views: repoDetailView,
        }
    },
    layout: function (make, view) {
        make.top.inset(170)
        make.right.left.inset(0)
        make.bottom.inset(0)
    },
    events: {
        didSelect: repolistClicked
    }
}

var developerList = {
    type: "list",
    props: {
        id: "list",
        separatorHidden: false,
        style: 0,
        selectable: true,
        rowHeight: 100,
        template: {
            type: "view",
            views: developerDetailView,
        }
    },
    layout: function (make, view) {
        make.top.inset(170)
        make.right.left.inset(0)
        make.bottom.inset(0)
    },
    events: {
        didSelect: developerListClicked
    } 
}

exports.repoList = repoList 
exports.developerList = developerList

function repolistClicked(tableView,indexPath){
    var data = tableView.object(indexPath)
    openUrl(data.name.text,data.url)
}

function developerListClicked(tableView,indexPath){
    var data = tableView.object(indexPath) 
    openUrl(data.userName.text,data.homePage)
}

function openUrl(title,url) {
    $console.warn(title + "--"+url)
    $ui.push({
        props: {
          title: title  
        },
        views: [{
            type: "web",
            props: {
                title: title,
                text: title,
                url: url
            },
            layout: $layout.fill
        }]
    })
}
