const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    battingStyle: { type: String },
    bowlingStyle: { type: String },
    role: { type: String },
    photoUrl: { type: String },
    basePrice: { type: Number, required: true },
    playerSet: { type: mongoose.Schema.Types.ObjectId, ref: 'PlayerSet' },
    auctionStatus: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Sold', 'Unsold'],
      default: 'Not Started'
    },
    soldPrice: { type: Number },
    soldToTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('Player', playerSchema);


