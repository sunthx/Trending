exports.header = {
    type: "view",
    layout: function (make, view) {
        make.height.equalTo(125)
        make.width.equalTo(view.super)
    },
    props: {
        id: "header",
        height: 125,
        bgcolor: $color("#f8f8f8")
    },
    views: [{
        type: "label",
        props: {
            text: "Trending",
            align: $align.center,
            font: $font(22)
        },
        layout: function (make, view) {
            make.width.equalTo(view.super)
            make.top.equalTo(30)
        }
    },
    {
        type: "label",
        props: {
            text: "See what the GitHub community is most excited about today.",
            align: $align.center,
            font: $font(16),
            textColor: $color('#586069'),
            lines: 2
        },
        layout: function (make, view) {
            make.top.equalTo(60)
            make.width.equalTo(view.super)
        }
    }]
}