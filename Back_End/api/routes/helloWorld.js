var cors = require("cors")
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");

module.exports = function (application) {
    
application.use(cors());


// Adding Middleware wich will request the token on following function
application.use(function (req, res, next) {
    let token = req.body.token || req.headers["token"];
    let appData = {};
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function (err) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Token is invalid !";
                res.status(500).json(appData);
            } else {
                next();
            }
        });
    } else {
        appData["error"] = 1;
        appData["data"] = "Please send a token";
        res.status(403).json(appData);
    }
});


application.get("/hello/world", function (req, res) {
    let appData = {};
    //Try to get a connection on database if has error return 500 status
    var database = application.config.database()
    database.getConnection(function (err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            //Search the users list on DB
                res.json("Hello World")
            };
            connection.release();
        })
    });
    
}


// module.exports = hello;