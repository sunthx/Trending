exports.header = {
    type: "view",
    layout: function (make, view) {
        make.height.equalTo(100)
        make.top.left.right.inset(0)
        make.width.equalTo(view.super)
    },
    props: {
        id: "header",
        bgcolor: $color("#f8f8f8")
    },
    views: [{
        type: "label",
        props: {
            id: "lbTitle",
            text: "Trending",
            align: $align.center,
            font: $font("JetBrains Mono",18)
        },
        layout: $layout.center
    },
    {
        type: "label",
        props: {
            text: "See what the GitHub community is most excited about today.",
            align: $align.center,
            font: $font("JetBrains Mono",14),
            textColor: $color('#586069'),
            lines: 2
        },
        layout: function (make, view) {
            make.top.equalTo($('lbTitle').bottom)
            make.width.equalTo(view.super)
        }
    }]
}