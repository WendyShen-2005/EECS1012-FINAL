const express = require("express");
const app = express();

const port = 3000;

// create a json file
var fs = require('node:fs'); 
var objStart = {
        table: []
    };

// save the draft post into draftList.json
app.get('/saveDraft', (req, res) => {
    //console.log(req.query);
  
    var postProperty = {
        content : req.query["content"],
        title : req.query["title"],
        public : false
    };
    try {
        fs.readFile('profiles-list.json', "utf8", function readFileCallback(err, data) {
            if (err) {throw err;}
            else {
                objStart = JSON.parse(data); //now it is a list
                //console.log(data);
                objStart[0]["post"] = postProperty; //add some data
                json = JSON.stringify(objStart); //convert it back to json
                fs.writeFile('profiles-list.json', json, 'utf8', function (err) {
                    if (err) throw err;
                    console.log('Append "post" profiles-list.json file on server.');
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

/*app.get('/saveContact', (req, res) => {
    console.log(req.query);
    //console.log(req.query["content"]);
    var fs = require('node:fs'); 

    //formatting a string to write to a file
    var username = req.query["username"];
    var email = req.query["email"];
    var description = req.query["description"];
    var request = username + email + description + "\n";
    
    //the code below attempts to access and write to a file
    //on the server side.  we 'try' to access the file; if we
    //can't we will catch an 'error'.
    try {
        fs.appendFile('contact.txt', request, function (err) {
            if (err) throw err;
            console.log('Wrote to a file on the server.');
        });    
    } catch (err) {
        console.error(err);
    }

    //finally, send a response that all is well to the front end
    res.setHeader("Access-Control-Allow-Origin", "*") //Allows browser to load return values
    res.json({
        output: "Wrote to a file on the server."
    })
}) */

app.get('/publishPost', (req, res) => {
    var postProperty = {
        content : req.query["content"],
        title : req.query["title"],
        public : "false"
    };
    try {
        fs.readFile('profiles-list.json', "utf8", function readFileCallback(err, data) {
            if (err) {throw err;}
            else {
                postProperty["public"] = "true";
                objStart = JSON.parse(data); //now it is a list
                objStart[0]["post"] = postProperty; //add some data
                json = JSON.stringify(objStart); //convert it back to json
                fs.writeFile('profiles-list.json', json, 'utf8', function (err) {
                    if (err) throw err;
                    console.log('Change public to true');
                });   
            }
            
            if (postProperty["public"] == "true") {
                
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
    console.log(req.query);

    var obj = {username: req.query["username"],
               email: req.query["email"],
               description: req.query["description"]};

    try { 
        fs.readFile('contactList.json', "utf8", function readFileCallback(err, data) {
            if (err) {throw err;} 
            else {
            objStart = JSON.parse(data); //now it an object
            objStart.table.push(obj); //add some data
            json = JSON.stringify(objStart); //convert it back to json
            fs.writeFile('contactList.json', json, 'utf8', function (err) {
                if (err) throw err;
                console.log('Append to a json file on server.');
            });    
        } 
            }
        );}
    catch (err) {
        console.error(err);
    }
    res.setHeader("Access-Control-Allow-Origin", "*") //Allows browser to load return values
    res.json({
        output: "Wrote to a file on the server."
    })
})

app.listen(port, function() {
    console.log(`Listening on port ${port}`)
})
