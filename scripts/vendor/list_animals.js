var btnVoltar = document.getElementById('menu-lower-left');
var parameter = gup('par', location.search);

const auth = firebase.auth(),
    storage = firebase.storage(),
    classes = firebase.database().ref('tabelas/classes'),    
    list_animals = document.getElementById('list_animals'),
    list_classes = document.getElementById('list_classes');
    
var animals = firebase.database().ref('tabelas/animais');

if(parameter)
    animals = animals.orderByChild("estado_conservacao").equalTo("Ameaçado de Extinção");

classes.on('child_added', data => {
    createCard(data, { element: list_classes, ref: "classes" });
});

classes.on('child_changed', function (data) {
    createCard(data, { element: list_classes, ref: "classes" });
});

classes.on('child_removed', function (data) {
    removeCard(data, list_classes);
});

animals.on('child_added', data => {
    createCard(data, { element: list_animals, ref: "animais" });
});

animals.on('child_changed', function (data) {
    createCard(data, { element: list_animals, ref: "animais" });
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
    $('.loader').show();
    setImage(cardTemplate.querySelector('.icon'), type.ref, data.key);
    sessionStorage.setItem(data.key, cardTemplate.querySelector('.icon').src);

    cardTemplate.querySelector('#name').textContent = data.val().nome;
    if (type.ref == "animais") {
        cardTemplate.querySelector('#sub').textContent = data.val().nome_cientifico;
        cardTemplate.classList.add('cardlist');
        cardTemplate.classList.add('animais');
        cardTemplate.classList.add(replaceSpecialChars(data.val().classificacao.classificacao));
        cardTemplate.addEventListener("click", function () {
            window.location.href = "animal-detail.html?animal=" + data.key;
        });
    }
    else {
        cardTemplate.querySelector('#sub').style.display = "none";
        cardTemplate.classList.add('chip');
        var x = replaceSpecialChars(data.val().nome);
        cardTemplate.classList.add(x);
        cardTemplate.addEventListener("click", function () {
            $('#list_animals .animais').fadeOut();
            $('#no_animal').fadeOut();
            //$('#list_classes').fadeOut();
            if ($('#list_animals .' + x).length == 0){
                $('#no_animal').fadeIn();
            }else{
                $('#list_animals .' + x).fadeIn();
            }
            
        });
    }


    type.element.appendChild(cardTemplate);
    cardTemplate.style.display = null;
}

function removeCard(data, type) {
    var cardTemplate = document.getElementById(data.key);
    type.removeChild(cardTemplate);
}

function setImage(obj, ref,key) {
    var storageRef = firebase.storage().ref("imagens/" + ref + "/" + key);
    var data = sessionStorage.getItem(key);
    if (!data) {
        try {
            storageRef.getDownloadURL().then(function (url) {
                obj.src = url;                
                $('.loader').hide();
            });
        }catch (e){
            console.log(e.code + "-" + e.message);
        }
    }else {
        obj.src = data;        
    }
    $('.loader').hide();

}
function replaceSpecialChars(str) {
    str = str.replace(/[ÀÁÂÃÄÅ]/, "A");
    str = str.replace(/[àáâãäå]/, "a");
    str = str.replace(/[èéêë]/, "e");
    str = str.replace(/[ìíîï]/, "i");
    str = str.replace(/[Ç]/, "C");
    str = str.replace(/[ç]/, "c");
    return str.replace(/[^a-z0-9]/gi, '').toLowerCase();
}
function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}