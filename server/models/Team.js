const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    startingBudget: { type: Number, required: true },
    remainingBudget: { type: Number, required: true },
    logoUrl: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('Team', teamSchema);


