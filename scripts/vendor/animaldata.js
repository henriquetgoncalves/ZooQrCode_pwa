var animal = null;
window.onload = function () {
    animal = location.search.split("?animal=")[1];
    console.log("console.log " + animal);
    app.getAnimal(animal);
}

var app = {
    isLoading: true,
    visibleCards: {},
    ScannedAnimal: animal,
    spinner: document.querySelector('.loader'),
    header: document.querySelector('.header'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main-parallax')
}
app.saveSelectedAnimals = function () {
    var selectedAnimals = JSON.stringify(app.selectedAnimals);
    // IMPORTANTE: See notes about use of localStorage.        
    localStorage.selectedAnimals = selectedAnimals;
};

if (app.isLoading) {
    app.spinner.setAttribute('hidden', true);
    //app.container.removeAttribute('hidden');
    app.isLoading = false;
}


// Gets a Animal for a specific city and update the card with the data        
app.getAnimal = function (key) {
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
                    //var response = JSON.parse(request.response);                    
                    var results = JSON.stringify(json);//json.query.results;
                    results.key = key;
                    console.log("getting cache for URL=" + url);
                    //results.label = label;
                    //results.created = json.query.created;
                    alert("Getting Cache "+JSON.stringify(json));
                    app.updateAnimalCard(results);
                });
            }
        });
    }

    // Make the XHR to get the data, then update the card
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            var response = JSON.parse(request.response);
            response.key = key;
            console.log("getting data for URL=" + url);
            //response.label = label;
            alert("Getting URL online "+request.response);
            app.updateAnimalCard(response);
        }

    };
    request.open('GET', url);
    request.send();
    //app.saveSelectedAnimals();
};

app.updateAnimals = function () {
    var keys = Object.keys(app.visibleCards);
    keys.forEach(function (key) {
        app.getAnimal(key);
    });
};

app.updateAnimalCard = function (data) {
        //var card = app.visibleCards[data.key];
        //if (!card) {
            //card = app.cardTemplate.cloneNode(true);
            //card.classList.remove('cardTemplate');
            //card.querySelector('.header__title').textContent = data.apelido;
            //card.removeAttribute('hidden');
            //app.container.appendChild(card);
          //  app.visibleCards[data.key] = card;
        //}
        app.header.querySelector('.header__title').textContent = data.apelido;
        app.container.querySelector('.nome_cientifico').textContent = data.nome_cientifico;
        app.container.querySelector('.estado_conservacao').textContent =
            data.estado_conservacao;
        app.container.querySelector('.distribuicao_geo_habitat').textContent = data.distribuicao_geo_habitat;
        app.container.querySelector('.caracteristicas').textContent = data.caracteristicas;
        app.container.querySelector('.dieta_habitos_alimentares').textContent = data.dieta_habitos_alimentares;
        app.container.querySelector('.reproducao').textContent = data.reproducao;
    }
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

/*app.selectedAnimals = localStorage.selectedAnimals;
if (!app.selectedAnimals) {
    app.selectedAnimals = JSON.parse(app.selectedAnimals);
    app.selectedAnimals.forEach(function (animal) {
        app.getAnimal(animal.key, animal.label);
    });
} else {
    //app.updateAnimalCard(initialAnimal);
    app.selectedAnimals = [
        //{
          //  key: initialAnimal.key,
            //label: initialAnimal.label
            //}
    ];
    app.saveSelectedAnimals();
}*/