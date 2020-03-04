const updater = require('scripts/updater')
const db = require('scripts/data')
const app = $app.env == $env.today ? require('scripts/today') : require('scripts/app')

// 启动调试信息
$console.clear();

// 启动
app.startup()

// 启动更新
updater.check()

// db check
db.init()