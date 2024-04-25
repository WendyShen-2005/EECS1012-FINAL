const express = require("express");
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const fs = require("fs");

const port = 3000;

const app = express();
const usersDb = {};
const bcrypt = require('bcryptjs');

require('dotenv').config();
//Wendy's

//tell server where to save images
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../images'); // Destination folder for uploaded files
    },
    filename: function(req, file, cb){ //Rename file
        cb(null, file.originalname);
    }
})

const upload = multer({storage: storage});

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
        fs.readFile('./profiles-list.json', 'utf-8', (err, jsonString) => {
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
        fs.readFile('./profiles-list.json', 'utf-8', (err, jsonString) => {
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
        fs.readFile('./profiles-list.json', 'utf-8', (err, jsonString) => {
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
        fs.readFile('./profiles-list.json', 'utf-8', (err, jsonString) => {
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

        fs.readFile('./profiles-list.json', 'utf-8', (err, jsonString) => {
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
        fs.readFile('./profiles-list.json', 'utf-8', (err, jsonString) => {
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
        fs.readFile('./profiles-list.json', 'utf-8', (err, jsonString) => {
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
        
    fs.writeFile('./profiles-list.json', profiles, err => {
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

//Mia's

// Logging middleware for debugging and development, provides concise output of requests.
app.use(morgan('dev'));

// Middleware to parse JSON payloads, allowing for easy access to request data.
app.use(express.json());

// Middleware to parse URL-encoded bodies, useful for form submissions.
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies attached to the client request object.
app.use(cookieParser());

// Session middleware configuration to handle user sessions with security settings.
// Uses a secret from environment variables for session encryption.
// Configures cookie security based on the environment (secure in production).
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, // don't save session if unmodified
  saveUninitialized: true, // save uninitialized session to store
  cookie: { secure: process.env.NODE_ENV === 'production' } // set cookies to secure in production
}));

// Serve static files such as HTML, CSS, JavaScript from a specified directory.
app.use(express.static(path.join(__dirname, '../frontend')));

// Configure storage for file uploads using multer, specifying the destination and filename.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files in the 'frontend/images' directory.
    cb(null, path.join(__dirname, 'frontend/images'));
  },
  filename: (req, file, cb) => {
    // Rename the uploaded files by appending a timestamp to the original name.
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Middleware to handle file uploads.
const upload = multer({ storage });

// Route to handle single file uploads under the 'bgImg' field in a form.
app.post('/api/upload', upload.single('bgImg'), (req, res) => {
  // Respond with a JSON object indicating successful upload and file details.
  res.json({ message: 'File uploaded successfully.', file: req.file });
});

// User registration route.
app.post('/api/signup', async (req, res) => {
  // Log incoming data for debugging purposes.
  console.log(req.body);
  const { username, password } = req.body;

  // Validate that username and password are provided.
  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Check if username already exists in the database.
  if (usersDb[username]) {
      return res.status(400).json({ message: 'Username already exists.' });
  }

  // Hash the password using bcrypt and store the user in the database.
  const hashedPassword = await bcrypt.hash(password, 8);
  usersDb[username] = { password: hashedPassword };

  // Respond with a success message.
  res.json({ message: 'Signup successful.', success: true });
});

// User login route.
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = usersDb[username];

  // Check if user exists.
  if (!user) return res.status(400).json({ message: 'User does not exist' });

  // Verify password.
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  // Set username in the session if login is successful.
  req.session.username = username;
  res.json({ message: 'Login successful', success: true });
});

// Retrieve user settings.
app.get('/api/settings', (req, res) => {
  const { username } = req.session;
  if (!username || !usersDb[username]) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(usersDb[username]);
});

// Update user settings.
app.post('/api/updateSettings', async (req, res) => {
  const { username } = req.session;
  if (!username || !usersDb[username]) return res.status(404).json({ message: 'User not found' });

  const { email, password } = req.body;

  // Optionally update the email and password.
  if (email) usersDb[username].email = email;
  if (password) usersDb[username].password = await bcrypt.hash(password, 8);

  res.json({ message: 'Settings updated successfully' });
});

// Start the server on the configured port.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


//Quynh's
// create a json file

/*var objStart = {
        table: []
    };*/

// save the draft post into draftList.json
app.get('/saveDraft', (req, res) => {
    //console.log(req.query);
  
    var postProperty = {
        title : req.query["title"],
        content : req.query["content"],
        public : false
    };
    try {
        fs.readFile('database.json', "utf8", function readFileCallback(err, data) {
            if (err) {throw err;}
            else {
                var objStart = JSON.parse(data); //now it is a list
                //console.log(data);
                objStart["postDetails"].push(postProperty); //add some data
                json = JSON.stringify(objStart, undefined, 4); //convert it back to json
                fs.writeFile('database.json', json, 'utf8', function (err) {
                    if (err) throw err;
                    console.log('Append new post database.json file on server.');
                });    
            } 
        });    
    } catch (err) {
        console.error(err);
    }
    res.setHeader("Access-Control-Allow-Origin", "*") //Allows browser to load return values
    res.json({
        output: "Wrote to a file on the server."
    })
})
// save public status of post
app.get('/publishPost', (req, res) => {
    var postProperty = {
        title : req.query["title"],
        content : req.query["content"],
        public : true
    };
    try {
        fs.readFile('database.json', "utf8", function readFileCallback(err, data) {
            if (err) {throw err;}
            else {
                var objStart = JSON.parse(data); //now it is a list
                objStart["postDetails"].push(postProperty); //add some data
                json = JSON.stringify(objStart, undefined, 4); //convert it back to json
                fs.writeFile('database.json', json, 'utf8', function (err) {
                    if (err) throw err;
                    console.log('Save and change public to true');
                });   
            }
        });    
    } catch (err) {
        console.error(err);
    }
    res.setHeader("Access-Control-Allow-Origin", "*") //Allows browser to load return values
    res.json({
        output: "Wrote to a file on the server."
    })
})

//push info into contact.json
app.get('/saveContact', (req, res) => {

    var contactInfo = {username: req.query["username"],
               email: req.query["email"],
               description: req.query["description"]};

    try { 
        fs.readFile('database.json', "utf8", function readFileCallback(err, data) {
            if (err) {throw err;} 
            else {
            var objStart = JSON.parse(data); //now it an object
            objStart["contactReqs"].push(contactInfo); //add some data
            json = JSON.stringify(objStart, undefined, 4); //convert it back to json
            fs.writeFile('database.json', json, 'utf8', function (err) {
                if (err) throw err;
                console.log('Append contact info to database.json.');
            });    
        } 
            }
        );}
    catch (err) {
        console.error(err);
    }
    res.setHeader("Access-Control-Allow-Origin", "*") //Allows browser to load return values
    res.json({})
})

app.listen(port, function() {
    console.log(`Listening on port ${port}`)
})


// get uploaded background image
app.post('/api/upload/imgUpload', upload.single('imgUpload'), (req, res) => {
    //res.header("Access-Control-Allow-Origin", "*");
    res.send("Picture uploaded successfully (close this tab)");
});

app.post('/post1', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");//give appropriate access
    var queryInfo = JSON.parse(req.query['data']);//parse request data

    //request 1: save bg img
    if(queryInfo['action'] == 'loadBgImg') {
        fs.readFile('./database.json', 'utf-8', (err, jsonString) => {
            console.log(JSON.parse(jsonString))
            errPrint(err);//handle errors
            try {
                var data = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < data.users.length; i++)//find correct user
                    if(data.users[i].username == queryInfo['name']){
                        //profiles[i].bgSetting = "img";//set bg preference to img
                        data.users[i].pageSettings.bgImg = queryInfo['imgName'];//save bg img file name
                    }
                fileWriter(data);//write updated JSON to user data
            } catch(err){//handle errors
                console.log(err);
            }
        })
        saved(res);//send saved response to client*/
    //request 2: save bg color
    }
});
