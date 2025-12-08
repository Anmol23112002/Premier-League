const mongoose = require('mongoose');

const playerSetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    defaultBasePrice: { type: Number },
    biddingIncrement: { type: Number, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('PlayerSet', playerSetSchema);


