var cardTemplate = document.querySelector('.cardTemplate').cloneNode(true);

document.querySelector('.main').appendChild(cardTemplate);
document.querySelector('.main').appendChild(cardTemplate);
document.querySelector('.main').appendChild(cardTemplate);
document.querySelector('.main').appendChild(cardTemplate);

var animals = function () {
    var url = 'https://henriquetgoncalves.github.io/ZooQrCode_wpa/JSONdata/animals.json';
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
                    var results = JSON.parse(response);
                    console.log("getting data for cache=" + url);
                    list(results);
                });
            }
        });
    }

    if (navigator.onLine) {
        // Make the XHR to get the data, then update the card
        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                var response = JSON.parse(request.response);
                console.log("getting data for URL=" + url);
                list(response);
            }
        };
        request.open('GET', url);
        request.send();
    }
}

var list =  function (data) {
    for each (animal in data) {
        alert(animal);
    }
}