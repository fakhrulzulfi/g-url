const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UrlSchema = new Schema({
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
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Url', UrlSchema);
