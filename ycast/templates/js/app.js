
class RadioStation {
    constructor(name, url) {
        this.name = name;
        this._url = url;
    }
}
class RadioStationCategory {

    constructor(name, obj) {
        this._name = name;
        this._stations = [];
        if (obj != undefined) {
            Object.keys(obj).forEach(k => {
                this._stations.push(new RadioStation(k, obj[k]));
            });
        }
    }
    hasStations() {
        return this._stations.length > 0;
    }
}
class YCastInfos {

    constructor(obj) {
        this.categories = [];
        if (obj != undefined) {
            Object.keys(obj).forEach(k => {
                console.log(k + "-  " + obj[k]);
                this.categories.push(new RadioStationCategory(k, obj[k]));
            });
        }
    }
}
class App {

    constructor(id) {
        this._id = id;
        this.infos = undefined;
        this.init().then(() => {
            this.render();
        })
    }

    init() {
        const promise = new Promise((resolve, reject) => {
            const url = window.origin + '/admin/stations';
            console.log("url=" + url)
            fetch(url).then(response => response.text())
                    .then(data => {
                        const parser = new DOMParser();
                        const xml = parser.parseFromString(data, "application/xml");
                        console.log(xml);
                        let json = xml2json(xml);
                        console.log(json);
                        this.infos = new YCastInfos(json);
                        console.log(this.infos);
                        resolve();
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });
        return promise;
    }

    render() {
        const toplist = document.createElement('ul');
        if (this.infos != undefined) {
            let i = 0;
            this.infos.categories.forEach(cat => {
                const li = document.createElement('li');
                let j = 0;
                li.innerHTML = cat._name;
                if (cat.hasStations()) {
                    const toplist2 = document.createElement('ul');
                    cat._stations.forEach(station => {
                        console.log(station.name);
                        const li2 = document.createElement('li');
                        // li2.innerHTML = station.name;
                        // li2.href = station._url;
                        li2.innerHTML = "<a href='"+station._url+"'>"+station.name+"</a>"
                        toplist2.appendChild(li2)
                    })
                    li.appendChild(toplist2);
                }
                toplist.appendChild(li);
            });
        }
        document.getElementById(this._id).appendChild(toplist);
    }
}

var app;
document.addEventListener("DOMContentLoaded", (event) => {
    app = new App("app");
});
