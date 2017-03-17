var btnVoltar = document.getElementById('menu-lower-left');
window.onload = function () {
    tipo = gup('type', location.search);
    item = gup('item', location.search);
    tela = gup('tela', location.search);
    filter = "";

    getData(tipo);
}

var getData = function (key) {
    var url = new URL("./", self.location).href + '/JSONdata/' + key + '.json';
    //'https://henriquetgoncalves.github.io/ZooQrCode_wpa/JSONdata/' + key + '.json';

    if ('caches' in window) {
        /*
         * Check if the service worker has already cached this city's weather
         * data. If the service worker has the data, then display the cached
         * data while the app fetches the latest data.
         */
        caches.match(url).then(function (response) {
            if (response) {
                response.json().then(function updateFromCache(json) {
                    var response = JSON.stringify(json);
                    results = JSON.parse(response);
                    console.log("getting data for cache=" + url);
                    if (key === "classes") {
                        btnVoltar.setAttribute("onclick", "location.href='index.html'");
                        listClasses(results);
                    } else if (key === "animals" && item) {
                        btnVoltar.setAttribute("onclick", "location.href='list.html?type=classes&tela=list'");
                        listAnimals(results);
                    } else {
                        createCard(key, results);
                    }
                });
            }
        });
    }

    if (navigator.onLine) {
        // Make the XHR to get the data, then update the card
        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                results = JSON.parse(request.response);
                console.log("getting data for URL=" + url);
                if (key === "classes") {
                    btnVoltar.setAttribute("onclick", "location.href='index.html'");
                    listClasses(results);
                } else if (key === "animals" && item) {
                    btnVoltar.setAttribute("onclick", "location.href='list.html?type=classes'");
                    listAnimals(results);
                } else {
                    createCard(key, results);
                }
            }
        };
        request.open('GET', url);
        request.send();

    }
}
var listClasses = function (data) {
    for (var a in data) {
        console.log(a);
        createCard(a, data[a]);
    }
}
var listAnimals = function (data) {
    for (var a in data) {
        console.log(a);
        listItem(a);
    }
}
var listItem = function (data) {
    getData(data);
}

var createCard = function (id, data) {
    
    if (item && tela == "ameacados") {
        filter = data.estado_conservacao;
    } else if (item && tela == "list") {
        filter = data.classificacao.classe;
    }
    if (filter) {
        filter = filter.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g, "_");
    }    
    if (tipo === "animals" && item == filter || tipo === "classes") {
        var cardTemplate = document.querySelector('#card_' + id);
        if (!cardTemplate) {
            cardTemplate = document.querySelector('.cardTemplate').cloneNode(true);
        }
        cardTemplate.id = "card_" + id;
        cardTemplate.querySelector('.icon').src = data.imagem;
        cardTemplate.querySelector('#name').textContent = data.nome;
        cardTemplate.addEventListener("click", function () {
            cardClick(id);
        });
        document.querySelector('.main').appendChild(cardTemplate);
        cardTemplate.style.display = null;
    }
}

function cardClick(id) {
    if (tipo === "classes") {
        window.location.href = 'list.html?type=animals&item=' + id + '&tela=list';
    } else if (tipo === "animals") {
        window.location.href = 'animal-detail.html?animal=' + id;
    }

}

function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}