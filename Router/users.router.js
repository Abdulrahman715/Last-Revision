const express = require("express");

const router = express.Router();

const controllerUsers = require('../controller/users.controller');

const verifyToken = require('../Middleware/verifyToken');

const multer = require('multer');
const appError = require("../utils/appError");
const httpStatusCode = require("../utils/httpStatusCode");

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user - ${Date.now()}.${ext}`;
        cb(null, fileName);
    }
});

const fileFilter = function (req, file, cb) {
    const imageUpload = file.mimetype.split('/')[0];

    if (imageUpload === 'image') {
        return cb(null, true);
    } else {
        return cb(
          appError.create("must be upload image ", 401, httpStatusCode.ERROR),
          false
        );
    }
}

const upload = multer({ storage: diskStorage ,fileFilter});

router.route('/')
    .get(verifyToken, controllerUsers.getAllUsers);

router.route('/register')
    .post(upload.single('avatar'), controllerUsers.register);

router.route('/login')
    .post( controllerUsers.login);


module.exports = router; 