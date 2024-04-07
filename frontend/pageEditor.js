var url="https://kit.fontawesome.com/2a5e0b1595.js";

function loadScript() {    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.crossOrigin = "anonymous";
    head.appendChild(script);
}
function bold() {
    document.getElementById("textarea1").style.fontWeight = "bold"; 
}
function leftAlign(){
    document.getElementById("textarea1").style.textAlign = "left";
}
function centerAlign(){
    document.getElementById("textarea1").style.textAlign = "center";
}
function rightAlign(){
    document.getElementById("textarea1").style.textAlign = "right";
}
function italic() {
    document.getElementById("textarea1").style.fontStyle = "italic";
}
function underline() {
    document.getElementById("textarea1").style.textDecoration = "underline";
}
function save() {
    var a = document.getElementById("textarea1").value;
    var text={content: a};
    //text["content"] = "a";
    //document.getElementById("abc").innerHTML = text["content"];
    //text["content"] = document.getElementById("textarea1").innerHTML;
    
    $.getJSON("http://localhost:3000/saveDraft", text, function(data) {
        var inform = "<b>Data received from the server:</b><br>";
        for (const [key, value] of Object.entries(data)) {
            console.log(key, value);
            inform += key + ": " + value + "<br>"
        }
        document.getElementById("inform").innerHTML = inform;
    })

}


