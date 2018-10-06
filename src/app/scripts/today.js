var file = $file.read("setting.conf")
var github_user_name = (typeof file == "undefined") ? "sunthx" : file.string.split(',')[0]
var days = (typeof file == "undefined") ? "180" : file.string.split(',')[1]
var rect_max_width_height = 12
var contribution_request_url = "http://127.0.0.1:8080/"
function render(all_data) {
    var totalCount = all_data.length
    var showCount = parseInt(days)
    var data = all_data

    if(showCount > totalCount){
        showCount = totalCount
    }

    if(showCount < totalCount){
        data = all_data.slice(totalCount - showCount)
    }

    console.log(data.length);

    $ui.render({
        views: [
            {
                type: "canvas",
                layout: $layout.fill,
                events: {
                    draw: function (view, ctx) {
                        var column = showCount / 7
                        var row = 7
                        var start_x = 0
                        var start_y = 0
                        var count = 0

                        var current_x = 0
                        var current_y = 0

                        var margin = 2
                        var item_margin = 1

                        var view_width = view.frame.width
                        var rect_width = (view_width - (column - 1) * item_margin - margin * 2) / column
                        if(rect_width > rect_max_width_height){
                            rect_width = rect_max_width_height
                        }

                        var rect_height = rect_width
                        current_x = margin + start_x
                        for (let colIndex = 0; colIndex < column; colIndex++) {
                            current_y = margin + start_y
                            for (let rowIndex = 0; rowIndex < row; rowIndex++) {
                                if (count == showCount) {
                                    break
                                }

                                var rect = { x: current_x, y: current_y, width: rect_width, height: rect_height }

                                ctx.fillColor = $color(data[count])
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

function renderContriByUserName(userName) {
    $ui.loading(true)
    var req_url = contribution_request_url + userName
    $http.get({
        url: req_url,
        handler: function (resp) {
            $ui.loading(false)
            
            var data = resp.data
            data_array = JSON.parse(data)
            var rects = []
            for (let index = 0; index < data_array.length; index++) {
                const contribution = data_array[index];
                rects.push(contribution.color)
            }

            render(rects)
        }
    })
}

renderContriByUserName(github_user_name)