const mongoose = require('mongoose');

const discountCodeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    value:{
        type: Number,
    },

    description:{
        type: String,
    },

    startDate: {type: Date},

    expirationDate: {type: Date},

    active: {type: Boolean}

});

const discountCode = mongoose.model('discountCode', discountCodeSchema);

module.exports = discountCode;