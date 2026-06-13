import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// importing the connectDB method
import connectDB from "./config/db.js";

dotenv.config();
console.log(process.env.MONGODB_URI);
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// just for the checking the route;

app.get("/", (req, res) => {
  console.log("api hitted");
  res.status(200).json({
    success: true,
    ok: true,
    message: "all good to go",
  });
});

const port = process.env.PORT || 5000;

// starting the server here;
app.listen(port, () => {
  console.log("server is started successfully");
});
