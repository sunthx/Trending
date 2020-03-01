const resources = require('./resources')
const config = require('./config')
const api = require('./api')
const version = config.getVersion()

exports.header = {
    type: "view",
    layout: function (make, view) {
        make.height.equalTo(80)
        make.top.left.right.inset(0)
    },
    props: {
        id: "header",
        bgcolor: resources.white
    },
    views: [
        {
            type: "image",
            props: {
                id: "imgAppIcon",
                icon: $icon('177', resources.black, resources.getSize(30))
            },
            layout: function (make) {
                make.top.inset(40)
                make.left.inset(10)
            }
        },
        {
            type: "label",
            props: {
                id: "lbTitle",
                text: $l10n("TRENDING_TITLE"),
                font: resources.getMonoFont(18)
            },
            layout: function (make) {
                let icon = $('imgAppIcon')
                make.left.equalTo(icon.right).offset(10)
                make.top.equalTo(icon.top).offset(3)
            }
        },
        {
            type: "label",
            props: {
                id: "lbVersion",
                text: version,
                textColor: resources.drakgray,
                font: resources.getMonoFont(12)
            },
            layout: function (make) {
                let title = $('lbTitle')
                make.left.equalTo(title.right).offset(6)
                make.top.equalTo(title.top).offset(7)
            }
        }
    ]
}

function showUserNameInput() {
    let userName = config.getUserName();
    $input.text({
        type: "input",
        text: userName,
        placeholder: $l10n("WM_USERNAME"),
        handler: async function (text) {
            config.setUserName(text)

            if (text == "") {
                $ui.toast($l10n("RESET_USER_NAME"));
                showSettingButton()
                return
            }

            $ui.alert({
                title: $l10n("MSG_SUCCEED"),
                message: $l10n("MSG_SETTING_OK") + text,
            });

            showAvatar(text)
        }
    });
}

async function showAvatar(name) {
    var user = await api.getUser(name)
    if (user == null) {
        return
    }

    var setting = $('btnSettingUser')
    if (setting != undefined) {
        setting.remove()
    }

    let avatarUrl = user.avatar
    let avatar = {
        type: "image",
        props: {
            id: "avatar",
            circular: true,
            src: avatarUrl,
            bgcolor: resources.lightGray
        },
        layout: function (make, view) {
            make.size.equalTo(resources.getSize(30))
            make.top.inset(40)
            make.right.inset(10)
        },
        events: {
            tapped: showUserNameInput
        }
    }

    $('header').add(avatar)
}

function showSettingButton() {
    var setting = $('avatar')
    if (setting != undefined) {
        setting.remove()
    }

    let btn =
    {
        type: "button",
        props: {
            id: "btnSettingUser",
            bgcolor: resources.transparent,
            title: $l10n('NOT_SET_USER_NAME'),
            titleColor: resources.drakgray,
            font: resources.getFont(14),
            imageEdgeInsets: $insets(0, 0, 0, 10),
        },
        layout: function (make) {
            make.top.inset(40)
            make.right.inset(10)
        },
        events: {
            tapped: showUserNameInput
        }
    }

    $('header').add(btn)
}

exports.showSettingButton = showSettingButton
exports.showAvatar = showAvatar