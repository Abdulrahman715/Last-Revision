const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utils/user.roles');

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'this email is not satisfied']
    },
    password: {
        type: String,
        required: true,
        min: [8, 'Too few numbers'],
        max: [16, 'large password']
    },
    token: {
        type: String,
    },
    role: {
        type: String,
        enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANAGER],
        default: userRoles.USER
    },
    avatar: {
        type: String,
        default:'uploads/image.jpg'
    }
});

module.exports = mongoose.model('User', userSchema);