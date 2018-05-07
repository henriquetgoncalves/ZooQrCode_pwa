window.setInterval(getLocation, 5000);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);        
    } else {
        x.innerHTML = "Geolocation não é suportada neste browser.";
    }

}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
    console.log("Latidude and Longitude has cactched");
    ShowMap(position); 
}

function ShowMap(position) {
    var mapOptions = {
        center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }
    var map = new google.maps.Map(document.getElementById("mapa_zoo"), mapOptions);
}

/*
Quinzinho de Barros

Portaria
-23.5069867,-47.4380347

Lateral Esquerda
-23.506422, -47.438959

Lateral Direita
-23.507272, -47.437459

Esquina Lateral Direita
-23.506727, -47.437092



*/