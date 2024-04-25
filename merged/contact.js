function submit() {
    var info = {};
    info["username"] = document.getElementById("username").value;
    info["email"] = document.getElementById("email").value;
    info["description"] = document.getElementById("desc").value;

    $.getJSON("http://localhost:3000/saveContact", info, function(data) {
        alert("Your post has been published.");
})
}