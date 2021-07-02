let Busboy = require("busboy");
let shortid = require("shortid");
let fs = require('fs');

const CONTENT_STORAGE_LOCAL_DIR = '/app/app/upload/';
//const CONTENT_STORAGE_LOCAL_DIR = "C:\\dev\\HandMeDown\\app\\upload\\";

exports.uploadFile = (req, next) => {

    let busboy = new Busboy({
        headers: req.headers
    });

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {

        console.log('Busboy: File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

        let fileNamePrefix = 'img';

        let serverFileName = fileNamePrefix + '-' + shortid.generate() + '.png';

        file.on('data', (data) => {
            console.log('Busboy: File Upload [' + fieldname + '] received ' + data.length + ' bytes');
        });

        file.on('end', () => {
            console.log('Busboy: File Upload [' + fieldname + '] Finished');
            return next(null, serverFileName);
        });

        console.log("Busboy: File Upload starts: " + filename + ':' + mimetype);
        console.log("File is written at " + CONTENT_STORAGE_LOCAL_DIR + serverFileName);
        let fstream = fs.createWriteStream(CONTENT_STORAGE_LOCAL_DIR + serverFileName);
        file.pipe(fstream);

    });

    // busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    //     console.log( 'Busboy: Field [' + fieldname + ']: value: ' + inspect(val));
    // });

    // busboy.on('partsLimit', function() {
    //     console.log( 'Busboy: parts limit event triggered');
    // });
    //
    // busboy.on('filesLimit', function() {
    //     console.log( 'Busboy: files limit event triggered');
    // });
    //
    // busboy.on('fieldsLimit', function() {
    //     console.log( 'Busboy: fields limit event triggered');
    // });

    busboy.on('finish', function () {
        console.log( 'Busboy: Upload complete!');
    });

    busboy.on('error', function (err) {
        console.log('error', 'Busboy: Error ' + err);
    });

    req.pipe(busboy);

};