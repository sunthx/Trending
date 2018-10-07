var file = $file.read("setting.conf")
var github_user_name = (typeof file == "undefined") ? "sunthx" : file.string
var widget_width = $device.info.screen.width

function saveSetting(value) {
  $file.write({
    data: $data({ string: value }),
    path: "setting.conf"
  })
}

$ui.render({
  type: "view",
  layout: function (make, view) {
    make.top.equalTo(view.super).offset(20)
    make.centerX.equalTo(view.super)
  },
  views: [{
    type: "label",
    props: {
      text: $l10n("SET_GITHUB_NAME"),
      font: $font("default", 32)
    },
    layout: function (make, view) {
      make.top.equalTo(view.super).offset(10)
      make.left.equalTo(view.super).offset(10)
    }
  }, {
    type: "input",
    props: {
      id: "txt_name",
      type: $kbType.default,
      text: github_user_name,
      font: $font("default", 30)
    },
    layout: function (make, view) {
      make.top.equalTo(view.super).offset(60)
      make.left.equalTo(view.super).offset(10)
      make.size.equalTo($size(widget_width - 20, 60))
    }
  }, {
    type: "button",
    props: {
      title: $l10n("SAVE")
    },
    layout: function (make, view) {
      make.top.equalTo(view.super).offset(150)
      make.left.equalTo(view.super).offset(10)
      make.size.equalTo($size(widget_width - 20, 60))
    },
    events: {
      tapped: function () {
        var userName = $("txt_name").text
        if (userName == "") {
          userName = "sunthx"
        }

        saveSetting(userName)
        $app.close()
      }
    }
  }]
})