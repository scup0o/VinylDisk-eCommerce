const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        //required: true,
        unique: true,
    },
    
    price: {
        type: Number,
        //required: true,
    },

    description: {
        type: String
    },

    genreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "genres",
    },

    quantity: {
        type: Number,
        //required: true
    },

    image: [{
        type: String
    }],

    discount: {
        type: Number
    },

    tracklist:[String],

    newRelease: {
        type: Boolean
    },

    artistId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "artist",
    }

});

const Product = mongoose.model('product', productSchema);

module.exports = Product;