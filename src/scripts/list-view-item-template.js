const resouces = require('./resources')
const iconSize = resouces.getSize(10)

const repoDetailView = [
    {
        type: "image",
        props: {
            id: "avatar",
            circular: true
        },
        layout: function (make, view) {
            make.size.equalTo(resouces.getSize(30))
            make.top.left.inset(10)
        }
    },
    {
        type: "image",
        props: {
            id: "imgRepoIcon",
            icon: $icon('057', resouces.black, iconSize)
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
            bgcolor: resouces.transparent,
            textColor: resouces.black,
            font: resouces.getBoldFont(14),
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
            font: resouces.getFont(12),
            textColor: resouces.gray,
            align: $align.left
        },
        layout: function (make) {
            //TODO: 动态计算 
            make.width.equalTo(340)
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
            font: resouces.getFont(10),
            textColor: resouces.black
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
            icon: $icon("062", resouces.black, iconSize)
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
            bgcolor: resouces.transparent,
            font: resouces.getFont(10)
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
            icon: $icon('163', resouces.black, iconSize)
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
            bgcolor: resouces.transparent,
            titleColor: resouces.lightGray,
            font: resouces.getFont(10)
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
            icon: $icon('164', resouces.black, iconSize)
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
            bgcolor: resouces.transparent,
            titleColor: resouces.lightGray,
            font: resouces.getFont(10)
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
        bgcolor: resouces.lightGray,
        separatorHidden: true,
        selectable: true,
        rowHeight: 100,
        template: {
            type: "view",
            props:{
                bgcolor: resouces.transparent
            },
            views:[
                {
                    type:"view",
                    props:{
                        bgcolor: resouces.white,
                        circular: true,
                        smoothRadius:3,
                        shadowColor: resouces.orange
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
    layout: layout,
    events: {
        didSelect: repolistClicked
    }
}

const developerDetailView = [
    {
        type: "label",
        props: {
            id: "index",
            textColor: resouces.gray,
            font: resouces.getBoldFont(16),
            lines: 2
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
        layout: function (make) {
            make.width.equalTo(121)
            make.top.equalTo($('userName').bottom).offset(5)
            make.left.equalTo($('avatar').right).offset(10)
        }
    },
    {
        type: "image",
        props: {
            id: "imgPopularRepo",
            icon: $icon('135', resouces.orange, resouces.getSize(16)),
        },
        layout: function (make) {
            make.left.equalTo($('userName').right).offset(1)
            make.top.equalTo($('index').top).offset(3)
        }
    },
    {
        type: "label",
        props: {
            text: "POPULAR REPO",
            textColor: resouces.orange,
            font: resouces.getFont(14)
        },
        layout: function (make) {
            make.left.equalTo($('imgPopularRepo').right).offset(5)
            make.top.equalTo($('index').top).offset(3)
        }
    },
    {
        type: "image",
        props: {
            id: "imgRepo",
            icon: $icon('057', resouces.gray, resouces.getSize(14))
        },
        layout: function (make) {
            make.left.equalTo($('imgPopularRepo').left).offset(2)
            make.top.equalTo($('imgPopularRepo').bottom).offset(5)
        }
    },
    {
        type: "button",
        props: {
            bgcolor: resouces.transparent
        },
        views: [
            {
                type: "label",
                props: {
                    id: "repo_name",
                    textColor: resouces.blue
                },
                layout: $layout.fill
            }
        ],
        layout: function (make) {
            make.width.equalTo(150)
            make.left.equalTo($('imgRepo').right).offset(5)
            make.top.equalTo($('imgRepo').top).offset(-11)
        }
    },
    {
        type: "label",
        props: {
            id: "description",
            titleColor: resouces.gray,
            font: resouces.getFont(12),
            lines: 3
        },
        layout: function (make) {
            make.left.equalTo($('imgRepo').left)
            make.right.inset(3)
            make.top.equalTo($('imgRepo').bottom).offset(5)
        }
    }
]

const developerList = {
    type: "list",
    props: {
        id: "list",
        separatorHidden: false,
        separatorColor: resouces.getColor('white'),
        selectable: true,
        rowHeight: 100,
        template: {
            type: "view",
            props: {
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

function layout(make, view) {
    make.top.equalTo($('menu').bottom)
    make.right.left.inset(0)
    make.bottom.inset(0)
}

function repolistClicked(tableView, indexPath) {
    var data = tableView.object(indexPath)
    openUrl(data.name.text, data.url)
}

function developerListClicked(tableView, indexPath) {
    var data = tableView.object(indexPath)
    openUrl(data.userName.text, data.homePage)
}

function openUrl(title, url) {
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
