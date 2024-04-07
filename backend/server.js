const express = require("express");
const app = express();

const port = 3000;

app.get('/saveDraft', (req, res) => {
    console.log(req.query);
    //console.log(req.query["content"]);
    var fs = require('node:fs'); 

    //formatting a string to write to a file
    var content = req.query["content"];
    console.log(typeof content);
    //the code below attempts to access and write to a file
    //on the server side.  we 'try' to access the file; if we
    //can't we will catch an 'error'.
    try {
        fs.appendFile('test.txt', content, function (err) {
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
})

app.get('/saveContact', (req, res) => {
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
})

app.listen(port, function() {
    console.log(`Listening on port ${port}`)
})