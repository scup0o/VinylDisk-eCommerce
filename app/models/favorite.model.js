const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},

    productId: [{type: mongoose.Schema.Types.ObjectId, ref: 'product'}],

});

const Favorite = mongoose.model('favorite', favoriteSchema);

module.exports = Favorite;