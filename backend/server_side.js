const express = require('express');
const app = express();

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

// Route for handling file uploads
app.post('/api/upload', upload.single('bgImg'), (req, res) => {
    res.send("Picture uploaded successfully")
});

const port = 3000;

// Start the server
app.listen(port, () => {
    console.log("Listening on port 3000");
});