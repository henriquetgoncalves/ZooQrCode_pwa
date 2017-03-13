window.onload = function () {
    //animal = location.search.split("?animal=")[1];
    //console.log("console.log " + animal);
    getData('animals');
}


var getData = function (key) {
    var url = 'https://henriquetgoncalves.github.io/ZooQrCode_wpa/JSONdata/' + key + '.json';

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
                    if (key === "animals") {
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
                if (key === "animals") {
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

var listAnimals = function (data) {
    for (var a in data) {
        console.log(a);
        listItem(a);
    }
}
var listItem = function (animal) {
    getData(animal);
}

var createCard = function (key, animal) {
    var cardTemplate = document.querySelector('#card_' + key);
    if (!cardTemplate) {
        cardTemplate = document.querySelector('.cardTemplate').cloneNode(true);
    }
    cardTemplate.id = "card_" + key;
    cardTemplate.querySelector('.icon_animal').style.backgroundImage = "url(" + animal.imagem + ")";
    cardTemplate.querySelector('#name').textContent = animal.apelido;
    cardTemplate.style.display = null;
    document.querySelector('.main').appendChild(cardTemplate);
}