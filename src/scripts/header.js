const resources = require('./resources')

exports.header = {
    type: "view",
    layout: function (make, view) {
        make.height.equalTo(100)
        make.top.left.right.inset(0)
        make.width.equalTo(view.super)
    },
    props: {
        id: "header",
        bgcolor: resources.lightGray
    },
    views: [{
        type: "label",
        props: {
            id: "lbTitle",
            text: $l10n("TRENDING_TITLE"),
            align: $align.center,
            font: resources.getMonoFont(18)
        },
        layout: $layout.center
    },
    {
        type: "label",
        props: {
            text: $l10n("TRENDING_DESC"),
            align: $align.center,
            font: resources.getMonoFont(14),
            textColor: resources.gray,
            lines: 2
        },
        layout: function (make, view) {
            make.top.equalTo($('lbTitle').bottom)
            make.width.equalTo(view.super)
        }
    }]
}