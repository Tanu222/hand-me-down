'use strict';
/*jslint node: true */
/*jshint esversion: 6 */

const express = require('express');
const bodyParser = require('body-parser');
let bookDao = require("./bookDao");
let media = require('../utils/media');
let shortid = require("shortid");


const router = express.Router();
router.use(bodyParser.json({ type: 'application/json' }));


router.use('/displayText/all', (req, res, next) => {
    if (req.method === 'GET') {
        languageCtrl.getAllDisplayText(req, res, next);
    } else {
        logger.log('warn', req.method + ' ' + req.baseUrl + ' - Request method is not supported.');
        return res.status(405).send({
            message: 'Invalid Request Method'
        });
    }
});



function getbook(request, res) {
    console.log(request.query.id)
    bookDao.selectbook(request.query.id, (err, book) => {
        if (err) {
            console.error("Error reported while selecting book " + err.message);
            res.send("error while posting book")
        } else {
            res.send((book));
        }
    });
}


function createbook(req, res) {
    console.log('Received book post request');

    let retVal;
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
        seller_phone: req.body.book.seller_phone,
        price: req.body.book.price,
        imageUrl: req.body.book.imageUrl
    };

    console.log("book" + JSON.stringify(book))
    bookDao.createbook(book, (err) => {
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



router.use("/upload", (req, res) => {

    if (req.method === 'POST') {

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
    } else {
        console.error(req.method + ' ' + req.baseUrl + ' - Request method is not supported.');
        return res.status(405).send({
            message: 'Invalid Request Method'
        });

    }

});



router.use('/all', (req, res, next) => {
    if (req.method === 'GET') {
        bookDao.selectbooks((err, books) => {
            if (err) {
                console.error("Error reported while selecting book " + err.message);
                res.send("error while posting book")
            } else {
                res.send((books));
            }
        });
    } else {
        console.error(req.method + ' ' + req.baseUrl + ' - Request method is not supported.');
        return res.status(405).send({
            message: 'Invalid Request Method'
        });
    }
});


router.use("/", (req, res) => {

    switch (req.method) {
        case 'GET':
            getbook(req, res);
            break;

        case 'POST':
            createbook(req, res);
            break;

        default:
            console.error(req.method + ' ' + req.baseUrl + ' - Request method is not supported.');
            return res.status(405).send({
                message: 'Invalid Request Method'
            });

    }
});


module.exports = router;