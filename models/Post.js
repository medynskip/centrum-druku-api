const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    added: {
        type: Date,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    content: {
        type: String,
        required: false
    },
    active: {
        type: Boolean,
        required: true
    }

})

module.exports = mongoose.model('Posts', PostSchema);