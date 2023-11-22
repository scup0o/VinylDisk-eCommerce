const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},

    product: [{
        productId: {type: mongoose.Schema.Types.ObjectId, ref: 'product'},
        quantity: {type: Number} || 0
    }],
    /*
    totalPrice: {type: Number},*/

    totalQuantity: {type: Number}

});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;