import express from "express";
import {
  createBooking,
  getAllRooms,
  roomAvaliablity,
  getUserBookings,
  cancelBooking,
  rescheduleBooking,
} from "../controllers/room.controller.js";

const router = express.Router();

// body  of the route;

router.get("/", getAllRooms);
router.get("/:id/availability", roomAvaliablity);
router.post("/bookings", createBooking);
router.get("/bookings", getUserBookings);
router.patch("/bookings/:id/cancel", cancelBooking);
router.patch("/bookings/:id/reschedule", rescheduleBooking);
export default router;
