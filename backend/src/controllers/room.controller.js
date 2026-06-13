import Room from "../models/room.model.js";

export const getAllRooms = async (req, res) => {
  try {
    // fiinding the rooms avl;

    const rooms = await Room.find();

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (err) {
    console.log(`error in fetching the room details`);
    res.status(500).json({
      success: false,
      message: "failed to fetch the room details",
    });
  }
};
