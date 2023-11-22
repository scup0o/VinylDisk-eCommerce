const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    staffId:{
        type: String,
        required: true,
        unique: true,
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

    role: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee',
    },

    img:{
        type: String,
        default: 'user-img.jpg'
    }

});

const Staff = mongoose.model('staff', staffSchema);

module.exports = Staff;