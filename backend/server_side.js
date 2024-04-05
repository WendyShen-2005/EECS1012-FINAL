const express = require('express');
const app = express();

const fs = require("fs");

const multer = require('multer');
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

// Route for serving the homepage
app.get('/', (req, res) => {
    res.send('Hello world');
});

// Routes for handling file uploads
app.post('/api/upload/bgImg', upload.single('bgImg'), (req, res) => {
    res.send("Picture uploaded successfully (close this tab)");
});

app.post('/api/upload/pfp', upload.single('pfp'), (req, res) => {
    res.send("Picture uploaded successfully (close this tab)");
})

//Routes for saving bg preferences
app.post('/post', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.query)
    var queryInfo = JSON.parse(req.query['data']);

    if(queryInfo['action'] == 'setBgImg'){
        fs.readFile('./backend/profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);
            try {
                var profiles = JSON.parse(jsonString);
                for(var i = 0; i < profiles.length; i++)
                    if(profiles[i].username == queryInfo['name']){
                        profiles[i].bgSetting = "img";
                        profiles[i].bgImg = queryInfo['imgName'];
                    }
                fileWriter(profiles);
            } catch(err){
                console.log(err);
            }
        })
        saved(res);
    } else if(queryInfo['action'] == 'setBGColor'){
        fs.readFile('./backend/profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);
            try {
                var profiles = JSON.parse(jsonString);
                for(var i = 0; i < profiles.length; i++)
                    if(profiles[i].username == queryInfo['name']){
                        profiles[i].bgSetting = "color";
                        profiles[i].bgColor = queryInfo['color'];
                    }
                fileWriter(profiles);
            } catch(err){
                console.log(err);
            }
        })
        saved(res);
    } else if(queryInfo['action'] == 'setPFP'){
        fs.readFile('./backend/profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);
            try {
                var profiles = JSON.parse(jsonString);
                for(var i = 0; i < profiles.length; i++)
                    if(profiles[i].username == queryInfo['name'])
                        profiles[i].pfp = queryInfo['imgName'];
                fileWriter(profiles);
            } catch(err){
                console.log(err);
            }
        })
        saved(res);
    }
})

// Start the server
app.listen(3000, () => {
    console.log("Listening on port 3000");
});

saved = (res) => {
    console.log("saved")
    var jsontext = JSON.stringify({
        'action': 'saved'
    })
    res.send(jsontext);
} 
fileWriter = (profiles) => {
    profiles = JSON.stringify(profiles, null, 2);
        
    fs.writeFile('./backend/profiles-list.json', profiles, err => {
        if(err) {
            console.log(err);
        }
    })
}
errPrint = (err) => {
    if(err)
        console.log(err);
}