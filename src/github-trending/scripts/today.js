var file = $file.read("setting.conf")
var widget_width = $device.info.screen.width - 10
var github_user_name = (typeof file == "undefined") ? "sunthx" : file.string
var contribution_request_url = "http://192.168.0.106:8080/contributions?user="
var rect_max_width_height = 10
var rect_margin = 1
var view_margin = 5

function render(all_data) {
    var total_count = all_data.length
    var column_count = Math.floor((widget_width - (view_margin * 2)) / (rect_max_width_height + rect_margin))
    var last_week_rect_count = total_count % 7
    var first_item_index = total_count - column_count * 7
    if (last_week_rect_count != 0) {
        first_item_index += (7 - last_week_rect_count)
    }

    var show_data = all_data.slice(first_item_index)
    $ui.render({
        views: [
            {
                type: "canvas",
                layout: $layout.fill,
                events: {
                    draw: function (view, ctx) {
                        var row_count = 7
                        var start_x = 0
                        var start_y = 0
                        var count = 0

                        var current_x = 0
                        var current_y = 0

                        current_x = view_margin + start_x
                        for (let colIndex = 0; colIndex < column_count; colIndex++) {
                            current_y = view_margin + start_y
                            for (let rowIndex = 0; rowIndex < row_count; rowIndex++) {
                                if (count == show_data.length) {
                                    break
                                }

                                var rect = { x: current_x, y: current_y, width: rect_max_width_height, height: rect_max_width_height }

                                ctx.fillColor = $color(show_data[count])
                                ctx.fillRect(rect)
                                ctx.addRect(rect)

                                current_y += rect_max_width_height + rect_margin
                                count++
                            }

                            current_x += rect_max_width_height + rect_margin
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
            var rects = []
            var data_array = resp.data
            for (let index = 0; index < data_array.length; index++) {
                const contribution = data_array[index];
                rects.push(contribution.color)
            }

            render(rects)
        }
    })
}

renderContriByUserName(github_user_name)