const auth = firebase.auth(),
    storage = firebase.storage(),
    database = firebase.database();

$('#btnLogin').click(e => {
    
    snackbar_show("Entrando...");

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
        snackbar_close();
        window.location.href = "./administrative.html";
    } else {
        console.log("No user is signed in.");
    }
});

