(function () {

    const auth = firebase.auth();

    document.getElementById('fabQrCodeScan').addEventListener('click', function () {
        window.location.href = "qrcode-scanner.html";
    });

    document.getElementById('menuItem_About').addEventListener('click', function () {
        window.location.href = "about.html";
    });
    document.getElementById('menuItem_Adm').addEventListener('click', function (){
        if (!auth.currentUser){
            window.location.href = "private/login.html";
        }else{            
            window.location.href = "private/administrative.html";
        }        
    });

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    //Registrando o arquivo service-worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('./service-worker.js').then(function (registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch(function (err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }

})();