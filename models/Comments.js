const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId
     },
    postID: String,
    body: String
});

module.exports = mongoose.model("Comments",commentsSchema);