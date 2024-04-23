var url = "http://localhost:3000/post";//server url

const documentPath =  window.location.href;//get url of page we're working with

//figuring out which user's page we're on with
// var documentUser = documentPath.substring(
//     documentPath.lastIndexOf("users/") + 6, 
//     documentPath.lastIndexOf("/")
// );
var whosPage;

var user;
var loggedIn = null;
var settingLoggedIn = false;

const reloadPage = () => {
    location.reload(true);
}

//function: variety of functions for DOM loads
//pre conditions: page has been refreshed
//post conditions: tasks listed below...
document.addEventListener('DOMContentLoaded', async () => {
    //find out who's page we're on
    await $.post(url+'?data='+JSON.stringify({
        'action':'whosPage',
    }),response);
    user = whosPage;

    console.log(whosPage)
    
    //find out who's logged in
    await $.post(url+'?data='+JSON.stringify({
        'action':'whosLoggedIn',
    }),response);

    //ensure user does not edit other people's profiles
    if(documentPath.indexOf("profile-editor.html") != -1 && (loggedIn == null || loggedIn == "null" || user != loggedIn)){
        console.log("Access denied.");
        window.location.href = documentPath.substring(0, documentPath.lastIndexOf('/') + 1) + "profile.html";
    }
    //send request to refresh styles & images to server
    await $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'loadSavedContent'
    }),response);

    //if the user has edited description but has not saved, display the status to the user
    if(documentPath.indexOf("editor") != -1){ //see if we're in the profile editor or just the profile display
        console.log("heyyyyyyyyy")
        document.getElementById("description").addEventListener("input", async () => { //send request to check with backend database
            await $.post(url+'?data='+JSON.stringify({
                'name':user,
                'action':'checkIfDescSaved',
                'newDesc':document.getElementById("description").value
            }), response);
        })
    }

    console.log(loggedIn)
});

// function: change current page background color & send request to update user preferences
//pre conditions: user has updated background color
//post conditions: update background color & send to server to save preference
saveBGColor = () => {
    const bg = document.getElementById("profile"); //get background element
    bg.style.backgroundImage = null; //make sure background image does not display
    var color = document.getElementById("color-picker").value + "";//retrieve color
    bg.style.backgroundColor = color;//set color background

    //send request to server to save the new color background
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setBGColor',
        'color':color.substring(1,color.length)
    }),response);

    // location.reload(true);
}

//function: change & save text color
//pre conditions: user has set a new color value
//post conditions: update text color & send to server to save info
saveTextColor = () => {
    const color = document.getElementById("text-color-picker").value + "";//retrieve new color from client
    const hex = color.substring(1, color.length);//save data in format that will not mess up JSON
    changeTextColor(hex);//call function to change all applicable text color
console.log("hello")
    //send request to server to save text color
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setTextColor',
        'color':hex
    }),response);

    // location.reload(true);

}

//function: change & save background image
//pre conditions: user has set a new background image
//post conditions: change background image & send request to server to save the background preference
setBgImg = () => {
    const bg = document.getElementById("profile");//get background element
    bg.style.backgroundColor = null;//make sure background color does not display

    //get image name & change to proper format
    var fileName = document.getElementById('bgImg').value + "";
    fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
    //set background image
    console.log(fileName)
    bg.style.backgroundImage = `url("../../images/${fileName}")`;

    //send request to server to save background image
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setBgImg',
        'imgName':fileName
    }),response);

    // location.reload(true);

}

//function: change & save profile picture 
//pre conditions: user has updated profile picture file
//post conditions: change profile picture & send request to server to save profile picture
setPFP = () => {
    const pfp = document.getElementById("profile-picture");//get profile picture element

    //get new profile picture file & change to proper format
    var fileName = document.getElementById('pfp').value + "";
    fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);

    //set new profile picture
    pfp.src = `../../images/${fileName}`;

    //send request to server to save profile picture
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setPFP',
        'imgName':fileName
    }),response);

    // location.reload(true);

}

//function: clear profile picture & save preference
//pre conditions: user has clicked 'clear profile picture' button
//post conditions: change profile picture to default image & send request to server to save pfp preference
clearPFP = () => {
    const pfp = document.getElementById("profile-picture");//get profile picture element
    pfp.src = `../../images/default.jpg`;//change element to default

    //send request to save profile picture preference
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setPFP',
        'imgName':'default.jpg'
    }),response);

    // location.reload(true);

}

//function: save description
//pre conditions: user has pressed 'save' for description box
//post conditions: send request to server to save new description
saveDesc = () => {
    //send request to server to save new description
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setDesc',
        'desc':document.getElementById("description").value
    }),response);

    // location.reload(true);

}

//function: change text color
//pre conditions: text color
//post conditions: all relevent text & element colors are updated
changeTextColor = (hex) => {
    const colorCode = "#" + hex;//change hex parameter to proper format

    //get & set all relevent text elements
    const stats = document.getElementById("stats").getElementsByTagName("h3");
    for(var i = 0; i < stats.length; i++){
        stats[i].style.color = colorCode;
    }
    document.getElementById("description").style.color = colorCode;
    document.getElementById("username").style.color = colorCode;
    document.getElementById("line").style.borderColor = colorCode;
    
    //if in editor mode, do not change description color
    if(documentPath.indexOf("profile-editor.html") != -1)
        document.getElementById("description").style.color = "#000000";

    // location.reload(true);

    
}

//function: recieve response from server & do appropriate action
//pre conditions: server has sent a response
//post conditions: client performs appropriate action
function response(data, status){

    var response = JSON.parse(data);//parse data from server
    console.log(data)
    //response 1: indicate user preferences have been saved
    switch(response['action']){
        case "saved"://response 1: generic saved statement
            console.log("saved");
        case "updateProfile": //response 2: update user info
            // console.log("Updated styles " + JSON.stringify(response['action']) + " " + status);

            if(loggedIn != 'null' && loggedIn != null){
                console.log("logged in")
                if(documentPath.indexOf("profile-editor.html") == -1){//update nav bar to say logged in user's username if we're not in profile editor
                    document.getElementById("my-profile").style.display = "default";
                    document.getElementById("my-profile").innerHTML = `Edit ${loggedIn}'s profile`;
                    document.getElementById("my-profile").href = documentPath.substring(0, documentPath.lastIndexOf("users/") + 6) + `${loggedIn}/profile-editor.html`
                } else {
                    document.getElementById("my-profile").style.display = "default";
                    document.getElementById("my-profile").innerHTML = `View ${loggedIn}'s profile`;
                    document.getElementById("my-profile").href = documentPath.substring(0, documentPath.lastIndexOf("users/") + 6) + `${loggedIn}/profile.html`
                }
                // document.getElementById("login-logout").innerHTML = "Log out";
                // document.getElementById("login-logout").href = "";
                // document.getElementById("login-logout").onclick = logOut;
                document.getElementById("account-settings").style.display = "default";
            } else {
                console.log("not logged in")
                document.getElementById("my-profile").style.display = "none";
                document.getElementById("account-settings").style.display = "none";
                document.getElementById("login-logout").innerHTML = "Log in";
                // document.getElementById("login-logout").href = "";
                document.getElementById("login-logout").onclick = null;
            }

            document.getElementById("username").innerHTML = "@" + user;//ensure username is display appropriate user
            document.getElementById("description").value = response['description'];//update description for profile editor
            document.getElementById("description").innerHTML = response['description'];//update description for profile display
            changeTextColor(response["textColor"]);//call function to change text color
            console.log(response['pfp'] + " hello :)")
            document.getElementById("profile-picture").src = `../../images/${response['pfp']}`;//update profile picture
            

            //background settings
            if(response['bgSetting'] == 'color'){//color
                document.getElementById("profile").style.backgroundImage = null;//ensure we don't display image
                document.getElementById("profile").style.backgroundColor = "#" + response['bgColor'];//update bg color
            } else {//image
                document.getElementById("profile").style.backgroundColor = null;//ensure we don't display color
                document.getElementById("profile").style.backgroundImage = `url("../../images/${response['bgImg']}")`;//update bg img
            }
        case "descSaved"://response 3: display if description is saved
            if(loggedIn == user && documentPath.indexOf("editor") != -1){
                document.getElementById("descSaveStatus").innerHTML = "Status: Saved";
                document.getElementById("descSaveStatus").style.color = "green";
            }
        case "descNotSaved"://response 4: display if description is not saved
            if(loggedIn == user && documentPath.indexOf("editor") != -1){
                document.getElementById("descSaveStatus").innerHTML = "Status: Not saved"
                document.getElementById("descSaveStatus").style.color = "red";
            }
        case "setLoggedIn"://update whos logged in
            loggedIn = response['username'];  
        case "setPage":
            whosPage = response['username'];
    }
    return new Promise((resolve, reject) => {
        resolve("response resolved")
    })
}