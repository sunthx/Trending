const trendingDbFilePath = "shared://trending_data.db"

function check() {
   return $file.exists(trendingDbFilePath)
}

function init() {
    if ($file.exists(trendingDbFilePath)) {
        $console.info('db file existed.')
        return
    }

    var db = $sqlite.open(trendingDbFilePath)
    db.update("CREATE TABLE repo_like(repo_name text,repo_content text)")
    $sqlite.close(db)
}

function addRepo(data) {
    let db = $sqlite.open(trendingDbFilePath)
    db.update({
        sql: "INSERT INTO repo_like values(?,?)",
        args: [data.name,JSON.stringify(data)]
    })
    $sqlite.close(db)
}

function getRepo() {
    let res = []
    let db = $sqlite.open(trendingDbFilePath)
    db.query({
        sql: "SELECT * FROM repo_like"
    },(rs,err) => {
        if(err != null){
            return
        }

        while(rs.next()){
            let values = rs.values
            let repo = {
                repoName: values.repo_name,
                repoObject: JSON.parse(values.repo_content)
            }

            res.push(repo)
        }
    })

    return res
}

function deleteRepo(repoName) {
    let db = $sqlite.open(trendingDbFilePath)
    db.query({
        sql: "SELECT * FROM repo_like where repo_name = ?",
        args: [repoName]
      });
}

exports.initDb = init
exports.addRepo = addRepo
exports.getRepo = getRepo
exports.deleteRepo = deleteRepo