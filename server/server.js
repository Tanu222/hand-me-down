let fs = require("fs")
let express = require("express");
let bodyParser = require('body-parser')
let shortid = require("shortid");
let media = require('./media');


let config = JSON.parse(fs.readFileSync("config.json"))
let host = config.host
let port = config.port
let psql = require("./psql");

const app = express()

app.use(bodyParser.json({ extended: false }));

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

app.get("/books", function (request, response) {
    psql.selectbooks((err, books) => {
        if (err) {
            console.error("Error reported while selecting book " + err.message);
            response.send("error while posting book")
        } else {
            response.send((books));
        }
    });
})

function getbook(request, response) {
    console.log(request.query.id)
    psql.selectbook(request.query.id,(err, book) => {
        if (err) {
            console.error("Error reported while selecting book " + err.message);
            response.send("error while posting book")
        } else {
            response.send((book));
        }
    });
}

app.get("/book", (req, res) => {
       getbook(req,res)
});

app.post("/book", (req, res) => {
        createbook(req,res);
});

function createbook(req,res){
    console.log('Received book post request');

        let book = {
            id: shortid.generate(),
            title: req.body.book.title,
            author: req.body.book.author,
            publication: req.body.book.publication,
            subject: req.body.book.subject,
            year: req.body.book.year,
            description: req.body.book.description,
            seller_userid: 2,
            seller_username: 'Julia',
            seller_email: 'julia.tendulkar@gmail.com',
            seller_phone: req.body.book.phone,
            price: req.body.book.price,
            imageUrl: req.body.book.imageUrl
        };

        console.log("book" + JSON.stringify(book))
    psql.createbook(book, (err) => {
            if (err) {
                console.error("Error reported while creating book" + err.message);
                retVal = {
                    success: false,
                    message: err.message
                };
            } else {
                retVal = {
                    success: true
                };
            }
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify(retVal, null, 2));
        });
}


app.post("/api/upload", (req, res) => {

    console.log('Received image upload request');
    let retVal;

    media.uploadFile(req, (err, serverFilename) => {
        if (err) {
            console.error("Error reported while uploading file " + err.message);
            retVal = {
                success: false,
                message: err.message
            };
        } else {
            retVal = {
                success: true,
                filename: serverFilename
            };
        }
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(retVal, null, 2));
    });

});


console.log('Node JS Server is listening on ' + port);
app.listen(port, host);
