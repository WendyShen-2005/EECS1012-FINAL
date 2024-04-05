var url = "http://localhost:3000/post";

//figuring out which user we're working with
var documentPath =  window.location.href;
documentPath = documentPath.substring(
    documentPath.lastIndexOf("users/") + 6, 
    documentPath.lastIndexOf("/")
);
var user = documentPath;

// send request to retrieve user styles & images
document.addEventListener('DOMContentLoaded', () => {
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'loadSavedContent'
    }),response);
});

// change current page background color & send request to update user preferences
saveBGColor = () => {
    const bg = document.getElementById("profile");
    bg.style.backgroundImage = null;
    var color = document.getElementById("color-picker").value + "";
    bg.style.backgroundColor = color;
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setBGColor',
        'color':color.substring(1,color.length)
    }),response);
}
setBgImg = () => {
    const bg = document.getElementById("profile");
    bg.style.backgroundColor = null;
    var fileName = document.getElementById('bgImg').value + "";
    fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
    console.log(fileName);
    bg.style.backgroundImage = `url("images/${fileName}")`;
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setBgImg',
        'imgName':fileName
    }),response);
}
setPFP = () => {
    const pfp = document.getElementById("profile-picture");
    var fileName = document.getElementById('pfp').value + "";
    fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
    console.log(fileName);
    pfp.src = `images/${fileName}`;
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setPFP',
        'imgName':fileName
    }),response);
}
clearPFP = () => {
    const pfp = document.getElementById("profile-picture");
    pfp.src = `images/default.jpg`;
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setPFP',
        'imgName':'default.jpg'
    }),response);
}

saveDesc = () => {
    console.log(document.getElementById("description").value);
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setDesc',
        'desc':document.getElementById("description").value
    }),response);
}

function response(data, status){

    var response = JSON.parse(data);
// console.log(response)
    if(response['action'] == 'saved')
        console.log("saved");
    else if(response['action'] == 'updateProfile'){
        console.log("Updated styles")
        document.getElementById("username").innerHTML = "@" + user;
        document.getElementById("description").value = response['description'];
        document.getElementById("description").innerHTML = response['description'];

        document.getElementById("profile-picture").src = "../../images/"+response['pfp'];
        if(response['bgSetting'] == 'color'){
            document.getElementById("profile").style.backgroundImage = null;
            document.getElementById("profile").style.backgroundColor = "#" + response['bgColor'];
        } else {
            document.getElementById("profile").style.backgroundColor = null;
            document.getElementById("profile").style.backgroundImage = `url("../../images/${response['bgImg']}")`;
        }
    }
}