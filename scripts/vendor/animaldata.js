var animal = null;
window.onload = function () {
    animal = gup("animal",location.search);
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
    container: document.querySelector('.main-parallax'),
    dialog: document.querySelector('dialog'),
    dialog_offline: document.querySelector('dialog-offline'),
    classificacao: document.getElementById('info_classificacao')
}

app.classificacao.addEventListener('click', function () {
    if (!app.dialog.showModal()) {
        dialogPolyfill.registerDialog(app.dialog);
    }
});


document.querySelector('#dialog-button-close').addEventListener('click', function () {
    app.dialog.close();
});


document.querySelector('#dialog-offline-button-close').addEventListener('click', function () {
    app.dialog_offline.close();
});

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
    var url = new URL("./",self.location).href + '/JSONdata/';//'https://henriquetgoncalves.github.io/ZooQrCode_wpa/JSONdata/';
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
                    var response = JSON.stringify(json); //JSON.parse(request.response);                    
                    var results = JSON.parse(response); //json.query.results;
                    results.key = key;
                    console.log("getting cache for URL=" + url);
                    //results.label = label;
                    //results.created = json.query.created;
                    //alert("Getting Cache " + response);
                    app.updateAnimalCard(results);
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
                response.key = key;
                console.log("getting data for URL=" + url);
                //response.label = label;
                //alert("Getting URL online " + request.response);
                app.updateAnimalCard(response);
            }

        };
        try {
            request.open('GET', url);
            request.send();            
        } catch(err) {
            if (!app.dialog_offline.showModal()) {
                dialogPolyfill.registerDialog(app.dialog_offline);
            }
        }
    }
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
    app.header.querySelector('.header__title').textContent = data.nome;
    app.container.querySelector('#image__animal').style.backgroundImage = "url(" + data.imagem + ")";
    app.container.querySelector('.nome_cientifico').textContent = data.nome_cientifico;
    app.container.querySelector('.estado_conservacao').textContent = data.estado_conservacao;
    app.container.querySelector('#info_reino').textContent = data.classificacao.reino;
    app.container.querySelector('#info_classe').textContent = data.classificacao.classe;
    app.container.querySelector('#info_ordem').textContent = data.classificacao.ordem;
    app.container.querySelector('#info_familia').textContent = data.classificacao.familia;
    app.container.querySelector('#info_especie').textContent = data.classificacao.especie;
    app.container.querySelector('.distribuicao_geo_habitat').textContent = data.distribuicao_geo_habitat;
    app.container.querySelector('.caracteristicas').textContent = data.caracteristicas;
    app.container.querySelector('.dieta_habitos_alimentares').textContent = data.dieta_habitos_alimentares;
    app.container.querySelector('.reproducao').textContent = data.reproducao;
}

function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}