const header = require("./header").header
const api = require("./api")

const secondColor = $color('#0366d6')
var menu = {
    type: "view",
    props: {
        bgcolor: $color.clear
    },
    layout: function (make, view) {
        make.left.right.inset(0)
        make.height.equalTo(50)
        make.top.inset(125)
    },
    views: [
        {
            type: "tab",
            layout: function (make, view) {
                make.left.top.inset(10)
            },
            props: {
                items: ["Repositories", "Developers"],
                tintColor: secondColor
            }
        },
        {
            type: "button",
            props: {
                bgcolor: secondColor,
                title: "Weekly",
                font: $font(12)
            },
            layout: function (make) {
                make.top.inset(10)
                make.right.inset(10)
                make.size.equalTo($size(70, 30))
            }
        }
    ]
}

const repoDetailViews = [
    {
        type: "image",
        props: {
            src: "/assets/repo.png"
        },
        layout: function(make){
            make.top.inset(8)
            make.left.inset(10)
            make.size.equalTo($size(16,16))
        }
    },
    {
        type: "label",
        props: {
            id: "name",
            bgcolor: $color('clear'),
            textColor: secondColor,
            font: $font('bold',16)
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
        type: "label",
        props: {
            id: "lang",
            font: $font("bold","12")
        },
        layout: function (make) {
            make.bottom.inset(5)
            make.right.inset(10)
        }
    }
]

var repoListItemTemplate = {
    type: "view",
    views: repoDetailViews,
}

var repoList = {
    type: "list",
    props: {
        id: "repoListView",
        separatorHidden: false,
        style: 0,
        selectable: true,
        template: repoListItemTemplate,
        rowHeight: 100
    },
    layout: function (make, view) {
        make.top.inset(170)
        make.right.left.inset(0)
        make.bottom.inset(0)
    },
    events: {
        didSelect: trendingListClick
    }
}

function trendingListClick(tableView, indexPath) {
    var data = tableView.object(indexPath)
    var url = data.url

    $ui.push({
        props: {
            title: data.name.text
        },
        views: [{
            type: "web",
            props: {
                url: url
            },
            layout: $layout.fill
        }]
    })
}


async function render() {
    var main_view = {
        type: "view",
        layout: $layout.fill,
        props: {
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


    const res = await api.getTrendingData();
    $("repoListView").data = res;
}

render()