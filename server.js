let fs = require("fs")
let express = require("express");
//let bodyParser = require('body-parser')


const bookRoute = require('./api/books/bookRoute');


let config = JSON.parse(fs.readFileSync("config.json"))
let host = config.host
let port = config.port

const app = express();

app.use(express.static('app'));


//app.use(bodyParser.json({ extended: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');

    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, cache-control, x-requested-with');

    if (req.method === "OPTIONS") {
        res.status(200);
        res.end();
    } else {
        next();
    }
});

app.use('/api/books', bookRoute);



console.log('Node JS Server is listening on ' + port);
app.listen(process.env.PORT || 5000);
// app.listen(port, host);
