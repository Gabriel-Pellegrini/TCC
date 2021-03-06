const express = require("express");
const consign = require("consign");
const app = express();
const cors = require('cors');


// Definition of view engine and views directory
app.set('view engine', 'ejs');
app.set('views', './api/views');

app.use(cors());

//Loads the middlewares to parse these data format
app.use(express.urlencoded({
    extended: true
}));

app.use('/images',express.static('api/views/css/'));

app.use(express.json())

consign()
    .include("./api/controllers/authentication.js")
    .then("./config/strategy.js")
    .then("./config/middlewares.js")
    .then("./api/controllers")
    .then("./api/models")
    .then("./config/database.js")
    .then("./config/errorhandler.js")
    .into(app)

module.exports = app ;