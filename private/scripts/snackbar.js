const snackbar = document.getElementById("snackbar");

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