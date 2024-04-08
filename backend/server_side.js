//server dependencies & set up stuff
const express = require('express');
const fs = require("fs");
const multer = require('multer');
const app = express();

//tell server where to save images
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})

const upload = multer({storage});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//function: upload bg image
//pre conditions: client requests bg image upload
//post conditions: upload image to folder
app.post('/api/upload/bgImg', upload.single('bgImg'), (req, res) => {
    res.send("Picture uploaded successfully (close this tab)");
});

//function: upload pfp
//pre conditions: client requests pfp upload
//post conditions: upload image to folder
app.post('/api/upload/pfp', upload.single('pfp'), (req, res) => {
    res.send("Picture uploaded successfully (close this tab)");
})

//function: handle various client requests
//pre conditions: client specifies which action
//post conditions: perform appropriate action and send response
app.post('/post', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");//give appropriate access
    var queryInfo = JSON.parse(req.query['data']);//parse request data

    //request 1: save bg img
    if(queryInfo['action'] == 'setBgImg'){
        fs.readFile('./backend/profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);//handle errors
            try {
                var profiles = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < profiles.length; i++)//find correct user
                    if(profiles[i].username == queryInfo['name']){
                        profiles[i].bgSetting = "img";//set bg preference to img
                        profiles[i].bgImg = queryInfo['imgName'];//save bg img file name
                    }
                fileWriter(profiles);//write updated JSON to user data
            } catch(err){//handle errors
                console.log(err);
            }
        })
        saved(res);//send saved response to client
    //request 2: save bg color
    } else if(queryInfo['action'] == 'setBGColor'){
        fs.readFile('./backend/profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);//handle errors
            try {
                var profiles = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < profiles.length; i++)//find correct user
                    if(profiles[i].username == queryInfo['name']){
                        profiles[i].bgSetting = "color";//set bg preference to color
                        profiles[i].bgColor = queryInfo['color'];//save bg color
                    }
                fileWriter(profiles);//write updated JSON to user data
                console.log(profiles)
            } catch(err){//handle errors
                console.log(err);
            }
        })
        saved(res);//send saved response to client

    //request 3: save profile picture
    } else if(queryInfo['action'] == 'setPFP'){
        fs.readFile('./backend/profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);//handle errors
            try {
                var profiles = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < profiles.length; i++)//find correct user
                    if(profiles[i].username == queryInfo['name'])
                        profiles[i].pfp = queryInfo['imgName'];//save pfp img file
                fileWriter(profiles);//write updated JSON to user data
            } catch(err){//handle errors
                console.log(err);
            }
        })
        saved(res);//send saved response to client
    
    //request 4: save description
    } else if(queryInfo['action'] == 'setDesc'){
        fs.readFile('./backend/profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);//handle errors
            try {
                var profiles = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < profiles.length; i++)//find correct user
                    if(profiles[i].username == queryInfo['name'])
                        profiles[i].description = queryInfo['desc'];//save new description
                fileWriter(profiles);//write updated JSON to user data
            } catch(err){//handle errors
                console.log(err);
            }
        })
        saved(res);//send saved response to client

    //request 5: send user preferences about profile
    } else if(queryInfo['action'] == 'loadSavedContent'){
        var userData = '{"action":"updateProfile", ';//start JSON response

        fs.readFile('./backend/profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);//handle errors
            try {
                var profiles = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < profiles.length; i++){//find correct user
                    if(profiles[i].username == queryInfo['name']){
                        console.log("sending user data...");

                        //all user profile data
                        userData +=`"bgSetting":"${profiles[i].bgSetting}", `;
                        userData +=`"bgColor":"${profiles[i].bgColor}", `;
                        userData +=`"bgImg":"${profiles[i].bgImg}", `;
                        userData +=`"pfp":"${profiles[i].pfp}", `;
                        userData +=`"description":"${profiles[i].description}", `;
                        userData +=`"textColor":"${profiles[i].textColor}"}`;
                    }
                }
                console.log("user data sent.");
                res.send(userData);
            } catch(err){//handle errors
                console.log(err);
            }
        })
    
    //request 6: save text color
    } else if(queryInfo['action'] == 'setTextColor'){
        fs.readFile('./backend/profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);//handle errors
            try {
                var profiles = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < profiles.length; i++)//find correct user
                    if(profiles[i].username == queryInfo['name'])
                        profiles[i].textColor = queryInfo['color'];//save text color

                fileWriter(profiles);//write updated JSON to user data
            } catch(err){//handle errors
                console.log(err);
            }
        })
        saved(res);//send saved response to client

    //request 7: check if description has been saved
    } else if(queryInfo['action'] == 'checkIfDescSaved'){
        fs.readFile('./backend/profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);//handle errors
            try {
                var profiles = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < profiles.length; i++)//find correct user
                    if(profiles[i].username == queryInfo['name'])
                        if(profiles[i].description == queryInfo['newDesc'])//if client description matches server description...
                            res.send(JSON.stringify({//tell client description is saved
                                'action':'descSaved'
                            }))
                        else //if client description does NOT match server description...
                            res.send(JSON.stringify({//tell client descriotion has not been saved
                                'action':'descNotSaved'
                            }))
                
            } catch(err){//handle errors
                console.log(err);
            }
        })
    }
})

// function: Start the server
//pre conditions: sent start server request in terminal
//post conditions: start server
app.listen(3000, () => {
    console.log("Listening on port 3000");
});

//function: generic saved response
//pre conditions: user data has been updated
//post conditions: send client response that data has been saved
saved = (res) => {
    console.log("saved")
    var jsontext = JSON.stringify({
        'action': 'saved'
    })
    res.send(jsontext);
} 

//function: update JSON file
//pre conditions: data has been modified
//post conditions: update database
fileWriter = (profiles) => {
    profiles = JSON.stringify(profiles, null, 2);
        
    fs.writeFile('./backend/profiles-list.json', profiles, err => {
        if(err) {//handle errors
            console.log(err);
        }
    })
}

//function: generic error handler
//pre conditions: an error has occured
//post conditions: log error in console so devs can fix
errPrint = (err) => {
    if(err)
        console.log(err);
}