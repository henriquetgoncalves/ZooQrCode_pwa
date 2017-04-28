(function () {
    /*****************************************************************************
     *
     * Event listeners for UI elements
     * ****************************************************************************/
    document.getElementById('fabQrCodeScan').addEventListener('click', function () {
        window.location.href = "qrcode-scanner.html";
    });

    document.getElementById('menuItem_About').addEventListener('click', function () {
        window.location.href = "about.html";
    });
    document.getElementById('menuItem_Adm').addEventListener('click', function (){
        window.location.href = "private/login.html";
    });

    document.getElementById('dashboard').style.backgroundImage="url(../images/animals/animals_band.gif)";

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    var getData = function (key) {
        var url = new URL("./",self.location).href + key ; //'https://henriquetgoncalves.github.io/ZooQrCode_wpa/' + key + '';

        if ('caches' in window) {
            /*
             * Check if the service worker has already cached this city's weather
             * data. If the service worker has the data, then display the cached
             * data while the app fetches the latest data.
             */
            caches.match(url).then(function (response) {
                if (response) {
                    if (isJson(response)) {
                        response.json().then(function updateFromCache(json) {
                            var response = JSON.stringify(json);
                            results = JSON.parse(response);
                            if (key === "JSONdata/animals.json") {
                                listAnimals(results);
                            } else {
                                console.log(response.apelido);
                            }

                        });
                    }
                    console.log("getting data for cache=" + url);
                }
            });
        }

        if (navigator.onLine) {
            // Make the XHR to get the data, then update the card
            var request = new XMLHttpRequest();

            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                    if (isJson(request.response)) {
                        results = JSON.parse(request.response);
                        console.log("getting data for URL=" + url);
                        if (key === "JSONdata/animals.json") {
                            listAnimals(results);
                        } else {
                            console.log(results.apelido);
                        }
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
            getData('JSONdata/' + a + '.json');
        }
    }
    getData("animal-detail.html");
    getData("JSONdata/animals.json");
    //Registrando o arquivo service-worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('./service-worker.js').then(function (registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch(function (err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }

})();