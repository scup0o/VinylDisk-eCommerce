const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    description:{
        type: String,
    },

    image:{
        type: String,
    }
});

const Genre = mongoose.model('genre', genreSchema);

module.exports = Genre;