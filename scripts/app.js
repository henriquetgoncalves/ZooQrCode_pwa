(function () {
    /*****************************************************************************
     *
     * Event listeners for UI elements
     * ****************************************************************************/
    document.getElementById('fabQrCodeScan').addEventListener('click', function () {        
        window.location.href = "qrcode-scanner.html";
    });
    
    document.getElementById('menuItem_About').addEventListener('click', function () {        
        window.location.href = "about.html";
    });
    
    document.getElementById('menuItem_Refresh').addEventListener('click', function () {
        // Refresh all of the forecasts
        app.updateForecasts();
    });
    
    document.getElementById('menuItem_Add').addEventListener('click', function () {
        // Open/show the add new city dialog
        //app.toggleAddDialog(true);
        var dialog = document.querySelector('dialog');

        if (! dialog.showModal()) {
          dialogPolyfill.registerDialog(dialog);
        }          
    });

    document.getElementById('dialog-button-close').addEventListener('click', function() {
        dialog.close();
    }); 
 
    
    document.getElementById('dialog-button-AddCity').addEventListener('click', function () {
        // Add the newly selected city
        var select = document.getElementById('selectCityToAdd');
        var selected = select.options[select.selectedIndex];
        var key = selected.value;
        var label = selected.textContent;
        app.getForecast(key, label);
        app.selectedCities.push({
            key: key,
            label: label
        });
        app.saveSelectedCities();
        dialog.close();
    });

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