const express = require ('express');
const bodyParser = require ('body-parser');
const session = require ('express-session');
const validator = require ('express-validator');
const expressSanitizer = require('express-sanitizer');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 8000;
const path = require('path');

//Database connection
const url = "mongodb://localhost/calorieBuddy";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Connection to Calorie Buddy database established!");
  db.close();
});

//Session management
app.use(session({
    secret: 'topsecretrecipe',
    resave: false,
    saveUninitialized: false,
    cookie: {  expires: 600000 }
}));

app.use(bodyParser.json()); //for handling API CRUD operations
app.use(bodyParser.urlencoded({ extended: true }))

//Middleware for express-sanitization
app.use(expressSanitizer());

//Set the settings
require('./routes/main')(app)
//Serve assets (e.g. images)
app.use(express.static(path.join(__dirname, 'public')));
app.set('views',__dirname + '/views');

//EJS engine
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.listen(port, () => console.log(`Calorie Buddy App listening on port ${port}!`));
