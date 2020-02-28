const resources = require('./resources')

exports.header = {
    type: "view",
    layout: function (make, view) {
        make.height.equalTo(60)
        make.top.left.right.inset(0)
    },
    props: {
        id: "header",
        bgcolor: resources.white
    },
    views: [
        {
            type: "image",
            props: {
                id:"imgAppIcon",
                icon: $icon('177', resources.black, resources.getSize(30))
            },
            layout: function (make) {
                make.top.inset(20)
                make.left.inset(20)
            }
        },
        {
        type: "label",
        props: {
            id: "lbTitle",
            text: $l10n("TRENDING_TITLE"),
            font: resources.getMonoFont(18)
        },
        layout: function(make){
            let icon = $('imgAppIcon')
            make.left.equalTo(icon.right).offset(10)
            make.top.equalTo(icon.top).offset(3)
        }
    }]
}