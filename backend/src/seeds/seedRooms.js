// in this file i am insering the rooms;

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Room from "../models/room.model.js";

// creating the Rooms

dotenv.config();

const rooms = [
  {
    name: "Conference Room A",
    floor: "1st Floor",
    capacity: 8,
    bufferMinutes: 10,
  },
  {
    name: "Conference Room B",
    floor: "2nd Floor",
    capacity: 12,
    bufferMinutes: 15,
  },
  {
    name: "Conference Room C",
    floor: "3rd Floor",
    capacity: 20,
    bufferMinutes: 10,
  },
  {
    name: "Conference Room D",
    floor: "4th Floor",
    capacity: 6,
    bufferMinutes: 5,
  },
];

const seedRooms = async () => {
  try {
    await connectDB();

    await Room.deleteMany();

    // now i am inserring the rooms;

    const insertedRomm = await Room.insertMany(rooms);

    if (insertedRomm) {
      console.log("room inserted successfully");
    }

    console.log("all done");
    process.exit(0);
  } catch (err) {
    console.log(`error in inserting the seed rooms value ${err.message}`);
  }
};

seedRooms();
