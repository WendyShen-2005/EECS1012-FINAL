var url = "http://localhost:3000/post";

//figuring out which user we're working with
const documentPath =  window.location.href;
const documentUser = documentPath.substring(
    documentPath.lastIndexOf("users/") + 6, 
    documentPath.lastIndexOf("/")
);
var user = documentUser;

// send request to retrieve user styles & images
document.addEventListener('DOMContentLoaded', () => {
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'loadSavedContent'
    }),response);
    if(documentPath.indexOf("editor") != -1){
        document.getElementById("description").addEventListener("input", () => {
            $.post(url+'?data='+JSON.stringify({
                'name':user,
                'action':'checkIfDescSaved',
                'newDesc':document.getElementById("description").value
            }), response);
        })
    }
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
saveTextColor = () => {
    const color = document.getElementById("text-color-picker").value + "";
    const hex = color.substring(1, color.length);
    changeTextColor(hex);
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setTextColor',
        'color':hex
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
        changeTextColor(response["textColor"]);
        
        document.getElementById("profile-picture").src = "../../images/"+response['pfp'];
        if(response['bgSetting'] == 'color'){
            document.getElementById("profile").style.backgroundImage = null;
            document.getElementById("profile").style.backgroundColor = "#" + response['bgColor'];
        } else {
            document.getElementById("profile").style.backgroundColor = null;
            document.getElementById("profile").style.backgroundImage = `url("../../images/${response['bgImg']}")`;
        }
    } else if(response['action'] == 'descSaved'){
        document.getElementById("descSaveStatus").innerHTML = "Status: Saved"
    } else if(response['action'] == 'descNotSaved'){
        document.getElementById("descSaveStatus").innerHTML = "Status: Not saved"

    }
}
changeTextColor = (hex) => {
    const colorCode = "#" + hex;
    const stats = document.getElementById("stats").getElementsByTagName("h3");
    for(var i = 0; i < stats.length; i++){
        stats[i].style.color = colorCode;
    }
    document.getElementById("description").style.color = colorCode;
    document.getElementById("username").style.color = colorCode;
    document.getElementById("line").style.borderColor = colorCode;
    
    //if in editor mode, do not change description color
    if(documentPath != -1)
        document.getElementById("description").style.color = "#000000";
    
}
// if(documentPath.indexOf("editor") != -1){
//     console.log(document.getElementById("description").value)
//     // document.getElementById("description").addEventListener("change", () => {
//     //     console.log("hello")
//     // }
//     // );
// }