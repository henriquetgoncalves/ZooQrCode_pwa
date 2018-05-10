(function () {

    const auth = firebase.auth(),
        storage = firebase.storage(),
        database = firebase.database(),
        animals = firebase.database().ref('tabelas/animais'),
        title = document.getElementById('title'),
        content = document.getElementById('content'),
        listAnimal = document.getElementById('listAnimal'),
        animalDetail = document.getElementById('animalDetail'),
        animalForm = document.getElementById('animalForm'),
        imgAnimal = document.getElementById('imgAnimal'),
        btnBack = document.getElementById('btnBack'),
        btnLogout = document.getElementById('btnLogout'),
        btnAdd = document.getElementById('btnAdd'),
        btnDel = document.getElementById('btnDel'),
        btnCancel = document.getElementById('btnCancel'),
        btnSave = document.getElementById('btnSave');

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            window.user = user;
            console.log("User is signed in.");
            show(btnLogout);
            show(btnAdd);
            show(content);
            hide(btnDel);
            hide(btnCancel);
            hide(btnSave);
        } else {
            console.log("No user is signed in.");
            hide(btnLogout);
            hide(content);
            hide(btnAdd);
            hide(btnDel);
            hide(btnCancel);
            hide(btnSave);
        }
    });

    btnLogout.addEventListener('click', e => {
        firebase.auth().signOut().then(function () {
            console.log("Sign-out successful.");
            window.location.href = "./login.html";
        }, function (error) {
            console.log("An error happened. " + error.message);
        });
    });


    animals.on('child_added', data => {
        createCard(data);
    });

    animals.on('child_changed', function (data) {
        createCard(data);
    });

    animals.on('child_removed', function (data) {
        removeCard(data);
    });

})();
function addForm(state) {
    if (state == 1) {
        title.innerText = "";
        hide(listAnimal);
        hide(btnAdd);
        hide(btnBack);
        hide(btnLogout);
        show(btnCancel);
        show(btnSave);
        show(animalDetail);
    } else if (state == 2) {
        title.innerText = "Animais";
        show(listAnimal);
        show(btnAdd);
        hide(btnDel);
        show(btnBack);
        show(btnLogout);
        hide(btnCancel);
        hide(btnSave);
        hide(animalDetail);
        reset();
        imgAnimal.src = "#";
    } else if (state == 3) {
        title.innerText = "";
        hide(listAnimal);
        hide(btnAdd);
        hide(btnBack);
        hide(btnLogout);
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

function ValidaInfos(animal){
    // Valida informações
    var bFlag=true;
    var cCampo="";

    if (animal.nome == ""){        
        bFlag=false;
        cCampo = "Nome";
    }
    else if(animal.nome_cientifico == ""){
        bFlag=false;
        cCampo = "Nome Científico";
    }
    else if(animal.estado_conservacao == ""){
        bFlag=false;
        cCampo = "Estado de Conservação";
    }
    else if(animal.classificacao.reino == ""){
        bFlag=false;
        cCampo = "Reino";
    }        
    else if(animal.classificacao.classificacao == ""){
        bFlag=false;
        cCampo = "Classificação";
    }    
    else if(animal.classificacao.ordem == ""){
        bFlag=false;
        cCampo = "Ordem";
    }    
    else if(animal.classificacao.familia == ""){
        bFlag=false;
        cCampo = "Família";
    }
    else if(animal.classificacao.especie == ""){
        bFlag=false;
        cCampo = "Espécie";
    }    
    else if(animal.distribuicao_geo_habitat == "" || animal.distribuicao_geo_habitat.length < 30 ){
        bFlag=false;
        cCampo = "Distribuição Geográfica e Habitat. Mínimo de 30 caracteres.";
    }
    else if(animal.caracteristica == "" || animal.caracteristica.length < 30 ){
        bFlag=false;
        cCampo = "Característica. Mínimo de 20 caracteres.";
    }
    else if(animal.dieta_habitos_alimentares == "" || animal.dieta_habitos_alimentares.length < 20 ){
        bFlag=false;
        cCampo = "Dieta e Hábitos Alimentares. Mínimo de 20 caracteres.";
    }
    else if(animal.reproducao == "" || animal.reproducao.length < 20 ){
        bFlag=false;
        cCampo = "Reprodução. Mínimo de 20 caracteres.";
    }
    else if (document.getElementById('fileselect').files.length <= 0){
        bFlag=false;
        cCampo = "imagem para o animal.";        
    }

    snackbar_show("Preencha o campo "+cCampo,10000);
    return bFlag;
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
        qrcode: id
    };    
    
    if( ValidaInfos(animal)){
        //add animal
        if(typeof id === "undefined" || id=="") {
            snackbar_show("Incluindo o animal " + animal.nome + "...", 10000);

            // Get a key for a new Animal.    
            var newAnimalKey = firebase.database().ref().child('tabelas').child('animais').push().key;
            animal.qrcode = newAnimalKey;
            
            // Get animal key storage reference - For remove image animal
            var storageRef = firebase.storage().ref("imagens/animais/" + newAnimalKey);
            // Uploading the file on storage firebase
            var uploadTask = storageRef.put(image).catch(e => {
                snackbar_close();
                snackbar_show(e.error + "-" + e.message, 10000);
            });

            //Save in firebase database for animals
            var updates = {};
            updates['/tabelas/animais/' + newAnimalKey] = animal;

            var promise = firebase.database().ref().update(updates);

            promise.catch(e => {
                snackbar_close();
                snackbar_show(e.error + "-" + e.message, 10000);
            });
        }
        //Update animal
        else {
            snackbar_show("Atualizando o animal " + animal.nome + "...", 7000);
            var promise = firebase.database().ref("tabelas/animais/" + id);
            promise.update(animal).catch(e => {
                snackbar_close();
                snackbar_show(e.error + "-" + e.message, 10000);
            });
            if (image) {
                // Get animal key storage reference - For remove image animal
                var storageRef = firebase.storage().ref("imagens/animais/" + id);
                storageRef.delete().catch(function (error) {
                    console.log("Oooops... Ocorreu um erro ao deletar o arquivo!");
                });
                // Uploading the file on storage firebase
                var uploadTask = storageRef.put(image);

                // Register three observers:
                // 1. 'state_changed' observer, called any time the state changes
                // 2. Error observer, called on failure
                // 3. Completion observer, called on successful completion
                uploadTask.on('state_changed', function (snapshot) {
                    // Observe state change events such as progress, pause, and resume
                    // See below for more detail
                    console.log(snapshot);

                }, function (error) {
                    // Handle unsuccessful uploads
                    snackbar_close();
                    snackbar_show(e.error + " - " + e.message, 20000);
                }, function () {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    snackbar_close();
                    snackbar_show("Concluído...", 20000);
                });
                var currentCard = document.getElementById(id);
                currentCard.querySelector('.icon').src = imgAnimal.src;
            }
        }

        addForm(2);
        //return false;
    }
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


    reset();
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
    var cardTemplate = document.getElementById(data.key);
    if (!cardTemplate) {
        cardTemplate = document.getElementById('cardtemplate').cloneNode(true);
        cardTemplate.id = data.key;
    }
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
    document.getElementById('txtID').value = obj.id;
    imgAnimal.src = obj.querySelector('.icon').src;
    show(imgAnimal);
    addForm(3);
}

function reset(){
    document.getElementById('txtNome').value = "";
    document.getElementById('txtNomeCientifico').value = "";
    $('#estado_conservacao').val("Ameaçado de Extinção");
    document.getElementById('txtReino').value = "";
    $('#classificacao').val("Anfíbios");
    document.getElementById('txtOrdem').value = "";
    document.getElementById('txtFamilia').value = "";
    document.getElementById('txtEspecie').value = "";
    document.getElementById('txtDistribuicao_geo_habitat').value = "";
    document.getElementById('txtCaracteristica').value = "";
    document.getElementById('txtDieta_habitos_alimentares').value = "";
    document.getElementById('txtReproducao').value = "";
    document.getElementById('txtID').value = "";
    imgAnimal.src = "url('#')";
}

$(document).keyup(function (e) {
    if (e.keyCode === 27) $('#btnCancel').click();   // esc
});

$('#btnGetQR').click(function (e){
    window.location.href = "javascript: window.open('https://chart.googleapis.com/chart?cht=qr&chs=177x177&chl="+ document.getElementById('txtID').value+"'); w.print(); w.close()";
});