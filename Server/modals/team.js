var mongoose = require('mongoose');

var team =  mongoose.Schema({
    team_name: {
        type: String,
        required: true,
    },
    wins: {
        type: Number,
        default: 0,
    },
    losses: {
        type: Number,
        default: 0,
    },
    ties: {
        type: Number,
        default: 0,
    },
    score: {
        type: Number,
        default:0,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: null
    }
});

var Team = mongoose.model('Team', team);
module.exports = Team;
