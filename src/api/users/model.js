const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const HASH_ROUND = 10;


const UserSchema = new Schema({
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
}, { timestamps: true });

UserSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next();
});

module.exports = mongoose.model('User', UserSchema);
