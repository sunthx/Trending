var device_width = $device.info.screen.width
var device_height = $device.info.screen.height
var trending_request_url = "http://192.168.31.102:8080/trending"

var header = {
  type: "view",
  layout: function (make, view) {
    make.height.equalTo(125)
    make.width.equalTo(view.super)
  },
  props: {
    height: 125,
    bgcolor: $color('#f8f8f8')
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
      make.width.equalTo(300)
      make.top.equalTo(60)
      make.centerX.equalTo(view.super)
    }
  }]
}

var repo_list_item_detail = {
  type: "view",
  layout: $layout.fill,
  views: [{
    type: "button",
    props: {
      id: "name",
      titleColor: $color('black'),
      font: $font(18),
      bgcolor: $color('clear')
    },
    layout: function (make, view) {
      make.left.equalTo(10)
      make.height.equalTo(40)
    }
  }, {
    type: "label",
    props: {
      id: "description",
      lines: 999,
      font: $font("14"),
      textColor: $color('#586069')
    },
    layout: function (make, view) {
      make.left.equalTo(10)
      make.top.equalTo(40)
      make.width.equalTo(view.super)
    }
  }, {
    type: "label",
    props: {
      id: "lang",
      font: $font("12")
    },
    layout: function (make, view) {
      make.bottom.equalTo(-10)
      make.right.equalTo(-10)
    }
  }, {
    type: "button",
    props: {
      id: "star",
      font: $font("12"),
      bgcolor: $color('clear'),
      titleColor: $color('#586069'),
      icon: $icon('icon_062.png', $color('#586069'), $size(12, 12))
    },
    layout: function (make, view) {
      make.bottom.equalTo(-10)
      make.left.equalTo(10)
    }
  }, {
    type: "button",
    props: {
      id: "fork",
      font: $font("12"),
      bgcolor: $color('clear'),
      titleColor: $color('#586069'),
      icon: $icon('icon_163.png', $color('#586069'), $size(12, 12))
    },
    layout: function (make, view) {
      make.bottom.equalTo(-10)
      make.left.equalTo(80)
    }
  }]
}

var repo_list_item = {
  props: {
    bgcolor: $color("clear")
  },
  views: [
    {
      type: "view",
      props: {
        bgcolor: $color('#f8f8f8')
      },
      layout: function (make, view) {
        make.centerX.equalTo(view.super)
        make.height.equalTo(120)
        make.width.equalTo(device_width - 10)
      },
      views: [repo_list_item_detail]
    }
  ]
}

var repo_list = {
  type: "list",
  props: {
    separatorHidden: true,
    rowHeight: 130,
    template: repo_list_item,
    selectable: true
  },
  layout: function (make, view) {
    make.top.equalTo(135)
    make.height.equalTo(device_height - 150)
    make.width.equalTo(view.super)
  },
  events:{
    didSelect: function (tableView,indexPath) {
      var data = tableView.object(indexPath)
      $app.openBrowser({
        url:data.url
      })
    }
  }
}


function render(data) {
  repo_list.props.data = data
  var main_view = {
    props:{
      navBarHidden: true,
      statusBarStyle: 0
    },
    views: [header, repo_list]
  }

  $ui.render(main_view)
}

function getTrendingData() {
  $http.get({
    url: trending_request_url,
    handler: function (resp) {
      $ui.loading(false)
      var data_source = []
      var data_array = resp.data.Repositories

      for (let index = 0; index < data_array.length; index++) {
        const repo_item = data_array[index]
        var data_item = {
          name: { title: repo_item.name },
          lang: { text: repo_item.lang },
          description: { text: repo_item.description.replace(/<g-emoji [\s\S]*?>|<\/g-emoji>|<a[\s\S]*?>|<\/a>/g,"") },
          star: { title: repo_item.star },
          fork: { title: repo_item.fork },
          url:repo_item.url 
        }

        data_source.push(data_item)
      }

      render(data_source)
    }
  })
}

getTrendingData()

// $ui.render({
//   views: [
//     {
//       type: "menu",
//       layout: function(make,view) {
//         make.left.right.equalTo(0)
//         make.bottom.equalTo(view.super.bottom).offset(2)
//         make.height.equalTo(82)
//       },
//       events: {
//         changed: function(sender) {
//         }
//       },
//       views: [{

//       }]
//     }
//   ]
// })