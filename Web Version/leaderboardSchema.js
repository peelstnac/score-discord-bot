const mongoose = require('mongoose');
var leaderboardSchema = new mongoose.Schema({
    name: String,
    val: [[String, Number]]
});
module.exports = mongoose.model('Leaderboard', leaderboardSchema);