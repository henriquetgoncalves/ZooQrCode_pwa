    var animal = null;
    window.onload = function(){
            animal = location.search.split("?animal=")[1];
            app.getAnimal(animal);
    }

    var app = {
        isLoading: true,
        visibleCards: {},
        ScannedAnimal: animal,
        selectedAnimals: [],
        spinner: document.querySelector('.loader'),
        headerTitle: document.querySelector('#header__title'),
        cardTemplate: document.querySelector('.cardTemplate'),
        container: document.querySelector('.main')
    };

    app.updateAnimalCard = function (data) {
        var card = app.visibleCards[data.key];
        if (!card) {
            card = app.cardTemplate.cloneNode(true);
            card.classList.remove('cardTemplate');
            card.querySelector('.location').textContent = data.label;
            card.removeAttribute('hidden');
            app.container.appendChild(card);
            app.visibleCards[data.key] = card;
        }
        app.headerTitle = data.apelido;
        card.querySelector('#nome_cientifico').textContent = data.nome_cientifico;
        card.querySelector('#estado_conservacao').textContent =
            data.estado_conservacao;
        card.querySelector('#distribuicao_geo_habitat').textContent = data.distribuicao_geo_habitat;
        card.querySelector('#caracteristicas').textContent = data.caracteristicas;        card.querySelector('#dieta_habitos_alimentares').textContent = data.dieta_habitos_alimentares;
        card.querySelector('#reproducao').textContent = data.reproducao;
        }
        if (app.isLoading) {
            app.spinner.setAttribute('hidden', true);
            app.container.removeAttribute('hidden');
            app.isLoading = false;
        }
    };

    // Gets a Animal for a specific city and update the card with the data        
    app.getAnimal = function (key, label) {
        var url = 'https://henriquetgoncalves.github.io/ZooQrCode_wpa/JSONdata/';
        url += key + '.json';
        if ('caches' in window) {
            /*
             * Check if the service worker has already cached this city's weather
             * data. If the service worker has the data, then display the cached
             * data while the app fetches the latest data.
             */
            caches.match(url).then(function (response) {
                if (response) {
                    response.json().then(function updateFromCache(json) {
                        var response = JSON.parse(request.response);
                        var results = json.query.results;
                        results.key = key;
                        results.label = label;
                        results.created = json.query.created;
                        app.updateAnimalCard(results);
                    });
                }
            });
        }
        // Make the XHR to get the data, then update the card
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var response = JSON.parse(request.response);
                    response.key = key;
                    response.label = label;
                    app.updateAnimalCard(response);
                }
            }
        };
        request.open('GET', url);
        request.send();
        app.saveSelectedAnimals();
    };

    app.updateAnimals = function () {
        var keys = Object.keys(app.visibleCards);
        keys.forEach(function (key) {
            app.getAnimal(key);
        });
    };

    /************************************************************************
     *
     * Code required to start the app
     *
     * NOTE: To simplify this codelab, we've used localStorage.
     *   localStorage is a synchronous API and has serious performance
     *   implications. It should not be used in production applications!
     *   Instead, check out IDB (https://www.npmjs.com/package/idb) or
     *   SimpleDB (https://gist.github.com/inexorabletash/c8069c042b734519680c)
     ************************************************************************/

    app.selectedAnimals = localStorage.selectedAnimals;
    if (app.selectedAnimals) {
        app.selectedAnimals = JSON.parse(app.selectedCities);
        app.selectedAnimals.forEach(function (city) {
            app.getAnimal(city.key, city.label);
        });
    } else {
        app.updateAnimalCard(initialAnimal);
        app.selectedAnimals = [
            {
                key: initialAnimal.key,
                label: initialAnimal.label
            }
    ];
        app.saveSelectedAnimals();
    }

    app.saveSelectedAnimals = function () {
        var selectedAnimals = JSON.stringify(app.selectedAnimals);
        // IMPORTANTE: See notes about use of localStorage.        
        localStorage.selectedAnimals = selectedAnimals;
    };
