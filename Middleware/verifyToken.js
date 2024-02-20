const jwt = require('jsonwebtoken');

const httpStatusCode = require('../utils/httpStatusCode');

const appError = require('../utils/appError');

const verifyToken = (req, res, next) => {
    let authHeader =
        req.headers["Authorization"] || req.headers["authorization"];
    
    if (!authHeader) {
        const error = appError.create("token is required", 401, httpStatusCode.ERROR);
        return next(error);
    }
    
    const token = authHeader.split(" ")[1];

    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        req.currentUser = currentUser;
        next(); 
    } catch {
        const error = appError.create("token is expired",500,httpStatusCode.ERROR);
        return next(error);
    }

}

module.exports = verifyToken;