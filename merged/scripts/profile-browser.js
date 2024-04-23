var url = "http://localhost:3000/post";//server url

//add event listener -- load in profiles on load
document.addEventListener("DOMContentLoaded", async () => {
    await $.post(url+'?data='+JSON.stringify({
        'action':'listProfiles',
    }),response);
    setInput();
});

//function for search bar in profile browser (quick user search in browser)
function setInput () {
    const input = document.getElementById("userSearch");//get search bar

    //add event listener to search bar
    input.addEventListener("input", () => {
        const profiles = document.getElementsByTagName("p");
        const profilesListings = document.getElementsByClassName("user-listing");
        if(input.value != ""){//if the user is searching 
            for(var i = 0; i < profiles.length; i++){
                // console.log(profiles[i].innerHTML + " " + input.value)
                if(profiles[i].innerHTML.indexOf(input.value) != -1)//if the user matches the search term, display their section
                    profilesListings[i].style.display = "flex";
                else{//otherwise, don't display
                    // console.log("abc");//
                    profilesListings[i].style.display = "none";
                }
            }
        }
        else{//if the user is not searching anything, display everything
            // console.log("hey there")
            for(var i = 0; i < profiles.length; i++)
                profilesListings[i].style.display = "flex";
        }
        
    })
}
}

//when user clicks a profile from profile browser,
//changes variable that controls what profile we view
async function setClickFunc (username) {
    await $.post(url+'?data='+JSON.stringify({
        'action':'setViewingProfile',
        'name':username
    }),response);

    const currentUrl = window.location.href;
    window.location.href = currentUrl.substring(0,currentUrl.lastIndexOf("/")) + "/profile.html";
}

function response(data, status){

    var response = JSON.parse(data);//parse data from server
    
    switch(response['action']){
        case "profilesList": 
            const profilesSection = document.getElementById("profiles");
            console.log(response['data'])

            for(var i = 0; i < response['data'].length; i++){//generate the user sections
                const short = response['data'][i];
                const userSection = document.createElement("div");
                userSection.className = "user-listing";

                //styling a section-------------------------------------
                userSection.style.display = "flex";
                userSection.style.backgroundColor = "rgb(139, 139, 139)";
                userSection.style.padding = "10px";
                userSection.style.margin = "5px";
                userSection.style.alignItems = "center";
                //styling end------------------------------------------

                //set profile picture & username
                const userPFP = document.createElement("img");
                userPFP.src = "../images/" + short.profileSettings.pfp;
                const username = document.createElement("p");
                username.style.margin = "0 10px";
                username.role = "button";

                username.innerHTML = short.username;
                userPFP.style.width = "50px";
                userPFP.style.height = "50px";
                userPFP.style.borderRadius = "50%";
                
                profilesSection.appendChild(userSection);
                userSection.appendChild(userPFP);
                userSection.appendChild(username);
            
                username.onclick = function(){setClickFunc(short.username)};
            }
    }
    return new Promise((resolve, reject) => {
        resolve("response resolved")
    })
}
