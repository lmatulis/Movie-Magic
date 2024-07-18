//
function getValues(message) {
    alert(message);
}

//Get values from the screen and display
function getValues2() {
    let message = document.getElementById("message").value
    let alertbox = document.getElementById("alertBox")

    alertbox.innerText = message
}