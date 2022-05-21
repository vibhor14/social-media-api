const mongoose = require('mongoose');
const Comments = require("./Comments");

const postSchema = new mongoose.Schema({
    userID: String,
    title: String,
    description: String,
    likes: {
        type: Number,
        default: 0
    },
    unlikes: {
        type: Number,
        default: 0
    },
    time: Date,
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "Comments"
     }]
});

module.exports = mongoose.model("Post", postSchema);