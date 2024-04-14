var url = "http://localhost:3000/post";//server url

document.addEventListener("DOMContentLoaded", async () => {
    await $.post(url+'?data='+JSON.stringify({
        'action':'listProfiles',
    }),response);
    setInput();
});

function setInput () {
    const input = document.getElementById("userSearch");

    input.addEventListener("input", () => {
        const profiles = document.getElementsByTagName("p");
        const profilesListings = document.getElementsByClassName("user-listing");
        if(input.value != ""){
            for(var i = 0; i < profiles.length; i++){
                console.log(profiles[i].innerHTML + " " + input.value)
                if(profiles[i].innerHTML.indexOf(input.value) != -1)
                    profilesListings[i].style.display = "flex";
                else{
                    console.log("abc");
                    profilesListings[i].style.display = "none";
                }
            }
        }
        else{
            console.log("hey there")
            for(var i = 0; i < profiles.length; i++)
                profilesListings[i].style.display = "flex";
        }
        
    })
}

function response(data, status){

    var response = JSON.parse(data);//parse data from server
    
    switch(response['action']){
        case "profilesList": 
            const profilesSection = document.getElementById("profiles");
            console.log(response['data'])

            for(var i = 0; i < response['data'].length; i++){
                const short = response['data'][i];
                const userSection = document.createElement("div");
                userSection.className = "user-listing";
                userSection.style.display = "flex";
                userSection.style.backgroundColor = "rgb(139, 139, 139)";
                userSection.style.padding = "10px";
                userSection.style.margin = "5px";
                userSection.style.alignItems = "center";

                const userPFP = document.createElement("img");
                userPFP.src = "../images/" + short.profileSettings.pfp;
                const username = document.createElement("p");
                username.style.margin = "0 10px"
                username.role = "button";

                username.innerHTML = short.username;
                userPFP.style.width = "50px";
                userPFP.style.height = "50px";
                userPFP.style.borderRadius = "50%";
                
                profilesSection.appendChild(userSection);
                userSection.appendChild(userPFP);
                userSection.appendChild(username);
            }
    }
    return new Promise((resolve, reject) => {
        resolve("response resolved")
    })
}