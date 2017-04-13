window.setInterval(getLocation, 10000);

var x = document.getElementById("mapa_zoo");

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