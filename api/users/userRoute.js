'use strict';
/*jslint node: true */
/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
let userDao = require("./userDao");
const bodyParser = require('body-parser');

router.use(bodyParser.json({ type: 'application/json' }));

const createbook = (req, res) => {

    console.log('Received user register request');

        let retVal;
        let user={
            user_name: req.body.user.user_name,
            user_email: req.body.user.user_email,
            password: req.body.user.password,
            create_ts: new Date().toISOString(),
            update_ts: new Date().toISOString()
        } 
        userDao.createuser(user, (err) => {
            if (err) {
                console.error("Error reported while creating user" + err.message);
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

