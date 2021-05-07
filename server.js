const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());

//CORS Middleware

app.use(function (req, res, next) {
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
    next();
    });
    

app.use(express.static(__dirname + '/dist/starter'));
app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname+
'/dist/starter/index.html'));});
app.listen(process.env.PORT || 8080);