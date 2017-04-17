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

    const auth = firebase.auth();
    const storage = firebase.storage(); 
    const database = firebase.database();
    const loginPage = document.getElementById('loginPage');
    const content = document.getElementById('content');
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');
    const welcome_msg = document.getElementById('welcome_msg');


    btnLogin.addEventListener('click', e => {
        const txtEmail = document.getElementById('txtEmail');
        const txtPass = document.getElementById('txtPass');

        firebase.auth().signInWithEmailAndPassword(txtEmail.value, txtPass.value).catch(function (error) {
            // Handle Errors here.
            console.log("Ocorreu erro ao logar: " + error.code + " - " + error.message);
            // Get the snackbar DIV
            var x = document.getElementById("snackbar");
            x.innerText = error.message;

            // Add the "show" class to DIV
            x.className = "show";

            // After 3 seconds, remove the show class from DIV
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 8000);
        });
        loginPage.style.display = "none";
    });

    btnLogout.addEventListener('click', e => {
        firebase.auth().signOut().then(function () {
            console.log("Sign-out successful.");
        }, function (error) {
            console.log("An error happened. " + error.message);
            alert("An error happened. " + error.message);
        });
    });

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            window.user = user;
            console.log("User is signed in.");
            welcome_msg.innerText = "Olá, vamos começar... =)";
            loginPage.style.display = "none";
            btnLogout.style.display = "block";
            content.style.display = "block";
        } else {
            console.log("No user is signed in.");
            welcome_msg.style.display = "none";
            loginPage.style.display = "block";
            btnLogout.style.display = "none";
            content.style.display = "none";
        }
    });

})();