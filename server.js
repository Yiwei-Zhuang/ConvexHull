let express = require('express');
const fs = require('fs');
const path = require('path');
// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();
// const cookieParser = require("cookie-parser");
let app = express();

// Middlewares
app.use(express.static('dist'))
// app.use(bodyParser.json());
// app.use(cookieParser());

/*
    Static
 */
console.log(__dirname + '/dist');
app.use(express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
    res.send("Hello There!");
});

let server = app.listen(8081, function () {
    let host = server.address().address
    let port = server.address().port
    console.log("Serve on http://%s:%s", host, port)
});
