var url="https://kit.fontawesome.com/2a5e0b1595.js";

// load font
function loadScript() {    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.crossOrigin = "anonymous";
    head.appendChild(script);
}

//functions to format bold, italic and underlined text
function bold() {
    document.execCommand("bold");
}
function italic() {
    document.execCommand("italic");
}
function underline() {
    document.execCommand("underline");
}

//functions to align text
function leftAlign(){
    document.getElementById("textbox").style.textAlign = "left";
}
function centerAlign(){
    document.getElementById("textbox").style.textAlign = "center";
}
function rightAlign(){
    document.getElementById("textbox").style.textAlign = "right";
}
function justifyAlign() {
    document.getElementById("textbox").style.textAlign = "justify";
    document.getElementById("textbox").style.textJustify = "inter-word";
}

//function to change text's font
//create a dropdown bar to select fonts
function dropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}
//close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
if (!event.target.matches('.btnFontChange')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
    }
    }
}
} 
//change font size
function times() {
    document.getElementById("textbox").style.fontFamily = "Times New Roman";
}
function georgia() {
    document.getElementById("textbox").style.fontFamily = "Georgia";
}
function garamond() {
    document.getElementById("textbox").style.fontFamily = "Garamond";
}
function arial() {
    document.getElementById("textbox").style.fontFamily = "Arial";
}

//function to change background image
//function to change image
function loadBgImg() {
    var imgFileName = document.getElementById("imgUpload").value;
    imgFileName = imgFileName.substring(imgFileName.lastIndexOf("\\")+1, imgFileName.length)
    var path = "../images/";
    path = path + imgFileName;
    var str = "url(../images/" + imgFileName +")";

    document.body.style.backgroundImage = str;

    var text = {
        'name':user,
        'action':'loadBgImg',
        'imgName': imgFileName
    }
    //send change image request with the chosen image to server
    $.post("http://localhost:3000/post1" +"?data="+JSON.stringify({
        'name':user,
        'action':'loadBgImg',
        'imgName':imgFileName
    }), response);

    
}

//"save" function
function save() {
    var text={content: document.getElementById("textarea1").value,
              title: document.getElementById("title").value};
    //send data to server
    $.getJSON("http://localhost:3000/saveDraft", text, function(data) {
        alert("Your post has been saved.")
    })
}

//"publish" function
function publish() {
    var text={content: document.getElementById("textarea1").value,
              title: document.getElementById("title").value};
    //send data to server
    $.getJSON("http://localhost:3000/publishPost", text, function(data) {
        alert("Your post has been published.")
    })

}


