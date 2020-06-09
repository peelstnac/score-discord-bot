const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Leaderboard = require('./MongoDB/leaderboardSchema.js');
const PORT = 3000 //process.env.PORT;

app.listen(PORT, (err) => {
    console.log('listening to port ' + PORT);
    if(err) {
        console.log(err);
    }
});