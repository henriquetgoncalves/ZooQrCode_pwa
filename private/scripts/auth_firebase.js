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
    database = firebase.database();

$('#btnLogin').click(e => {
    const txtEmail = document.getElementById('txtEmail');
    const txtPass = document.getElementById('txtPass');

    const promise = auth.signInWithEmailAndPassword(txtEmail.value, txtPass.value);

    promise.catch(error => {
        // Handle Errors here.
        console.log("Ocorreu erro ao logar: " + error.code + " - " + error.message);
        snackbar_show(error.message, 10000);
    });
    return true;
});


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        window.user = user;
        console.log("User is signed in.");
        window.location.href = "./administrative.html";
        /*hide(loginPage);
        show(btnLogout);
        show(btnAdd);
        show(content);
        hide(btnDel);
        hide(btnCancel);
        hide(btnSave);*/
    } else {
        console.log("No user is signed in.");
        /*show(loginPage);
        hide(btnLogout);
        hide(content);
        hide(btnAdd);
        hide(btnDel);
        hide(btnCancel);
        hide(btnSave);*/
    }
});

