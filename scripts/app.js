function render(data) {
  var totalCount = data.length
  $ui.render({
    views: [
      {
        type: "canvas",
        layout: $layout.fill,
        events: {
          draw: function (view, ctx) {
            var column = totalCount / 7
            var row = 7
            var start_x = 0
            var start_y = 20
            var count = 0

            var current_x = 0
            var current_y = 0

            var margin = 5
            var item_margin = 1

            var view_width = view.frame.width
            
            var rect_width = (view_width - (column - 1) * item_margin - margin * 2) / column
            var rect_height = rect_width

            current_x = margin + start_x
            for (let colIndex = 0; colIndex < column; colIndex++) {
              current_y = margin + start_y
              for (let rowIndex = 0; rowIndex < row; rowIndex++) {
                if(count == totalCount){
                  break
                }

                var color = data[count]
                var rect = { x: current_x, y: current_y, width: rect_width, height: rect_height }
                ctx.fillColor = $color("'"+color+"'")

                ctx.fillRect(rect)
                ctx.addRect(rect)
                
                current_y += rect_height + item_margin
                count++
              }
              current_x += rect_width + item_margin
            }
          }
        }
      }
    ]
  })
}

function getDataByUserName() {
  $ui.loading(true)
  $http.get({
    url:'https://github.com/users/sunthx/contributions?to=2018-09-25',
    handler: function (resp) {
      $ui.loading(false)

      var data = resp.data
      var reg = new RegExp('#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]','g')
      var rects = []

      while ((result = reg.exec(data)) != null) {
        rects.push(result.toString())
      }

      render(rects)
    }
  })
}


module.exports = {
  render: getDataByUserName()
}