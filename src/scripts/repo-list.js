const resources = require('./resources')
const iconSize = resources.getSize(10)

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
            let repo = $('imgRepoIcon')
            make.left.equalTo(repo.right).offset(5)
            make.top.equalTo(repo.top).offset(-4)
        }
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
            //TODO: 动态计算 
            make.width.equalTo(300)
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
    },
    {
        type: "image",
        props: {
            id: "imgStar",
            icon: $icon("062", resources.black, iconSize)
        },
        layout: function (make) {
            make.left.equalTo($('lang').right)
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
    },
]

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
            props:{
                bgcolor: resources.transparent,
            },
            views:[
                {
                    type:"view",
                    props:{
                        id:"itemTemplate",
                        bgcolor: resources.white,
                        circular: true,
                        smoothRadius:3,
                        shadowColor: resources.orange,
                    },
                    layout:function(make,view){
                        make.height.equalTo(90)
                        make.left.right.insets(10)
                    },
                    views: repoDetailView
                }
            ],
        }
    },
    layout: function(make,view){
        make.top.equalTo($('menu').bottom)
        make.right.left.inset(0)
        make.bottom.equalTo($('navMenu').top)
    },
    events: {
        didSelect: repolistClicked,
        didLongPress: function(sender, indexPath, data) {
            var data = sender.object(indexPath)
            $share.sheet([data.url])
        }
    }
}

function repolistClicked(sender, indexPath,data) {
    resources.openUrl(data.name.text, data.url)
}

exports.repoList = repoList



