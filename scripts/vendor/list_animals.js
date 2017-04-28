var btnVoltar = document.getElementById('menu-lower-left');

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
    classes = firebase.database().ref('tabelas/classes'),
    animals = firebase.database().ref('tabelas/animais'),
    list_animals = document.getElementById('list_animals'),
    list_classes = document.getElementById('list_classes');

classes.on('child_added', data => {
    createCard(data, {element: list_classes, ref: "classes"});
});

classes.on('child_changed', function (data) {
    createCard(data, {element: list_classes, ref: "classes"});
});

classes.on('child_removed', function (data) {
    removeCard(data, list_classes);
});

animals.on('child_added', data => {
    createCard(data, {element: list_animals, ref: "animais"});
});

animals.on('child_changed', function (data) {
    createCard(data, {element: list_animals, ref: "animais"});
});

animals.on('child_removed', function (data) {
    removeCard(data, list_animals);
});

function createCard(data, type) {
    var cardTemplate = document.getElementById(data.key);
    if (!cardTemplate) {
        cardTemplate = document.getElementById(type.ref).cloneNode(true);
        cardTemplate.id = data.key;
    }
    setImage(cardTemplate.querySelector('.icon'), "imagens/"+type.ref+ "/"+data.key);

    cardTemplate.querySelector('#name').textContent = data.val().nome;
    if (type.ref=="animais"){
        cardTemplate.querySelector('#sub').textContent = data.val().nome_cientifico;
        cardTemplate.classList.add('cardlist');
    }
    else{
        cardTemplate.querySelector('#sub').style.display = "none";
        cardTemplate.classList.add('chip');
    }

    cardTemplate.querySelector('#detail').innerText = JSON.stringify(data.val(), null, 3);
    /*cardTemplate.addEventListener("click", function () {
        loadAnimalDetail(cardTemplate);
    });*/
    type.element.appendChild(cardTemplate);
    cardTemplate.style.display = null;
}

function removeCard(data, type) {
    var cardTemplate = document.getElementById(data.key);
    type.removeChild(cardTemplate);
}
function setImage(obj, key) {
    var storageRef = firebase.storage().ref(key);
    storageRef.getDownloadURL().then(function (url) {
        obj.src = url;
    });
}