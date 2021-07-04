let Busboy = require("busboy");
const shortid = require("shortid");
const fs = require('fs');
const jimp = require('jimp');
const async = require('async');


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
            setTimeout(() => {
                return next(null, serverFileName);
            }, 100);
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

exports.compressFile = (filepath, filename, filesize, next) => {

    console.log('info', 'File Size is ' + filesize + ' KB.');

    let fileExtension = extractFileExtension(filepath + filename);

    switch (fileExtension) {
        case 'bmp':
        case 'gif':
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'tiff':
            compressJPEG(filepath, filename, filesize, next);
            break;
        case 'jfif':
        default:
            console.log('warn', 'Cannot compress file with extension ' + fileExtension);
            return next(null, filename);
    }

};


const compressJPEG = (filepath, filename, filesize, next) => {

    // Compressed file will always be .jpg
    let serverFileName = 'img-' + shortid.generate() + '.jpg';
    //let serverFileName = 'img-' + dataHelper.generateRandomId() + '.' + extractFileExtension(filename);
    let compressFileUrl = filepath + serverFileName;

    let imageCompression = 100;
    if (filesize > 4000) {
        imageCompression = 10;
    } else if (filesize > 2000) {
        imageCompression = 25;
    } else if (filesize > 1000) {
        imageCompression = 35;
    } else if (filesize > 500) {
        imageCompression = 60;
    }
    // } else {
    //     logger.log('info', 'File ' + filename + ' is not compressed.');
    //     return next(null, filename);
    // }

    // open a file called "lenna.png"
    jimp.read(filepath + filename, (err, img) => {
        if (err) return next(err);

        if (img.hasAlpha()) {
            // Image has transparent background, cannot compress without compromising the transparent background.
            // Do not compress, exit with the original image.
            console.log('info', 'Image with transparent background. Not compressing.');
            return next(null, filename);
        }


        img.quality(imageCompression); // set JPEG quality
        //.resize(256, 256) // resize
        //.greyscale(); // set greyscale

        img.writeAsync(compressFileUrl)
            .then(() => {
                console.log('info', 'File ' + filename + ' is compressed to ' + imageCompression + ' % of original');
                return next(null, serverFileName);
            })
            .catch((err) => {
                console.log('error', 'File ' + filename + ' could not be compressed. ' + err);
                return next(err);
            });
    }); // save

};

const getFilesizeInBytes = (filename) => {
    try {
        const stats = fs.statSync(filename);
        return stats.size;
    } catch (e) {
        console.log('error', 'Error getting file stats for ' + filename + ' : ' + e.message);
        return 0;
    }
};

const extractFileExtension = (filename) => {
    if (!filename) {
        return null;
    }

    let fileNameArr = filename.split('.');
    return fileNameArr[fileNameArr.length - 1];

};


exports.getFilesizeInKB = (filename) => {
    let sizeInBytes = getFilesizeInBytes(filename);
    return sizeInBytes / 1000.0;
};


exports.restoreImagesFromDB = (books, next) => {
    console.log("length",books.length)
    async.eachSeries(books, (book, callback) => {
        console.log(book.image_url)
        restoreImageFromDB(book.image_url, book.image_blob, callback);
    }, (err) => {
        if (err) return next(err);

        return next(null);
    });

};



const restoreImageFromDB = (imageurl, image_blob, next) => {

    if (!imageurl) {
        return next(null);
    }

    if (!image_blob) {
        console.log('File ' + imageurl + ' does not have blob image to restore');
        return next(null);
    }

    // If image exists, do not restore
    let imageExists = fs.existsSync(CONTENT_STORAGE_LOCAL_DIR + imageurl);
    
    if (imageExists) {
        console.log('File ' + imageurl + ' is already present. Not restored');
        return next(null);
    }

    fs.writeFile(CONTENT_STORAGE_LOCAL_DIR + imageurl, image_blob, (err) => {
        if (err) return next(err);

        console.log('File ' + imageurl + ' is restored');
        return next(null);
    });

};

