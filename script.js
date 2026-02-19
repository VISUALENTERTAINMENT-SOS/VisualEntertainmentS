function submitName() {
    const name = document.getElementById("username").value;
    const welcomeText = document.getElementById("welcomeText");

    if (name === "") {
        alert("Isi nama dulu ya!");
    } else {
        welcomeText.innerHTML = "Selamat datang, " + name + " 🚀";
    }
}