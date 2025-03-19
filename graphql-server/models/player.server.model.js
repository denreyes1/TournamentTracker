const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Player schema
const PlayerSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ranking: { type: Number, default: 0 },
    tournaments: [{ type: Schema.Types.ObjectId, ref: 'Tournament' }]
});

// Create and export Player model
const Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;
