'use strict';
/*jslint node: true */
/*jshint esversion: 6 */

const express = require('express');
const bodyParser = require('body-parser');
let bookDao = require("./bookDao");
let media = require('../utils/media');
let shortid = require("shortid");
let fs = require('fs');

const CONTENT_STORAGE_LOCAL_DIR = '/app/app/upload/';
//const CONTENT_STORAGE_LOCAL_DIR = "C:\\dev\\HandMeDown\\app\\upload\\";

const router = express.Router();
router.use(bodyParser.json({ type: 'application/json' }));



function getbook(request, res) {
    console.log(request.query.id)
    bookDao.selectbook(request.query.id, (err, book) => {
        if (err) {
            console.error("Error reported while selecting book " + err.message);
            res.send("error while posting book")
        } else {
            book.image_blob = null;
            res.send((book));
        }
    });
}


const createbook = (req, res) => {

    console.log('Received book post request');


    readImageIfExists(req.body.book.imageUrl, (err, imgData) => {
        if (err) {
            console.log('Error in reading image for url ' + req.body.book.imageUrl);
            res.send("Error while posting book");
        }
        //console.log('imgData', imgData);

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
            seller_username: req.body.book.user_name,
            seller_email: req.body.book.user_email,
            seller_phone: req.body.book.seller_phone,
            price: req.body.book.price,
            imageUrl: req.body.book.imageUrl,
            create_ts: new Date().toISOString(),
            image_blob: imgData
        };


        //console.log("book" + JSON.stringify(book))
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
    });
}

const readImageIfExists = (url, next) => {

    if (!url) {
        return next(null, null);
    }

    fs.readFile(CONTENT_STORAGE_LOCAL_DIR + url, 'hex', (err, imgData) => {
        if (err) return next(err);
        imgData = '\\x' + imgData;
        return next(null, imgData);
    });
};


router.use("/upload", (req, res) => {

    if (req.method === 'POST') {

        console.log('Received image upload request');
        let retVal;

        uploadFile(req, (err, serverFilename) => {
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

const uploadFile = (req, next) => {

    media.uploadFile(req, (err, serverFilename) => {
        if (err) return next(err);

        let fileUrl = (CONTENT_STORAGE_LOCAL_DIR + serverFilename).trim();
        console.log('About to read file size for ', fileUrl);
        let filesizeInKB = media.getFilesizeInKB(fileUrl);
        console.log('filesize in kb ', filesizeInKB);

        media.compressFile(CONTENT_STORAGE_LOCAL_DIR, serverFilename, filesizeInKB, (err, compressedFileUrl) => {
            if (err) return next(err);

            console.log("Compressed file url " + compressedFileUrl)
            return next(null, compressedFileUrl);
        });

    });

};


router.use('/search', (req, res, next) => {
    if (req.method === 'GET') {
        bookDao.searchbooks(req.query.keyword, (err, books) => {
            if (err) {
                console.error("Error reported while searching books " + err.message);
                res.send("Error while searching books")
            } else {
                books.forEach(book => {
                    book.image_blob = null;
                });
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


router.use('/all', (req, res, next) => {
    if (req.method === 'GET') {
        bookDao.selectbooks((err, books) => {
            if (err) {
                console.error("Error reported while searching books " + err.message);
                res.send("Error while searching books")
            } else {
                media.restoreImagesFromDB(books, (err) => {
                    if (err) {
                        console.error("Error reported while restoring Images for books " + err.message);
                        res.send("Error while searching books")
                    }
                    books.forEach(book => {
                        book.image_blob = null;
                    });
                    res.send((books));

                });
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