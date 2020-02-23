const api = require("./api");
const colors = require("./resources")
const calendar = colors.calendar
const MonoFont = $font('JetBrains Mono',18)
const configFile = "setting.conf"

var isInitialized = false

const operationButtons =[
    {
        type: "button",
        props:{
            id:"btnReset",
            title: "Reset  ",
            font: MonoFont,
            bgcolor: $color('#0366d6'),
            icon: $icon("030", $color('white'), $size(16,16)),
            contentEdgeInsets: $insets(10, 10, 10, 10),
            imageEdgeInsets: $insets(0,-10,0,0)
        },
        layout: function(make){
            make.right.left.inset(5)
            make.width.equalTo(100)
            make.top.equalTo($('csCal').bottom).offset(15)
        },
        events:{
            tapped: function(){
                $device.taptic(0)
                clearGithubUserName()
                refresh()
            }
        }
    },
    {
        type: "button",
        props: {
            id: "btnSetUserName",
            title: "Refresh",
            font: MonoFont,
            bgcolor: $color('#0366d6'),
            icon: $icon("162", $color('white'), $size(16,16)),
            contentEdgeInsets: $insets(10, 10, 10, 10),
            imageEdgeInsets: $insets(0,-10,0,0)
        },
        layout: function(make){
            make.right.left.inset(5)
            make.top.equalTo($('btnReset').bottom).offset(10) 
        },
        events:{
            tapped: function(){
                $device.taptic(0)
                refresh()
            }
        }
            
    }];

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

                operationButtons.forEach(function(item){
                    $('mainView').add(item)
                })
                
            }
        }
    })
}

function drawToView(canvasWidth,view,data){
    var insetTopBottom = 0
    var insetLeftRight = 5
    var defaultSquareWidth = 12
    var defaultSpacing = 1.5

    canvasWidth = canvasWidth - 2 * insetLeftRight
    var maxN = (canvasWidth - defaultSpacing) / (defaultSquareWidth + defaultSpacing)
    var squareWidth = (canvasWidth - maxN - 1) / maxN
    
    var columnNumber = parseInt(maxN)
    var spacing = (canvasWidth - (columnNumber * squareWidth)) / (columnNumber + 1)
    var matrixHeight = 7 * squareWidth + 8 * spacing + 2 * insetTopBottom
    var rowNumber = 7

    var canvas = {
        type: "canvas",
        props:{
            id:"csCal"
        },
        layout: function(make,view){
            make.right.left.insets(0)
            make.height.equalTo(matrixHeight)
        },
        events: {
            draw: function (view, ctx) {
                var lastWeekday = data[0].weekday
                var total = columnNumber * rowNumber - (6 - lastWeekday)
                data = data.slice(0,total).reverse()
            
                var startX = insetLeftRight
                var startY = insetTopBottom
                var curX = 0
                var curY = 0
                var index = 0
            
                var colorIndex = Math.floor(Math.random()*Math.floor(calendar.length))
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
    isInitialized = true
}

function getGithubUserNameFromConfigFile() {
    var file = $file.read(configFile)
    return (typeof file == "undefined") ? "" : file.string
}

function setGithubUserName(userName){
    $file.write({
        data: $data({string: userName}),
        path: configFile
    });
}

function clearGithubUserName(){
    $file.write({
        data: $data({string: ""}),
        path: configFile
    }); 
}

function init(){
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

    $widget.height = 100
}

function refresh(){
    $('mainView').remove()
    init()
}

init()


