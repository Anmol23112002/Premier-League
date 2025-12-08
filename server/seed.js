require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Team = require('./models/Team');
const PlayerSet = require('./models/PlayerSet');
const Player = require('./models/Player');

async function seed() {
  await connectDB();

  try {
    // 1. Clear the Database
    await Team.deleteMany({});
    await PlayerSet.deleteMany({});
    await Player.deleteMany({});

    console.log("Cleared old data...");

    // 2. Create Teams
    const teams = await Team.insertMany([
      { name: 'Hilltop Hunters', startingBudget: 10000, remainingBudget: 10000, logoUrl: "/teams/hilltop.png" },
      { name: 'Kiriburu Kings', startingBudget: 10000, remainingBudget: 10000, logoUrl: "/teams/kiriburu.png" },
      { name: 'NewColony Ninjas', startingBudget: 10000, remainingBudget: 10000, logoUrl: "/teams/newcolony.png" },
      { name: 'Murgapara Maharajas', startingBudget: 10000, remainingBudget: 10000, logoUrl: "/teams/murgapara.png" },
      { name: 'Saranda Sultans', startingBudget: 10000, remainingBudget: 10000, logoUrl: "/teams/saranda.png" },
      { name: 'Prospecting Pirates', startingBudget: 10000, remainingBudget: 10000, logoUrl: "/teams/prospecting.png" },
      { name: 'Township Titans', startingBudget: 10000, remainingBudget: 10000, logoUrl: "/teams/township.png" },
      { name: 'Sunset Strikers', startingBudget: 10000, remainingBudget: 10000, logoUrl: "/teams/sunset.png" }
    ]);

    // 3. Create Sets
    const sets = await PlayerSet.insertMany([
      { name: 'Marquee Set', defaultBasePrice: 400, biddingIncrement: 50 },
      { name: 'Batsmen Set-1', defaultBasePrice: 400, biddingIncrement: 50 },
      { name: 'Batsmen Set-2', defaultBasePrice: 400, biddingIncrement: 50 },
      { name: 'Bowlers Set-1', defaultBasePrice: 400, biddingIncrement: 50 },
      { name: 'Bowlers Set-2', defaultBasePrice: 400, biddingIncrement: 50 },
      { name: 'All-rounders Set-1', defaultBasePrice: 400, biddingIncrement: 50 },
      { name: 'All-rounders Set-2', defaultBasePrice: 400, biddingIncrement: 50 },
      { name: 'Unsold Players', defaultBasePrice: 0, biddingIncrement: 0 }
    ]);

    // 4. Find IDs (The Correct Way)
    const marquee = sets.find(s => s.name === 'Marquee Set');
    const bat1 = sets.find(s => s.name === 'Batsmen Set-1');
    const bat2 = sets.find(s => s.name === 'Batsmen Set-2');
    const bowl1 = sets.find(s => s.name === 'Bowlers Set-1');
    const bowl2 = sets.find(s => s.name === 'Bowlers Set-2');
    const ar1 = sets.find(s => s.name === 'All-rounders Set-1');
    const ar2 = sets.find(s => s.name === 'All-rounders Set-2');

    const placeholderPhoto = 'https://via.placeholder.com/300x380.png?text=MPL+Player';

    // 5. Insert Players linked to Specific Sets
    await Player.insertMany([
      {
        name: 'Rohan Singh',
        age: 26,
        battingStyle: 'Right-hand Bat',
        bowlingStyle: 'Right-arm Medium',
        role: 'All-rounder',
        photoUrl: placeholderPhoto,
        basePrice: 400,
        playerSet: marquee._id
      },
      {
        name: 'Amit Verma',
        age: 24,
        battingStyle: 'Left-hand Bat',
        bowlingStyle: 'Left-arm Spin',
        role: 'All-rounder',
        photoUrl: "/players/Amit.jpg",
        basePrice: 400,
        playerSet: marquee._id
      },
      {
        name: 'Karan Das',
        age: 27,
        battingStyle: 'Right-hand Bat',
        bowlingStyle: 'Right-arm Fast',
        role: 'Bowler',
        photoUrl: placeholderPhoto,
        basePrice: 400,
        playerSet: marquee._id
      },
      {
        name: 'Anmol Pandey',
        age: 23,
        battingStyle: 'Right-hand Bat',
        bowlingStyle: 'None',
        role: 'Batsman',
        photoUrl: "/players/Anmol.jpg",
        basePrice: 400,
        playerSet: bat1._id  // Linked to Batsmen Set-1
      },
      {
        name: 'Nikhil Rao',
        age: 23,
        battingStyle: 'Left-hand Bat',
        bowlingStyle: 'Right-arm Offbreak',
        role: 'Batsman',
        photoUrl: placeholderPhoto,
        basePrice: 400,
        playerSet: bat2._id  // Linked to Batsmen Set-2
      },
      {
        name: 'Prashant Yadav',
        age: 25,
        battingStyle: 'Right-hand Bat',
        bowlingStyle: 'Right-arm Fast-Medium',
        role: 'Bowler',
        photoUrl: placeholderPhoto,
        basePrice: 400,
        playerSet: bowl1._id // Linked to Bowlers Set-1
      },
      {
        name: 'Deepak Sharma',
        age: 28,
        battingStyle: 'Left-hand Bat',
        bowlingStyle: 'Left-arm Orthodox',
        role: 'Bowler',
        photoUrl: placeholderPhoto,
        basePrice: 400,
        playerSet: bowl2._id // Linked to Bowlers Set-2
      },
      {
        name: 'Vikas Kumar',
        age: 24,
        battingStyle: 'Right-hand Bat',
        bowlingStyle: 'Right-arm Medium',
        role: 'All-rounder',
        photoUrl: placeholderPhoto,
        basePrice: 400,
        playerSet: ar1._id   // Linked to All-Rounders Set-1
      },
      {
        name: 'Sanjay Jha',
        age: 29,
        battingStyle: 'Left-hand Bat',
        bowlingStyle: 'Right-arm Legbreak',
        role: 'All-rounder',
        photoUrl: placeholderPhoto,
        basePrice: 400,
        playerSet: ar2._id   // Linked to All-Rounders Set-2
      }
    ]);

    console.log('✅ Seed data inserted successfully!');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();