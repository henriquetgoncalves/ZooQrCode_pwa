(function () {

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
        database = firebase.database(),
        animals = firebase.database().ref('tabelas/animais');
    loginPage = document.getElementById('loginPage'),
        content = document.getElementById('content'),
        listAnimal = document.getElementById('listAnimal'),
        animalDetail = document.getElementById('animalDetail'),
        animalForm = document.getElementById('animalForm'),
        imgAnimal = document.getElementById('imgAnimal'),
        snackbar = document.getElementById("snackbar"),
        btnLogin = document.getElementById('btnLogin'),
        btnLogout = document.getElementById('btnLogout'),
        btnAdd = document.getElementById('btnAdd'),
        btnDel = document.getElementById('btnDel'),
        btnCancel = document.getElementById('btnCancel'),
        btnSave = document.getElementById('btnSave');

    btnLogin.addEventListener('click', e => {
        const txtEmail = document.getElementById('txtEmail');
        const txtPass = document.getElementById('txtPass');

        const promise = auth.signInWithEmailAndPassword(txtEmail.value, txtPass.value);

        promise.catch(error => {
            // Handle Errors here.
            console.log("Ocorreu erro ao logar: " + error.code + " - " + error.message);
            snackbar_show(error.message, 10000);
        });
        return promise;
    });

    btnLogout.addEventListener('click', e => {
        firebase.auth().signOut().then(function () {
            console.log("Sign-out successful.");
        }, function (error) {
            console.log("An error happened. " + error.message);
        });
    });

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            window.user = user;
            console.log("User is signed in.");
            hide(loginPage);
            show(btnLogout);
            show(btnAdd);
            show(content);
            hide(btnDel);
            hide(btnCancel);
            hide(btnSave);
        } else {
            console.log("No user is signed in.");
            show(loginPage);
            hide(btnLogout);
            hide(content);
            hide(btnAdd);
            hide(btnDel);
            hide(btnCancel);
            hide(btnSave);
        }
    });


    animals.on('child_added', data => {
        createCard(data);
    });

    animals.on('child_changed', function (data) {
        //setCommentValues(postElement, data.key, data.val().text, data.val().author);
    });

    animals.on('child_removed', function (data) {
        removeCard(data);
    });

})();
function addForm(state) {
    if (state == 1) {
        hide(listAnimal);
        hide(btnAdd);
        show(btnCancel);
        show(btnSave);
        show(animalDetail);
    } else if (state == 2) {
        show(listAnimal);
        show(btnAdd);
        hide(btnDel);
        hide(btnCancel);
        hide(btnSave);
        hide(animalDetail);
        animalForm.reset();
        imgAnimal.src = "#";
    } else if (state == 3) {
        hide(listAnimal);
        hide(btnAdd);
        show(btnCancel);
        show(btnSave);
        show(btnDel);
        show(animalDetail);
    }
    return false;
}
function hide(obj) {
    obj.style.display = "none";
}
function show(obj) {
    obj.style.display = "block";
}
function snackbar_show(msg, timeout) {
    snackbar.innerHTML = msg;

    // Add the "show" class to DIV
    snackbar.className = "show";

    // After @timeout seconds, remove the show class from DIV
    if (timeout > 0) {
        setTimeout(function () {
            snackbar_close();
        }, timeout);
    }
}
function snackbar_close() {
    snackbar.className = snackbar.className.replace("show", "");
}
function saveAnimal() {
    // Create animal object
    var id = document.getElementById('txtID').value;
    var image = document.getElementById('fileselect').files[0];
    var animal = {
        nome: document.getElementById('txtNome').value,
        nome_cientifico: document.getElementById('txtNomeCientifico').value,
        estado_conservacao: $('#estado_conservacao').find(":selected").text(),
        classificacao: {
            reino: document.getElementById('txtReino').value,
            classificacao: $('#classificacao').find(":selected").text(),
            ordem: document.getElementById('txtOrdem').value,
            familia: document.getElementById('txtFamilia').value,
            especie: document.getElementById('txtEspecie').value,
        },
        distribuicao_geo_habitat: document.getElementById('txtDistribuicao_geo_habitat').value,
        caracteristica: document.getElementById('txtCaracteristica').value,
        dieta_habitos_alimentares: document.getElementById('txtDieta_habitos_alimentares').value,
        reproducao: document.getElementById('txtReproducao').value,
        qrcode: document.getElementById('txtQrCode').value
    };
    if (id == "") {
        snackbar_show("Incluindo o " + animal.nome + "...", 0);

        // Get a key for a new Animal.    
        var newAnimalKey = firebase.database().ref().child('tabelas').child('animais').push().key;
        // Get animal key storage reference - For remove image animal
        var storageRef = firebase.storage().ref("imagens/animais/" + newAnimalKey);
        // Uploading the file on storage firebase
        var uploadTask = storageRef.put(image).catch(e => {
            snackbar_close();
            snackbar_show(e.error + "-" + e.message, 10000);
        });
        uploadTask.on('state_changed', function progress(snapshot) {
            console.log(snapshot.totalBytesTransferred); // progress of upload
            snackbar_close();
            snackbar_show(snapshot.totalBytesTransferred, 10000);
        });

        //Save in firebase database for animals
        var updates = {};
        updates['/tabelas/animais/' + newAnimalKey] = animal;

        var promise = firebase.database().ref().update(updates);

        promise.catch(e => {
            snackbar_close();
            snackbar_show(e.error + "-" + e.message, 10000);
        });
    } else {
        snackbar_show("Atualizando o " + animal.nome + "...", 0);
        var promise = firebase.database().ref("tabelas/animais/" + id);
        promise.update(animal).catch(e => {
            snackbar_close();
            snackbar_show(e.error + "-" + e.message, 10000);
        });
    }

    addForm(2);
    snackbar_close();

    return false;
}
function delAnimal() {

    if (!confirm("Deseja realmente excluir este registro?")) {
        return false;
    }

    // Get an animal key.
    var animalKey = document.getElementById('txtID').value;
    var databaseRef = firebase.database().ref('/tabelas/animais/' + animalKey);
    var storageRef = firebase.storage().ref("imagens/animais/" + animalKey);

    // Delete the file
    console.log("removing storage image");
    storageRef.delete().then(function () {
        // File deleted successfully
        console.log("image has removed");
    }).catch(function (error) {
        // Uh-oh, an error occurred!
        console.log(error.code + " - " + error.message);
        snackbar_show(error.code + " - " + error.message);
    });

    //Remove in firebase database for animals
    console.log("removing animal registre");
    databaseRef.remove().then(function () {
        // File deleted successfully
        console.log("animal has removed");
    }).catch(function (error) {
        // An error occurred!
        console.log(error.code + " - " + error.message);
        snackbar_show(error.code + " - " + error.message);
    });


    animalForm.reset();
    addForm(2);
    snackbar_show("Registro excluído com sucesso!", 6000);
}

function setImage(obj, key) {
    var storageRef = firebase.storage().ref("imagens/animais/" + key);
    storageRef.getDownloadURL().then(function (url) {
        obj.src = url;
    });
}
function createCard(data) {
    var cardTemplate = document.getElementById('cardtemplate').cloneNode(true);
    cardTemplate.id = data.key;
    setImage(cardTemplate.querySelector('.icon'), data.key);
    cardTemplate.querySelector('#name').textContent = data.val().nome;
    cardTemplate.querySelector('#sub').textContent = data.val().nome_cientifico;
    cardTemplate.querySelector('#detail').innerText = JSON.stringify(data.val(), null, 3);
    cardTemplate.addEventListener("click", function () {
        loadAnimalDetail(cardTemplate);
    });
    document.getElementById('listAnimal').appendChild(cardTemplate);
    cardTemplate.style.display = null;
}
function removeCard(data) {
    var cardTemplate = document.getElementById(data.key);
    document.getElementById('listAnimal').removeChild(cardTemplate);
}

function loadAnimalDetail(obj) {
    var animal = JSON.parse(obj.querySelector('#detail').innerText);
    document.getElementById('txtID').value = obj.id;
    document.getElementById('txtNome').value = animal.nome;
    document.getElementById('txtNomeCientifico').value = animal.nome_cientifico;
    $('#estado_conservacao').val(animal.estado_conservacao);
    document.getElementById('txtReino').value = animal.classificacao.reino;
    $('#classificacao').val(animal.classificacao.classificacao);
    document.getElementById('txtOrdem').value = animal.classificacao.ordem;
    document.getElementById('txtFamilia').value = animal.classificacao.familia;
    document.getElementById('txtEspecie').value = animal.classificacao.especie;
    document.getElementById('txtDistribuicao_geo_habitat').value = animal.distribuicao_geo_habitat;
    document.getElementById('txtCaracteristica').value = animal.caracteristica;
    document.getElementById('txtDieta_habitos_alimentares').value = animal.dieta_habitos_alimentares;
    document.getElementById('txtReproducao').value = animal.reproducao;
    document.getElementById('txtQrCode').value = animal.qrcode;
    imgAnimal.src = obj.querySelector('.icon').src;
    show(imgAnimal);
    addForm(3);
}

