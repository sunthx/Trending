const trendingDbFilePath = "shared://trending_data.db"

function deleteDbFile() {
    if ($file.exists(trendingDbFilePath)) {
        $file.delete(trendingDbFilePath);
    }
}

function init() {
    if ($file.exists(trendingDbFilePath)) {
        return
    }

    var db = $sqlite.open(trendingDbFilePath)
    db.update("CREATE TABLE repo_like(id text,data text)")
    $sqlite.close(db)
}

function addRepo(data) {
    let db = $sqlite.open(trendingDbFilePath)
    db.update({
        sql: "INSERT INTO repo_like values(?,?)",
        args: [data.id, data.data]
    })
    $sqlite.close(db)
}

function checkRepoExist(id) {
    let db = $sqlite.open(trendingDbFilePath)
    let res = db.query({
        sql: "SELECT * FROM repo_like WHERE id = ?",
        args: [id]
    })

    let exist = res.result.next()
    $sqlite.close(db)

    return exist
}

function getRepo() {
    let repoMap = new Map()
    let db = $sqlite.open(trendingDbFilePath)
    db.query({
        sql: "SELECT * FROM repo_like"
    },(rs,err) => {
        while (rs.next()) {
            let values = rs.values
            let repo = {
                id: values.id,
                data: JSON.parse(values.data)
            }
            repoMap.set(repo.id, repo)
        }
        rs.close()
    })

    $sqlite.close(db)
    return repoMap
}

function deleteRepo(id) {
    let db = $sqlite.open(trendingDbFilePath)
    db.update({
        sql: "delete from repo_like where id = ?",
        args: [id]
    })
    $sqlite.close(db)
}

exports.init = init
exports.deleteDbFile = deleteDbFile
exports.addRepo = addRepo
exports.getRepo = getRepo
exports.deleteRepo = deleteRepo
exports.checkRepoExist = checkRepoExist