const config = require("../../../config.json");
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    discriminator: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    staff: {
        type: Boolean,
        required: true,
        default: false
    },
    developer: {
        type: Boolean,
        required: true,
        default: false
    },
    flags: {
        type: Number,
        required: true,
    },
    token: {
        type: String,
        required: true
    }
});

module.exports = model("user", userSchema);
