const resources = require('./resources')

const developerDetailView = [
    {
        type: "label",
        props: {
            id: "index",
            textColor: resources.gray,
            font: resources.getBoldFont(16),
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
            bgcolor: resources.lightGray
        },
        layout: function (make) {
            make.size.equalTo(resources.getSize(48))
            make.top.insets(5)
            make.left.equalTo($('index').right).offset(10)
        }
    },
    {
        type: "label",
        props: {
            id: "userName",
            textColor: resources.blue,
            font: resources.getBoldFont(18),
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
            textColor: resources.gray,
            font: resources.getFont(16)
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
            icon: $icon('135', resources.orange, resources.getSize(16)),
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
            textColor: resources.orange,
            font: resources.getFont(14)
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
            icon: $icon('057', resources.gray, resources.getSize(14))
        },
        layout: function (make) {
            make.left.equalTo($('imgPopularRepo').left).offset(2)
            make.top.equalTo($('imgPopularRepo').bottom).offset(5)
        }
    },
    {
        type: "button",
        props: {
            bgcolor: resources.transparent
        },
        views: [
            {
                type: "label",
                props: {
                    id: "repo_name",
                    textColor: resources.blue
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
            titleColor: resources.gray,
            font: resources.getFont(12),
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
        separatorColor: resources.getColor('white'),
        selectable: true,
        rowHeight: 100,
        template: {
            type: "view",
            props: {
                bgcolor: resources.lightGray
            },
            views: developerDetailView,
        }
    },
    layout: layout,
    events: {
        didSelect: developerListClicked
    }
}

function layout(make, view) {
    make.top.equalTo($('menu').bottom)
    make.right.left.inset(0)
    make.bottom.inset(0)
}

function developerListClicked(tableView, indexPath) {
    var data = tableView.object(indexPath)
    resources.openUrl(data.userName.text, data.homePage)
}


exports.developerList = developerList