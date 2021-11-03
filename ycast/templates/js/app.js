
class RadioStation {
    constructor(name, url) {
        this.name = name;
        this._url = url;
    }
}
class RadioStationCategory {

    constructor(type, name, url, urlbak, count) {
        this._type = type;
        this._name = name;
        this._url = url;
        this._urlbak = urlbak;
        this._count = count;
        // this._stations = [];
        // if (obj != undefined) {
        //     Object.keys(obj).forEach(k => {
        //         this._stations.push(new RadioStation(k, obj[k]));
        //     });
        // }
    }
    hasStations() {
        return this._count > 0;
    }
}
class YCastInfos {

    constructor(obj) {
        this.categories = [];
        if (obj != undefined) {
            let x = obj.getElementsByTagName("Item");
            // let x = obj.getElementsByTagName("Title");
            for (let i = 0; i < x.length; i++) {
                // console.log(x[i]);
                // console.log(x[i].childNodes[0].nodeValue);
                let type = (x[i].getElementsByTagName("ItemType")[0].childNodes[0].nodeValue);
                let title = (x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue);
                let url = (x[i].getElementsByTagName("UrlDir")[0].childNodes[0].nodeValue);
                let urlbak = (x[i].getElementsByTagName("UrlDirBackUp")[0].childNodes[0].nodeValue);
                let count = (x[i].getElementsByTagName("DirCount")[0].childNodes[0].nodeValue);
                this.categories.push(new RadioStationCategory(type, title, url, urlbak, count));
            }
            // Object.keys(obj).forEach(k => {
            // x.forEach(k => {
            //     console.log(k + "-  " + obj[k]);
            //     this.categories.push(new RadioStationCategory(k, obj[k]));
            // });
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
                        // let json = xml2json(xml);
                        // console.log(json);
                        // let xmlitems = xml.getElementsByTagName("ITEM");
                        this.infos = new YCastInfos(xml);
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
                // li.innerHTML = cat._name;
                li.innerHTML = "<a href='"+cat._url+"'>"+cat._name+" (" + cat._count + ") </a> <button type='button' onclick='loadXMLDoc(\"" + cat._name + "\", \"" + cat._url + "\")'>Load</button>"
                li.id = cat._name
                if (cat.hasStations()) {
                    const toplist2 = document.createElement('ul');
                    // cat._stations.forEach(station => {
                    //     console.log(station.name);
                    //     const li2 = document.createElement('li');
                    //     // li2.innerHTML = station.name;
                    //     // li2.href = station._url;
                    //     li2.innerHTML = "<a href='"+station._url+"'>"+station.name+"</a>"
                    //     toplist2.appendChild(li2)
                    // })
                    li.appendChild(toplist2);
                }
                toplist.appendChild(li);
            });
        }
        document.getElementById(this._id).appendChild(toplist);
    }
}

function loadXMLDoc(id, url) {

    const promise = new Promise((resolve, reject) => {

        fetch(url).then(response => response.text())
                    .then(data => {
                        const parser = new DOMParser();
                        const xml = parser.parseFromString(data, "application/xml");
                        console.log(xml);
                        
                        const toplist = document.createElement('ul');
                        

                        let txt = "";
                        x = xml.getElementsByTagName("Item");
                        console.log(x);
                        for (i = 0; i< x.length; i++) {
                            if (x[i].getElementsByTagName("ItemType")[0].childNodes[0].nodeValue == "Dir") {
                                txt += x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue + "<br>";
                                const li = document.createElement('li');
                                li.innerHTML = x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue;
                                toplist.appendChild(li)
                            }
                            if (x[i].getElementsByTagName("ItemType")[0].childNodes[0].nodeValue == "Station") {
                                txt += x[i].getElementsByTagName("StationName")[0].childNodes[0].nodeValue + "<br>";
                                const li = document.createElement('li');
                                li.innerHTML = x[i].getElementsByTagName("StationName")[0].childNodes[0].nodeValue;
                                toplist.appendChild(li)
                            }
                            
                        }
                        // document.getElementById("list").innerHTML = txt;
                        // document.getElementById(this._id).appendChild(toplist);
                        document.getElementById(id).appendChild(toplist);

                        resolve();
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });
        return promise;
    
}

var app;
document.addEventListener("DOMContentLoaded", (event) => {
    app = new App("app");
});
