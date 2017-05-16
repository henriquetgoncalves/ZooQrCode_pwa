var key = null;
key = gup("animal",location.search);

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAKkqHvQucpECLDE-n7r8RjHoiIDya86gM",
    authDomain: "zooqrcode.firebaseapp.com",
    databaseURL: "https://zooqrcode.firebaseio.com",
    projectId: "zooqrcode",
    storageBucket: "zooqrcode.appspot.com",
    messagingSenderId: "373519758441"
};
firebase.initializeApp(config);

const auth = firebase.auth(),
    storage = firebase.storage(),
    animal = firebase.database().ref('tabelas/animais/'+key);

animal.on('value', data => {
    updateAnimalCard(data.val());
});


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


if (app.isLoading) {
    app.spinner.setAttribute('hidden', true);
    //app.container.removeAttribute('hidden');
    app.isLoading = false;
}

updateAnimalCard = function (data) {
    app.header.querySelector('.header__title').textContent = data.nome;
    setImage(app.container.querySelector('#image__animal'),"animais",key);
    app.container.querySelector('.nome_cientifico').textContent = data.nome_cientifico;
    app.container.querySelector('.estado_conservacao').textContent = data.estado_conservacao;
    app.container.querySelector('#info_reino').textContent = data.classificacao.reino;
    app.container.querySelector('#info_classe').textContent = data.classificacao.classificacao;
    app.container.querySelector('#info_ordem').textContent = data.classificacao.ordem;
    app.container.querySelector('#info_familia').textContent = data.classificacao.familia;
    app.container.querySelector('#info_especie').textContent = data.classificacao.especie;
    app.container.querySelector('.distribuicao_geo_habitat').textContent = data.distribuicao_geo_habitat;
    app.container.querySelector('.caracteristicas').textContent = data.caracteristica;
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

function setImage(obj,ref,key) {
    var storageRef = firebase.storage().ref("imagens/" + ref + "/" + key);
    var data = sessionStorage.getItem(key);
    if (!data) {
        try {
            storageRef.getDownloadURL().then(function (url) {                
                obj.src = url;
            });
        }catch (e){
            console.log(e.code + "-" + e.message);
        }
    }else {
        obj.src = url;
    }

}