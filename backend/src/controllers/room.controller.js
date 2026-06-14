import BookingSlot from "../models/bookigSlot.model.js";
import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import { generateBookingSlots } from "../utils/generateBookingsSlot.js";
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

    const availability = allSlots.map((slot) => {
      const isBooked = bookedSlots.some((bookedSlot) => {
        const bookedTime = dayjs(bookedSlot.slotStart).format("HH:mm");
        return bookedTime === slot;
      });

      return {
        time: slot,
        available: !isBooked,
      };
    });

    return res.status(200).json({
      success: true,
      room,
      availability,
    });
  } catch (err) {
    console.log(`error in the room avaliablity method ${err.message}`);
    res.status(500).json({
      success: false,
      message: "failed to fetch details",
    });
  }
};

// this is the post api for the room booking creation;

export const createBooking = async (req, res) => {
  try {
    const { roomId, title, name, email, date, startTime, endTime } = req.body;

    // validation

    if (
      !roomId ||
      !title ||
      !name ||
      !email ||
      !date ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // room exists?

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // generate slots

    const slots = generateBookingSlots(date, startTime, endTime);

    const existingBookings = await Booking.find({
      roomId,
      status: "confirmed",
      startDateTime: {
        $gte: dayjs(date).startOf("day").toDate(),
        $lt: dayjs(date).endOf("day").toDate(),
      },
    });

    // booking start/end datetime

    const startDateTime = slots[0];

    const endDateTime = new Date(`${date}T${endTime}:00`);

    // buffer  time system

    // BUFFER VALIDATION

    for (const existing of existingBookings) {
      const blockedUntil = new Date(
        existing.endDateTime.getTime() + room.bufferMinutes * 60 * 1000,
      );

      if (
        startDateTime >= existing.endDateTime &&
        startDateTime < blockedUntil
      ) {
        return res.status(409).json({
          success: false,
          message: "Room is in buffer period after previous booking",
        });
      }
    }

    // create booking

    const booking = await Booking.create({
      roomId,
      title,
      bookedBy: {
        name,
        email,
      },
      startDateTime,
      endDateTime,
    });

    // create slot documents

    const slotDocs = slots.map((slot) => ({
      roomId,
      bookingId: booking._id,
      slotStart: slot,
    }));

    try {
      await BookingSlot.insertMany(slotDocs, {
        ordered: true,
      });
    } catch (error) {
      // cleanup orphan booking

      await Booking.findByIdAndDelete(booking._id);

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Slot already booked",
        });
      }

      throw error;
    }

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.log(`Error in createBooking controller: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Booking creation failed",
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const bookings = await Booking.find({
      "bookedBy.email": email.toLowerCase(),
    })
      .populate("roomId")
      .sort({ startDateTime: 1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    const now = new Date();

    const bookingStart = new Date(booking.startDateTime);

    const diffHours = (bookingStart - now) / (1000 * 60 * 60);

    let status;

    if (diffHours >= 2) {
      status = "cancelled-refundable";
    } else {
      status = "cancelled-non-refundable";
    }

    booking.status = status;

    await booking.save();

    // Free all slots

    await BookingSlot.deleteMany({
      bookingId: booking._id,
    });

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      refundStatus: status,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Cancellation failed",
    });
  }
};

export const rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const { date, startTime, endTime, version } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Optimistic Locking

    if (booking.version !== version) {
      return res.status(409).json({
        success: false,
        message: "Booking changed. Please refresh.",
      });
    }

    const slots = generateBookingSlots(date, startTime, endTime);

    const startDateTime = slots[0];

    const endDateTime = new Date(`${date}T${endTime}:00`);

    // Purane slots hatao

    await BookingSlot.deleteMany({
      bookingId: booking._id,
    });

    const slotDocs = slots.map((slot) => ({
      roomId: booking.roomId,
      bookingId: booking._id,
      slotStart: slot,
    }));

    try {
      await BookingSlot.insertMany(slotDocs, {
        ordered: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "New slot already booked",
        });
      }

      throw error;
    }

    booking.startDateTime = startDateTime;

    booking.endDateTime = endDateTime;

    booking.version += 1;

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking rescheduled successfully",
      booking,
    });
  } catch (error) {
    console.log(`Error in rescheduleBooking: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Reschedule failed",
    });
  }
};
