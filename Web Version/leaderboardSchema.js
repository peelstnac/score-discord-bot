const mongoose = require('mongoose');
var leaderboardSchema = new mongoose.Schema({
    _id: String,
    name: String,
    val: [[String, Number]]
});
module.exports = mongoose.model('Leaderboard', leaderboardSchema);