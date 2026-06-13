import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    bookedBy: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
    },

    startDateTime: {
      type: Date,
      required: true,
    },

    endDateTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled-refundable", "cancelled-non-refundable"],
      default: "confirmed",
    },

    // Extended Requirement 4.4
    version: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
