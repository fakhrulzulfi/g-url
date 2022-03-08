const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Url = new Schema({
    short_url: {
        type: String,
        required: true,
        unique: true
    },
    long_url: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('urls', Url);
