const mongoose = require("mongoose");
const postSchema = require("./Post").schema;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userID: Number,
    following: [String],
    followers: [String]
    // posts: [postSchema]
});

module.exports = mongoose.model("User", UserSchema);