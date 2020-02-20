let host = "http://192.168.0.108:8080/";
let trendingRequestUrl = host + "trending/";

exports.getTrendingData = async() => {
    const data = await $http.get(trendingRequestUrl);
    return parser(data);
}

function parser(resp) {
    let dataSource = []
    var dataArray = resp.data.Repositories
    for (let index = 0; index < dataArray.length; index++) {
        const item = dataArray[index]

        var array = item.name.split('/')
        var repo = {
            name: { text: array[2] },
            author: {title: "@"+array[1]},
            lang: { text: item.lang },
            description: { text: item.description.replace(/<g-emoji [\s\S]*?>|<\/g-emoji>|<a[\s\S]*?>|<\/a>/g, "") },
            star: { title: item.star },
            fork: { title: item.fork },
            url: item.url
        }

        dataSource.push(repo)
    }

    return dataSource;
}