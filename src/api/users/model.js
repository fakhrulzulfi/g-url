const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    token: {
        type: String,
        required: true
    },
    urls: [{
        type: Schema.Types.ObjectId,
        ref: 'urls'
    }]
}, { timestamps: true });

module.exports = mongoose.model('users', User);
