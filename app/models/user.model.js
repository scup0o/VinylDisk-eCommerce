const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        minLength: 6,
    },

    phone: {
        type: String,
        required: true,
        minLength:10,
    },

    name: {
        type: String,
    },

    address: {
        type: String,
    },

    verify: {
        type: Boolean,
        default: false
    },

    verifyToken:{
        type: String
    },

    img:{
        type: String,
        default: 'user-img.jpg'
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;