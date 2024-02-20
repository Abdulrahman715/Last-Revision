const appError = require("../utils/appError");
const httpStatusCode = require("../utils/httpStatusCode");

module.exports = (...roles)=>{
    return (req, res, next) => {
        if (!roles.includes(req.currentUser.role)) {
            return next(appError.create("this role not authorized", 401, httpStatusCode.FAIL));
        }
        next();
    }
}