const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Tournament schema
const TournamentSchema = new Schema({
    name: { type: String, required: true },
    game: { type: String, required: true },
    date: { type: Date, required: true },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], required: true }
});

// Create and export Tournament model
const Tournament = mongoose.model('Tournament', TournamentSchema);
module.exports = Tournament;
