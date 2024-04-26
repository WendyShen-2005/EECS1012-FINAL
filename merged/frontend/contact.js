function submit() {
    //package contact info
    var info = {};
    info["username"] = document.getElementById("username").value; 
    info["email"] = document.getElementById("email").value;
    info["description"] = document.getElementById("desc").value;

    $.getJSON("http://localhost:3000/saveContact", info, function(data) { //send data to server
        alert("Your post has been published."); //alert if successfully conducted
})
}