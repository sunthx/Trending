const api = require("./api")
const config = require("./config")
const resources = require("./resources")
const calendar = resources.calendar
var _isInitialized = false

// 绘制 Github 日历
function renderGithubCalendar(data) {
    $ui.render({
        type: "view",
        props: {
            id: "mainView",
        },
        layout: $layout.fill,
        events: {
            appeared: function () {
                var mainView = $('mainView')
                drawToView(mainView.super.size.width, mainView, data)
            }
        }
    })
}

function drawCalendarItem(x, y, w, h, r, color, ctx) {
    ctx.moveToPoint(w + x, h + y - r)

    //右下角
    ctx.addArcToPoint(w + x, h + y, w + x - r, h + y, r)

    //左下角
    ctx.addArcToPoint(0 + x, h + y, x, h + y - r, r)

    //左上角
    ctx.addArcToPoint(x, y, r + x, y, r)

    //右上角
    ctx.addArcToPoint(w + x, y, w + x, r + y, r)

    ctx.closePath()

    ctx.fillColor = $color(color)
    ctx.fillPath()
}

function drawToView(canvasWidth, view, data) {
    var insetTopBottom = 5
    var insetLeftRight = 1
    var defaultSquareWidth = 12
    var defaultSpacing = 2
    var defaultRadius = 5

    canvasWidth = canvasWidth - 2 * insetLeftRight
    var maxN = (canvasWidth - defaultSpacing) / (defaultSquareWidth + defaultSpacing)
    var squareWidth = (canvasWidth - maxN - 1) / maxN

    var columnNumber = parseInt(maxN)
    var spacing = (canvasWidth - (columnNumber * squareWidth)) / (columnNumber + 1)
    var matrixHeight = 7 * squareWidth + 8 * spacing + 2 * insetTopBottom
    var rowNumber = 7

    var lastWeekday = data[0].weekday
    var total = columnNumber * rowNumber - (6 - lastWeekday)
    data = data.slice(0, total).reverse()

    var startX = insetLeftRight
    var startY = insetTopBottom
    var curX = 0
    var curY = 0
    var index = 0

    var colorIndex = Math.floor(Math.random() * Math.floor(calendar.length))
    var currentColor = calendar[colorIndex]
    curX = spacing + startX

    let canvas = {
        type: "canvas",
        props:{
            id: "calendar"
        },
        layout: function(make,view){
            make.height.equalTo(matrixHeight)
            make.left.right.insets(0)
        },
        events:{
            draw: function(view,ctx){
                for (let colIndex = 0; colIndex < columnNumber; colIndex++) {
                    curY = spacing + startY
                    for (let rowIndex = 0; rowIndex < rowNumber; rowIndex++) {
                        if (index == data.length)
                            break
            
                        var datalevel = data[index].level
                        var colorValue = currentColor[datalevel]
                        drawCalendarItem(curX, curY, squareWidth, squareWidth, defaultRadius, colorValue,ctx)
                        curY += squareWidth + spacing
                        index++
                    }
            
                    curX += squareWidth + spacing
                }
            }
        }
    }

    view.add(canvas)
}

async function loadGithubCalendar(userName) {
    if (userName == null || userName == "") {
        return null
    }

    $ui.loading(true)
    var data = await api.getContributionData(userName)
    $ui.loading(false)
    renderGithubCalendar(data)
    _isInitialized = true
}

function init() {
    var userName = config.getUserName()
    if (userName == "") {
        $ui.render({
            props: {
                title: ""
            },
            views: [
                {
                    type: "button",
                    props: {
                        id: "btnSetUserName",
                        title: $l10n("NOT_SET_USERNAME"),
                        font: resources.getMonoFont(14),
                        bgcolor: resources.transparent,
                        titleColor: resources.getColor('black')
                    },
                    layout: $layout.fill,
                    events: {
                        tapped: function () {
                            $input.text({
                                type: "input",
                                placeholder: "",
                                handler: function (text) {
                                    if (text == "") {
                                        $ui.alert({
                                            title: $l10n("MSG_ERROR"),
                                            message: $l10n("MSG_ERROR_USERNAME_EMPTY"),
                                        });
                                        return;
                                    }

                                    config.setUserName(text)

                                    $ui.alert({
                                        title: $l10n("MSG_SUCCEED"),
                                        message: $l10n("MSG_SETTING_OK") + text,
                                    });

                                    loadGithubCalendar(text)
                                }
                            });
                        }
                    }
                }]
        });
    } else {
        loadGithubCalendar(userName)
    }
}

exports.startup = init