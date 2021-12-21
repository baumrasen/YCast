
class RadioStation {
    constructor(name, url) {
        this.name = name;
        this._url = url;
    }
}
class RadioStationCategory {

    constructor(type, name, url, urlbak, count, xml) {
        this._type = type;
        this._name = name;
        this._url = url;
        this._urlbak = urlbak;
        this._count = count;
        this._xml = xml;
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
            for (let i = 0; i < x.length; i++) {
                // let type = (x[i].getElementsByTagName("ItemType")[0].childNodes[0].nodeValue);
                let type = getXmlChildNodeWithName(x[i], "ItemType");
                // let title = (x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue);
                let title = getXmlChildNodeWithName(x[i], "Title");
                // let url = (x[i].getElementsByTagName("UrlDir")[0].childNodes[0].nodeValue);
                let stationname = getXmlChildNodeWithName(x[i], "StationName");
                // let url = (x[i].getElementsByTagName("UrlDir")[0].childNodes[0].nodeValue);
                let url = getXmlChildNodeWithName(x[i], "UrlDir");
                // let urlbak = (x[i].getElementsByTagName("UrlDirBackUp")[0].childNodes[0].nodeValue);
                let urlbak = getXmlChildNodeWithName(x[i], "UrlDirBackUp");
                // let count = (x[i].getElementsByTagName("DirCount")[0].childNodes[0].nodeValue);
                let stationurl = getXmlChildNodeWithName(x[i], "StationUrl");
                let count = getXmlChildNodeWithName(x[i], "DirCount");

                if (title == '<Title>' && stationname != '<StationName>') {
                    title = stationname;
                }

                if (url == '<UrlDir>' && stationurl != '<StationUrl>') {
                    url = stationurl;
                }

                this.categories.push(new RadioStationCategory(type, title, url, urlbak, count, x[i]));
            }
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
            if (this._id == 'search') {
                // const search_for = document.getElementById('id_search_input').value;
                const search_for = 'hr3';
                const url = window.origin + '/admin?search=' + search_for;
                console.log("search_url=" + url)
                fetch(url).then(response => response.text())
                        .then(data => {
                            const parser = new DOMParser();
                            const xml = parser.parseFromString(data, "application/xml");
                            this.infos = new YCastInfos(xml);
                            resolve();
                            const url = window.origin + '/admin/index.html';

                }).catch((error) => {
                    console.error(error);
                    reject(error);
                });
            } else {
                const url = window.origin + '/admin/' + this._id;
                console.log("url1=" + url)
                fetch(url).then(response => response.text())
                        .then(data => {
                            const parser = new DOMParser();
                            const xml = parser.parseFromString(data, "application/xml");
                            this.infos = new YCastInfos(xml);
                            resolve();
                            const url = window.origin + '/admin/index.html';

                }).catch((error) => {
                    console.error(error);
                    reject(error);
                });
            }
        });
        return promise;
    }

    render() {
        if (this._id == 'search') {
            const searchHeader = document.createElement('h1');
            searchHeader.innerHTML = 'Search';

            const search = document.createElement('form');
            const search_input = document.createElement('input');
            search_input.name = 'search_input';
            search_input.id = 'id_search_input';
            search_input.value = 'hr3';

            document.getElementById(this._id).appendChild(searchHeader);
            document.getElementById(this._id).appendChild(search);
            search.appendChild(search_input);

            search.addEventListener('submit', updateValue);
        }

        const header = document.createElement('h1');
        header.innerHTML = this._id;
        document.getElementById(this._id).appendChild(header);
        const toplist = document.createElement('ul');
        document.getElementById(this._id).appendChild(toplist);
        // document.getElementById(list1).appendChild(toplist);

        if (this.infos != undefined) {
            let i = 0;
            this.infos.categories.forEach(cat => {
                let j = 0;
                if (this._id == 'search') {
                    // li.innerHTML = createShowHideButtonHTML(cat._name, cat._url, cat._count)
                    // li.id = cat._name;
                    getStationHTML(cat._xml, toplist, this._id)
                } else {
                    const li = document.createElement('li');
                    li.innerHTML = createShowHideButtonHTML(cat._name, cat._url, cat._count, this._id)
                    li.id = cat._name;
                    toplist.appendChild(li);
                }
            });
        }
    }

}

function updateValue(e) {
  // log.textContent = e.target.value;
  // console.log("search_value=" + e.target.value)
  console.log("search_value=" + document.getElementById('id_search_input').value);

        this.info_search = undefined;

    const search_for = document.getElementById('id_search_input').value;
            const url = window.origin + '/admin?search=' + search_for;
            console.log("search_url=" + url)
            fetch(url).then(response => response.text())
                    .then(data => {
                        const parser = new DOMParser();
                        const xml = parser.parseFromString(data, "application/xml");

                        this.info_search = new YCastInfos(xml);
                        resolve();
                        const url = window.origin + '/admin/index.html';

            }).catch((error) => {
                console.error(error);
                reject(error);
            });

    this.init_search().then(() => {
                this.render_search();
            })

}

function createShowHideButtonHTML(name, url, count, app_id) {
    return name + " (" + count + ") <button id='" + getButtonIdName(name, app_id) + "' type='button' onclick='loadXMLDoc(\"" + name + "\", \"" + url + "\", \"" + app_id + "\")'>Show</button>";
}

function createStationHTML(x, app_id) {
    
    let name = getXmlChildNodeWithName(x, "StationName");
    let stationId = getXmlChildNodeWithName(x, "StationId");
    // let url = getXmlChildNodeWithName(x[i], "StationUrl");
    // let descr = getXmlChildNodeWithName(x[i], "StationDescr");
    // let logo = getXmlChildNodeWithName(x[i], "Logo");
    // let format = getXmlChildNodeWithName(x[i], "StationFormat");
    let mime = getXmlChildNodeWithName(x, "StationMime");
    // let bookmark = getXmlChildNodeWithName(x[i], "Bookmark");
    let bandwidth = getXmlChildNodeWithName(x, "StationBandWidth");

    return name + " (" + mime + " " + bandwidth + ") <button id='" + getButtonIdName(stationId, app_id) + "' type='button'>Show</button>";
    // return name + " (" + mime + " " + bandwidth + ") <button id='Button" + stationId + "' type='button' onclick='showStationInfoHTML(\"" + x + "\")'>Show</button>";
    // return name + " (" + bandwidth + ", " + mime + ") <audio controls> <source src='" + url + "' type='audio/mpeg'> Leider kann Ihr Browser kein HTML5-Audio abspielen. </audio>"
}

function createAudioControlHTML(x) {
    
    let name = getXmlChildNodeWithName(x, "StationName");
    let stationId = getXmlChildNodeWithName(x, "StationId");
    let url = getXmlChildNodeWithName(x, "StationUrl");
    // let descr = getXmlChildNodeWithName(x[i], "StationDescr");
    // let logo = getXmlChildNodeWithName(x[i], "Logo");
    // let format = getXmlChildNodeWithName(x[i], "StationFormat");
    let mime = getXmlChildNodeWithName(x, "StationMime");
    // let bookmark = getXmlChildNodeWithName(x[i], "Bookmark");
    let bandwidth = getXmlChildNodeWithName(x, "StationBandWidth");

    return name + " (" + bandwidth + ", " + mime + ") <audio controls> <source src='" + url + "' type='audio/mpeg'> Leider kann Ihr Browser kein HTML5-Audio abspielen. </audio>"
}
// getXmlChildNodeWithName
function getXmlChildNodeWithName(x, name) {
    // (x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue)
    let value = "<" + name + ">";
    try {
        value = x.getElementsByTagName(name)[0].childNodes[0].nodeValue;
    } catch (error) {
        console.log(error);
    }
    return value;
}

function loadXMLDoc(id, url, app_id) {

    // let myButtonId = getButtonIdName(id, app_id);
    // let myButton = document.getElementById(myButtonId);
    let myButton = getButtonWithId(id, app_id);


    if (myButton.innerHTML == 'Show') {
        myButton.innerHTML = 'Hide'
        const promise = new Promise((resolve, reject) => {

            fetch(url).then(response => response.text())
                        .then(data => {
                            const parser = new DOMParser();
                            const xml = parser.parseFromString(data, "application/xml");
                            console.log(xml);
                            
                            const toplist = document.createElement('ul');
                            document.getElementById(id).appendChild(toplist);
                            
                            let txt = "";
                            x = xml.getElementsByTagName("Item");
                            console.log(x);
                            for (i = 0; i< x.length; i++) {
                                if (x[i].getElementsByTagName("ItemType")[0].childNodes[0].nodeValue == "Dir") {
                                    // YCastInfos(x[i]);
                                    txt += x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue + "<br>";
                                    const li = document.createElement('li');
                                    // li.innerHTML = x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue;
                                    let url = x[i].getElementsByTagName("UrlDir")[0].childNodes[0].nodeValue;
                                    let name = x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue;
                                    let count = x[i].getElementsByTagName("DirCount")[0].childNodes[0].nodeValue;

                                    // li.innerHTML = "<a href='"+url+"'>"+name+" (" + count + ") </a> <button id='Button" + name + "' type='button' onclick='loadXMLDoc(\"" + name + "\", \"" + url + "\")'>Show</button>";
                                    li.innerHTML = createShowHideButtonHTML(name, url, count, app_id)
                                    li.id = name;
                                    

                                    toplist.appendChild(li)
                                }
                                if (x[i].getElementsByTagName("ItemType")[0].childNodes[0].nodeValue == "Station") {
                                    // txt += x[i].getElementsByTagName("StationName")[0].childNodes[0].nodeValue + "<br>";
                                    // const li = document.createElement('li');
                                    // li.innerHTML = x[i].getElementsByTagName("StationName")[0].childNodes[0].nodeValue;

                                    // let name = getXmlChildNodeWithName(x[i], "StationName");
                                    // let stationId = getXmlChildNodeWithName(x[i], "StationId");
                                    // let url = getXmlChildNodeWithName(x[i], "StationUrl");
                                    // let descr = getXmlChildNodeWithName(x[i], "StationDescr");
                                    // let logo = getXmlChildNodeWithName(x[i], "Logo");
                                    // let format = getXmlChildNodeWithName(x[i], "StationFormat");
                                    // let mime = getXmlChildNodeWithName(x[i], "StationMime");
                                    // let bookmark = getXmlChildNodeWithName(x[i], "Bookmark");
                                    // let bandwidth = getXmlChildNodeWithName(x[i], "StationBandWidth");

//                                    const li = document.createElement('li');
//                                    li.innerHTML = createStationHTML(x[i]);
//                                    let stationId = getXmlChildNodeWithName(x[i], "StationId");
//                                    li.id = stationId;
//
//                                    // let myButton = getButtonWithId(stationId);
//
//                                    toplist.appendChild(li);
//                                    let myButtonId = getButtonIdName(stationId);
//                                    let myButton = document.getElementById(myButtonId);
//                                    myButton.addEventListener("click", showStationInfoHTML(x[i], app_id));

                                    getStationHTML(x[i], toplist, app_id)
                                }
                                
                            }
                            // document.getElementById(id).appendChild(toplist);
                            resolve();
                }).catch((error) => {
                    console.error(error);
                    reject(error);
                });
            });
            return promise;
    } else {
        myButton.innerHTML = 'Show'
        document.getElementById(id).removeChild(document.getElementById(id).lastChild)
    }
}

function getStationHTML(xml, toplist, app_id) {
    const li = document.createElement('li');
    // li.innerHTML = x[i].getElementsByTagName("StationName")[0].childNodes[0].nodeValue;

    // let name = getXmlChildNodeWithName(x[i], "StationName");
    // let stationId = getXmlChildNodeWithName(x[i], "StationId");
    // let url = getXmlChildNodeWithName(x[i], "StationUrl");
    // let descr = getXmlChildNodeWithName(x[i], "StationDescr");
    // let logo = getXmlChildNodeWithName(x[i], "Logo");
    // let format = getXmlChildNodeWithName(x[i], "StationFormat");
    // let mime = getXmlChildNodeWithName(x[i], "StationMime");
    // let bookmark = getXmlChildNodeWithName(x[i], "Bookmark");
    // let bandwidth = getXmlChildNodeWithName(x[i], "StationBandWidth");

    li.innerHTML = createStationHTML(xml, app_id);
    let stationId = getXmlChildNodeWithName(xml, "StationId");
    li.id = stationId;

    // let myButton = getButtonWithId(stationId);

    toplist.appendChild(li);
    // let myButtonId = getButtonIdName(stationId, app_id);
    // let myButton = document.getElementById(myButtonId);
    let myButton = getButtonWithId(stationId, app_id);
    myButton.addEventListener("click", showStationInfoHTML(xml, app_id));
}

function getButtonWithId(buttonId, app_id) {
    let myButtonId = getButtonIdName(buttonId, app_id);
    let myButton = document.getElementById(myButtonId);
    return myButton;
}

function getButtonIdName(bId, app_id) {
    return app_id + bId;

}

function showStationInfoHTML(x, app_id) {
    return function() {
        let stationId = getXmlChildNodeWithName(x, "StationId");

        // let myButtonId = "Button" + stationId;
        // let myButton = document.getElementById(myButtonId);
        
        // let myButton = getButtonWithId(stationId);

        // let myButtonId = getButtonIdName(stationId, app_id);
        // let myButton = document.getElementById(myButtonId);

        let myButton = getButtonWithId(stationId, app_id);
    
        if (myButton.innerHTML == 'Show') {
            myButton.innerHTML = 'Hide'
                                
            const toplist = document.createElement('ul');
            document.getElementById(stationId).appendChild(toplist);
    
            let StationInfos = ["StationName", "StationUrl", "Logo", "StationFormat", "StationMime", "Bookmark", "StationBandWidth"];
            let TempStationName = "";
    
            StationInfos.forEach(element => {
                const li = document.createElement('li');
                // li.innerHTML = x[i].getElementsByTagName("StationName")[0].childNodes[0].nodeValue;
        
                let current = getXmlChildNodeWithName(x, element);

                if (element == "StationName") {
                    TempStationName = current;
                }
    
                if (element == "Logo") {
                    li.innerHTML = "<img src='" + current + "' alt='" + TempStationName + "' width='200' height='200'>";
                } else {
                    li.innerHTML = current;
                }
                    
                toplist.appendChild(li);
            });
    
            const player = document.createElement('li');
            player.innerHTML = createAudioControlHTML(x);
    
            toplist.appendChild(player)
    
        } else {
            myButton.innerHTML = 'Show'
            document.getElementById(stationId).removeChild(document.getElementById(stationId).lastChild)
        }
    }
 }

var app;
document.addEventListener("DOMContentLoaded", (event) => {
    my_stations = new App("my_stations");
    radiobrowser = new App("radiobrowser");
    search = new App("search");
});
