const User = require('../models/users.model');

const httpStatusCode = require('../utils/httpStatusCode');

const asyncWrapper = require('../Middleware/asyncWrapper');

const appError = require('../utils/appError');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const generateJWT = require('../utils/generateJWT');

const getAllUsers = asyncWrapper(
  async (req, res) => {

    const query = req.query;

    const limit = query.limit || 10;
    const page = query.page || 1;

    const skip = (page - 1) * limit;

        const users = await User.find({}, { "__v": false, password: false }).limit(limit).skip(skip);

    res.status(200).json({
        status: httpStatusCode.SUCCESS, data: {
            users
        }
    });
});

const register = asyncWrapper(
    async (req, res, next) => {
        const { firstName, lastName, email, password, role } = req.body;

        const oldUser = await User.findOne({ email: email });
        if (oldUser) {
            const error = appError.create("this email is already exist",400,httpStatusCode.FAIL);
            return next(error);
        }

        const hashedPassword = await bcrypt.hash(password, 3);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            avatar:req.file.filename
        });

        const token = await generateJWT({ email: newUser.email, id: newUser._id, role: newUser.role });
        newUser.token = token;

        await newUser.save();

        res.status(201).json({
          status: httpStatusCode.SUCCESS,
          data: {
            newUser
          },
        });
    }
);

const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email && !password) {
        const error = appError.create("email and password are required", 400, httpStatusCode.FAIL);
        return next(error);
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        const error = appError.create("User not found",400,httpStatusCode.FAIL);
        return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (user && matchedPassword) {
        //login is successfully
        
        const token = await generateJWT({ email: user.email, id: user._id , role: user.role });
        
        res.status(200).json({
            status: httpStatusCode.SUCCESS,
            data: {
                token,
            },
        });
    } else {
        res.status(500).json({
            status: httpStatusCode.ERROR,
            data: null,
            message: "something wrong",
            code:500
        });
    }
})



module.exports = {
    getAllUsers,
    register,
    login
}