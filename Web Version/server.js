const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Leaderboard = require('./leaderboardSchema.js');

const URI = process.env.URI
const PORT = process.env.PORT;

function init() {
    var leaderboard = new Leaderboard({
        name: 'leaderboard',
        val: []
    });
    leaderboard.save((err) => {
        console.log('saved leaderboard');
        if(err) {
            console.log(err);
        }
    })
}

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', (err) => {
    console.log(err);
});
db.on('open', () => {
    console.log('connected to MongoDB');
    //init();
});

app.listen(PORT, (err) => {
    console.log('listening to port ' + PORT);
    if(err) {
        console.log(err);
    }
});