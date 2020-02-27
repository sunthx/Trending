const resouces = require('./resources')

const repoDetailView = [
    {
        type: "image",
        props: {
            icon: $icon('057',resouces.gray,resouces.getSize(14))
        },
        layout: function (make) {
            make.top.inset(8)
            make.left.inset(10)
            make.size.equalTo(resouces.getSize(16))
        }
    },
    {
        type: "label",
        props: {
            id: "name",
            bgcolor: resouces.transparent,
            textColor: resouces.blue,
            font: resouces.getBoldFont(16) 
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
            font: resouces.getFont(13),
            textColor: resouces.lightGray 
        },
        layout: function (make) {
            make.top.inset(30)
            make.left.right.inset(10)
        }
    },
    {
        type: "view",
        props:{
            id:"langColor",
            circular: true
        },
        layout: function(make) {
            make.bottom.inset(5)
            make.width.equalTo(10)
            make.height.equalTo(10)
            make.left.inset(10)
        } 
    },
    {
        type: "label",
        props: {
            id: "lang",
            font: resouces.getFont(12),
            textColor: resouces.gray 
        },
        layout: function(make) {
            make.bottom.inset(3)
            make.width.equalTo(75)
            make.left.equalTo($('langColor').right).offset(2)
        }
    },
    {
        type: "image",
        props: {
            id: "imgStar",
            icon: $icon("062", resouces.gray, resouces.getSize(12))
        },
        layout: function (make) {
            make.bottom.inset(5)
            make.left.equalTo($('lang').right)
        }
    },
    {
        type: "label",
        props: {
            id: "star",
            bgcolor: resouces.transparent,
            titleColor: resouces.gray,
            font: resouces.getFont(12) 
        },
        layout: function (make) {
            make.left.equalTo($('imgStar').right).offset(3)
            make.bottom.inset(2.2)
        }
    },
    {
        type: "image",
        props: {
            id: "imgFork",
            icon: $icon('163', resouces.gray, resouces.getFont(12))
        },
        layout: function (make) {
            make.left.equalTo($('imgStar').right).offset(55)
            make.bottom.inset(4)
        }
    },
    {
        type: "label",
        props: {
            id: "fork",
            bgcolor: resouces.transparent,
            titleColor: resouces.lightGray,
            font: resouces.getFont(12)
        },
        layout: function (make) {
            make.left.equalTo($('imgFork').right).offset(3)
            make.bottom.inset(2.2)
        }
    },
    {
        type: "button",
        props: {
            id: "author",
            textColor: resouces.gray,
            bgcolor: resouces.transparent,
            titleColor: resouces.blue,
            font: resouces.getFont(12) 
        },
        layout: function (make) {
            make.bottom.inset(-5)
            make.right.inset(10)
        }
    }
]

const developerDetailView = [
    {
        type: "label",
        props: {
            id: "index",
            textColor: resouces.gray,
            font: resouces.getBoldFont(16),
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
            bgcolor: resouces.lightGray
        },
        layout: function (make) {
            make.size.equalTo(resouces.getSize(48))
            make.top.insets(5)
            make.left.equalTo($('index').right).offset(10)
        }
    },
    {
        type: "label",
        props: {
            id: "userName",
            textColor: resouces.blue,
            font: resouces.getBoldFont(18),
        },
        layout: function (make) {
            make.top.inset(5)
            make.width.equalTo(121)
            make.left.equalTo($('avatar').right).offset(10)
        }
    },
    {
        type: "label",
        props: {
            id: "nickName",
            textColor: resouces.gray,
            font: resouces.getFont(16)
        },
        layout: function(make){
            make.width.equalTo(121)
            make.top.equalTo($('userName').bottom).offset(5)
            make.left.equalTo($('avatar').right).offset(10)
        }
    },
    {
        type:"image",
        props:{
            id:"imgPopularRepo",
            icon: $icon('135',resouces.orange,resouces.getSize(16)),
        },
        layout:function(make){
            make.left.equalTo($('userName').right).offset(1)
            make.top.equalTo($('index').top).offset(3)
        }
    },
    {
        type: "label",
        props:{
            text: "POPULAR REPO",
            textColor: resouces.orange,
            font: resouces.getFont(14) 
        },
        layout:function(make){
            make.left.equalTo($('imgPopularRepo').right).offset(5) 
            make.top.equalTo($('index').top).offset(3)
        }
    },
    {
        type: "image",
        props: {
            id: "imgRepo",
            icon: $icon('057',resouces.gray,resouces.getSize(14))
        },
        layout: function (make) {
            make.left.equalTo($('imgPopularRepo').left).offset(2)
            make.top.equalTo($('imgPopularRepo').bottom).offset(5)
        }
    },
    {
        type:"button",
        props:{
            bgcolor: resouces.transparent
        },
        views:[
            {
                type:"label",
                props:{
                    id:"repo_name",
                    textColor: resouces.blue
                },
                layout: $layout.fill 
            }
        ],
        layout:function(make){
            make.width.equalTo(150)
            make.left.equalTo($('imgRepo').right).offset(5) 
            make.top.equalTo($('imgRepo').top).offset(-11)
        }
    },
    {
        type:"label",
        props:{
            id:"description",
            titleColor: resouces.gray,
            font: resouces.getFont(12),
            lines:3
        },
        layout:function(make){
            make.left.equalTo($('imgRepo').left) 
            make.right.inset(3)
            make.top.equalTo($('imgRepo').bottom).offset(5)
        } 
    }
]

var repoList = {
    type: "list",
    props: {
        id: "list",
        separatorHidden: false,
        separatorColor: resouces.getColor('white'),
        selectable: true,
        rowHeight: 90,
        template: {
            type: "view",
            props:{
                bgcolor: resouces.lightGray
            },
            views: repoDetailView,
        }
    },
    layout: layout,
    events: {
        didSelect: repolistClicked
    }
}

var developerList = {
    type: "list",
    props: {
        id: "list",
        separatorHidden: false,
        separatorColor: resouces.getColor('white'),
        selectable: true,
        rowHeight: 100,
        template: {
            type: "view",
            props:{
                bgcolor: resouces.lightGray
            },
            views: developerDetailView,
        }
    },
    layout: layout,
    events: {
        didSelect: developerListClicked
    } 
}

exports.repoList = repoList 
exports.developerList = developerList

function layout(make,view){
    make.top.equalTo($('menu').bottom)
    make.right.left.inset(0)
    make.bottom.inset(0)
}

function repolistClicked(tableView,indexPath){
    var data = tableView.object(indexPath)
    openUrl(data.name.text,data.url)
}

function developerListClicked(tableView,indexPath){
    var data = tableView.object(indexPath) 
    openUrl(data.userName.text,data.homePage)
}

function openUrl(title,url) {
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
