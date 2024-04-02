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
