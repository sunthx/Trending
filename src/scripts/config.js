const configFile = "shared://trending_setting.conf"
const defaultFile = "trending_setting.conf"
const versionFile = "version.conf"

function check() {
    var exists = $file.exists(configFile)
    if (!exists) {
        $file.copy({
            src: defaultFile,
            dst: configFile
        });
    }
}

exports.getUserName = function () {
    check()
    var file = $file.read(configFile)
    return (typeof file == "undefined") ? "" : file.string
}

exports.setUserName = function(name) {
    check()
    $file.write({
        data: $data({ string: name }),
        path: configFile
    })
}

exports.clearUserName = function() {
    check()
    $file.write({
        data: $data({ string: "" }),
        path: configFile
    });
}

exports.getVersion = ()=> {
    return $file.read("version.conf").string;
}