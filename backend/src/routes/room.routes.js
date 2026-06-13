import express from "express";
import {
  getAllRooms,
  roomAvaliablity,
} from "../controllers/room.controller.js";

const router = express.Router();

// body  of the route;

router.get("/", getAllRooms);
router.get("/:id/availability", roomAvaliablity);
export default router;
