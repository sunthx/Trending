const api = require("./api");
const colors = require("./colors")
const calendar = colors.calendar

function renderGithubCalendar(data) {
    $ui.render({
        type:"view",
        props:{
            id:"mainView"
        },
        layout: $layout.fill,
        views:[],
        events:{
            appeared: function() {
                var mainView = $('mainView')
                drawToView(mainView.super.size.width,mainView,data)
            }
        }
    })
}

function drawToView(canvasWidth,view,data){
    var defaultSquareWidth = 13
    var defaultSpacing = 1.5
    var maxN = canvasWidth / defaultSquareWidth - defaultSpacing
    var squareWidth = (canvasWidth - maxN - 1) / maxN
    
    var columnNumber = parseInt(maxN)
    var spacing = (canvasWidth - (columnNumber * squareWidth)) / (columnNumber + 1)
    var matrixHeight = 7 * squareWidth + 8
    var rowNumber = 7

    var canvas = {
        type: "canvas",
        layout: function(make,view){
            make.right.left.insets(0)
            make.height.equalTo(matrixHeight)
        },
        events: {
            draw: function (view, ctx) {
                var lastWeekday = data[0].weekday
                var total = columnNumber * rowNumber - (6 - lastWeekday)
                data = data.slice(0,total).reverse()
            
                var startX = 0
                var startY = 0
                var curX = 0
                var curY = 0
                var index = 0
            
                var colorIndex = Math.floor(Math.random()*Math.floor(2))
                var currentColor = calendar[colorIndex]
                curX = spacing + startX
                for (let colIndex = 0; colIndex < columnNumber; colIndex++) {
                    curY = spacing + startY
                    for (let rowIndex = 0; rowIndex < rowNumber; rowIndex++) {
                        if(index == data.length)
                            return
            
                        var rect = { 
                            x: curX, 
                            y: curY, 
                            width: squareWidth, 
                            height: squareWidth
                        }
            
                        var colorValue = currentColor[data[index].level]
                        ctx.fillColor = $color(colorValue)
                        ctx.fillRect(rect)
                        ctx.addRect(rect)
            
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
    if(userName == null || userName == "") {
        return null
    }

    $ui.loading(true)
    var data =  await api.getContributionData(userName)
    $ui.loading(false)
    renderGithubCalendar(data)
}

function getGithubUserNameFromConfigFile() {
    var file = $file.read("setting.conf")
    return (typeof file == "undefined") ? "" : file.string
}

function setGithubUserName(userName){
    $file.write({
        data: $data({string: userName}),
        path: "setting.conf"
    });
}

var userName = getGithubUserNameFromConfigFile()
if(userName == ""){
    $ui.render({
        props: {
            title: ""
        },
        views: [
            {
                type:"label",
                props:{
                    id:"lbMsg",
                    font: $font('JetBrains Mono',14),
                    text:"System.NullReferenceException: Object reference not set to an instance of an object.",
                    align: $align.center,
                    lines:999
                },
                layout: function(make,view){
                    make.top.insets(5)
                    make.right.left.insets(10)
                }
            },
            {
            type: "button",
            props: {
                id: "btnSetUserName",
                title: "FIX",
                font: $font('JetBrains Mono',18),
                icon: $icon("052", $color('white'), $size(16,16)),
                contentEdgeInsets: $insets(10, 10, 10, 10),
                imageEdgeInsets: $insets(0,-10,0,0)
            },
            layout: function(make){
                make.top.equalTo($('lbMsg').bottom).offset(5)
                make.right.left.insets(10)
            },
            events: {
                tapped: function(){
                    $input.text({
                        type: "input",
                        placeholder: "github.username = ?",
                        handler: function(text) {
                            if(text == ""){
                                $ui.alert({
                                    title: "ERROR",
                                    message: "Github.UserName = NULL",
                                });
                                return;
                            }
    
                            setGithubUserName(text)
                            
                            $ui.alert({
                                title: "SUCCEED",
                                message: "Github.UserName = " + text,
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
