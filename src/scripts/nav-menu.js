const resources = require('./resources')
const repoList = require('./repo-list')
const menu = require('./menu')
const itemCount = 2
const itemWidth = $device.info.screen.width / itemCount
const itemIconSize = 20
const itemDefaultBgColor = resources.drakgray

function genNavItem(index,id,text,icon){
    return {
        type: 'button',
        props:{
            id: id,
            bgcolor: resources.black,
        },
        layout: function(make,view){
            make.height.equalTo(view.super)
            make.width.equalTo(itemWidth)

            let leftMargin = itemWidth * index
            make.left.equalTo(leftMargin)
        },
        views:[
            {
                type: 'image',
                props:{
                    id: 'icon',
                    icon : $icon(icon, itemDefaultBgColor , resources.getSize(itemIconSize)),
                },
                layout: function(make,view) {
                    let margin = (itemWidth - itemIconSize) / 2
                    make.left.equalTo(margin)
                    make.top.equalTo(10)
                }
            },
            {
                type: 'label',
                props:{
                    text: text,
                    textColor: itemDefaultBgColor,
                    font: resources.getFont(12),
                    align: $align.center
                },
                layout: (make,view) => {
                    make.top.equalTo($('icon').bottom).offset(5)
                    make.width.equalTo(view.super)
                }
            }
        ],
        events:{
            tapped: async function(make) {
                if(index == 0) {
                    await repoList.loadRepoList()
                } else {
                    repoList.loadLikedList()
                }
            }
        }
    }
}

const navMenu = 
{
    type:"view",
    props:{
        id: "navMenu",
        bgcolor: resources.black
    },
    layout: function(make,view){
        make.right.left.bottom.insets(0)

        let height = $device.isIphoneX ? 90 : 60
        make.height.equalTo(height)
    },
    views:[
        genNavItem(0,"navTrending","Trending","164"), 
        genNavItem(1,"navFavorite","Favorite","120"),
    ]
}

exports.view = navMenu