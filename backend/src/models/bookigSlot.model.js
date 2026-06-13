import mongoose from "mongoose";

const bookingSlotSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    slotStart: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/*
  Assignment's Most Important Safeguard
*/

bookingSlotSchema.index(
  {
    roomId: 1,
    slotStart: 1,
  },
  {
    unique: true,
  },
);

const BookingSlot = mongoose.model("BookingSlot", bookingSlotSchema);

export default BookingSlot;
