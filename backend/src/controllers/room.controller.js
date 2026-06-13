import BookingSlot from "../models/bookigSlot.model.js";
import Room from "../models/room.model.js";
import { generateTimeSlots } from "../utils/generateSlots.js";
import dayjs from "dayjs";

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

// this controller for the room avalilablity;

export const roomAvaliablity = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const startOfDay = dayjs(date).startOf("day").toDate();
    const endOfDay = dayjs(date).endOf("day").toDate();

    const allSlots = generateTimeSlots();
    console.log(allSlots);

    // finding the id of the room and getting the info;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "room not found",
      });
    }

    const bookedSlots = await BookingSlot.find({
      roomId: id,
      slotStart: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    return res.status(200).json({
      success: true,
      room,
      bookedSlots,
      slots: allSlots,
    });
  } catch (err) {
    console.log(`error in the room avaliablity method ${err.message}`);
    res.status(500).json({
      success: false,
      message: "failed to fetch details",
    });
  }
};
