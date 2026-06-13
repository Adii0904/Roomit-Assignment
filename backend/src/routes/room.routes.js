import express from "express";
import { getAllRooms } from "../controllers/room.controller.js";

const router = express.Router();

// body  of the route;

router.get("/", getAllRooms);
export default router;
