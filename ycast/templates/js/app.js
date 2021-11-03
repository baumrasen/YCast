
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
                let type = (x[i].getElementsByTagName("ItemType")[0].childNodes[0].nodeValue);
                let title = (x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue);
                let url = (x[i].getElementsByTagName("UrlDir")[0].childNodes[0].nodeValue);
                let urlbak = (x[i].getElementsByTagName("UrlDirBackUp")[0].childNodes[0].nodeValue);
                let count = (x[i].getElementsByTagName("DirCount")[0].childNodes[0].nodeValue);
                this.categories.push(new RadioStationCategory(type, title, url, urlbak, count));
            }
        }
    }
}
class App {

    constructor(id) {
        this._id = id;
        this.infos1 = undefined;
        this.init1().then(() => {
            this.render1();
        })
        this.infos2 = undefined;
        this.init2().then(() => {
            this.render2();
        })
    }

    init1() {
        const promise = new Promise((resolve, reject) => {
            const url = window.origin + '/admin/my_stations';
            console.log("url1=" + url)
            fetch(url).then(response => response.text())
                    .then(data => {
                        const parser = new DOMParser();
                        const xml = parser.parseFromString(data, "application/xml");
                        this.infos1 = new YCastInfos(xml);
                        resolve();
                        const url = window.origin + '/admin/index.html';

            }).catch((error) => {
                console.error(error);
                reject(error);
            });

        });
        return promise;
    
    }

    init2() {
        const promise = new Promise((resolve, reject) => {
            const url = window.origin + '/admin/radiobrowser';
            console.log("url2=" + url)
            fetch(url).then(response => response.text())
                    .then(data => {
                        const parser = new DOMParser();
                        const xml = parser.parseFromString(data, "application/xml");
                        this.infos2 = new YCastInfos(xml);
                        resolve();
                        const url = window.origin + '/admin/index.html';

            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });
        return promise;
    
    }

    render1() {
        const toplist = document.createElement('ul');
        if (this.infos1 != undefined) {
            let i = 0;
            this.infos1.categories.forEach(cat => {
                const li = document.createElement('li');
                let j = 0;
                // li.innerHTML = "<a href='"+cat._url+"'>"+cat._name+" (" + cat._count + ") </a> <button id='Button" + cat._name + "' type='button' onclick='loadXMLDoc(\"" + cat._name + "\", \"" + cat._url + "\")'>Show</button>";
                li.innerHTML = createShowHideButtonHTML(cat._name, cat._url, cat._count)
                li.id = cat._name;
                toplist.appendChild(li);
            });
        }
        const header = document.createElement('h1');
        header.innerHTML = 'My_Stations';
        document.getElementById(this._id).appendChild(header);
        document.getElementById(this._id).appendChild(toplist);
        // document.getElementById(list1).appendChild(toplist);
    }

    render2() {
        const toplist = document.createElement('ul');
        if (this.infos2 != undefined) {
            let i = 0;
            this.infos2.categories.forEach(cat => {
                const li = document.createElement('li');
                let j = 0;
                // li.innerHTML = "<a href='"+cat._url+"'>"+cat._name+" (" + cat._count + ") </a> <button id='Button" + cat._name + "' type='button' onclick='loadXMLDoc(\"" + cat._name + "\", \"" + cat._url + "\")'>Show</button>";
                li.innerHTML = createShowHideButtonHTML(cat._name, cat._url, cat._count)
                li.id = cat._name;
                toplist.appendChild(li);
            });
        }
        const header = document.createElement('h1');
        header.innerHTML = 'Radiobrowser';
        document.getElementById(this._id).appendChild(header);
        document.getElementById(this._id).appendChild(toplist);
        // document.getElementById(list2).appendChild(toplist);
    }
}

function createShowHideButtonHTML(name, url, count) {
    return name + " (" + count + ") <button id='Button" + name + "' type='button' onclick='loadXMLDoc(\"" + name + "\", \"" + url + "\")'>Show</button>";
    // return "<a href='"+url+"'>"+name+" (" + count + ") </a> <button id='Button" + name + "' type='button' onclick='loadXMLDoc(\"" + name + "\", \"" + url + "\")'>Show</button>";
}

function createStationHTML(x) {
    
    let name = getSationInfo(x, "StationName");
    let stationId = getSationInfo(x, "StationId");
    // let url = getSationInfo(x[i], "StationUrl");
    // let descr = getSationInfo(x[i], "StationDescr");
    // let logo = getSationInfo(x[i], "Logo");
    // let format = getSationInfo(x[i], "StationFormat");
    let mime = getSationInfo(x, "StationMime");
    // let bookmark = getSationInfo(x[i], "Bookmark");
    let bandwidth = getSationInfo(x, "StationBandWidth");

    return name + " (" + mime + " " + bandwidth + ") <button id='" + getButtonIdName(stationId) + "' type='button'>Show</button>";
    // return name + " (" + mime + " " + bandwidth + ") <button id='Button" + stationId + "' type='button' onclick='showStationInfoHTML(\"" + x + "\")'>Show</button>";
    // return name + " (" + bandwidth + ", " + mime + ") <audio controls> <source src='" + url + "' type='audio/mpeg'> Leider kann Ihr Browser kein HTML5-Audio abspielen. </audio>"
}

function createAudioControlHTML(x) {
    
    let name = getSationInfo(x, "StationName");
    let stationId = getSationInfo(x, "StationId");
    let url = getSationInfo(x, "StationUrl");
    // let descr = getSationInfo(x[i], "StationDescr");
    // let logo = getSationInfo(x[i], "Logo");
    // let format = getSationInfo(x[i], "StationFormat");
    let mime = getSationInfo(x, "StationMime");
    // let bookmark = getSationInfo(x[i], "Bookmark");
    let bandwidth = getSationInfo(x, "StationBandWidth");

    return name + " (" + bandwidth + ", " + mime + ") <audio controls> <source src='" + url + "' type='audio/mpeg'> Leider kann Ihr Browser kein HTML5-Audio abspielen. </audio>"
}

function getSationInfo(x, name) {
    let value = "<" + name + ">";
    try {
        value = x.getElementsByTagName(name)[0].childNodes[0].nodeValue;
    } catch (error) {
        console.log(error);
    }
    return value;
}

function loadXMLDoc(id, url) {

    let myButtonId = getButtonIdName(id);
    let myButton = document.getElementById(myButtonId);


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
                                    li.innerHTML = createShowHideButtonHTML(name, url, count)
                                    li.id = name;
                                    

                                    toplist.appendChild(li)
                                }
                                if (x[i].getElementsByTagName("ItemType")[0].childNodes[0].nodeValue == "Station") {
                                    // txt += x[i].getElementsByTagName("StationName")[0].childNodes[0].nodeValue + "<br>";
                                    const li = document.createElement('li');
                                    // li.innerHTML = x[i].getElementsByTagName("StationName")[0].childNodes[0].nodeValue;

                                    // let name = getSationInfo(x[i], "StationName");
                                    // let stationId = getSationInfo(x[i], "StationId");
                                    // let url = getSationInfo(x[i], "StationUrl");
                                    // let descr = getSationInfo(x[i], "StationDescr");
                                    // let logo = getSationInfo(x[i], "Logo");
                                    // let format = getSationInfo(x[i], "StationFormat");
                                    // let mime = getSationInfo(x[i], "StationMime");
                                    // let bookmark = getSationInfo(x[i], "Bookmark");
                                    // let bandwidth = getSationInfo(x[i], "StationBandWidth");

                                    li.innerHTML = createStationHTML(x[i]);
                                    let stationId = getSationInfo(x[i], "StationId");
                                    li.id = stationId;

                                    // let myButton = getButtonWithId(stationId);

                                    toplist.appendChild(li);
                                    let myButtonId = getButtonIdName(stationId);
                                    let myButton = document.getElementById(myButtonId);
                                    myButton.addEventListener("click", showStationInfoHTML(x[i]));
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

function getButtonWithId(buttonId) {
    let myButtonId = getButtonIdName(buttonId);
    let myButton = document.getElementById(myButtonId);
    return myButton;
}

function getButtonIdName(bId) {
    return "Button" + bId;

}

function showStationInfoHTML(x) {
    return function() {
        let stationId = getSationInfo(x, "StationId");

        // let myButtonId = "Button" + stationId;
        // let myButton = document.getElementById(myButtonId);
        
        // let myButton = getButtonWithId(stationId);

        let myButtonId = getButtonIdName(stationId);
        let myButton = document.getElementById(myButtonId);
    
        if (myButton.innerHTML == 'Show') {
            myButton.innerHTML = 'Hide'
                                
            const toplist = document.createElement('ul');
            document.getElementById(stationId).appendChild(toplist);
    
            let StationInfos = ["StationName", "StationUrl", "Logo", "StationFormat", "StationMime", "Bookmark", "StationBandWidth"];
            let TempStationName = "";
    
            StationInfos.forEach(element => {
                const li = document.createElement('li');
                // li.innerHTML = x[i].getElementsByTagName("StationName")[0].childNodes[0].nodeValue;
        
                let current = getSationInfo(x, element);

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
    app = new App("app");
});
