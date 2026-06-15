import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// importing the connectDB method
import connectDB from "./config/db.js";

import roomRoute from "./routes/room.routes.js";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL, // Render se frontend URL
  "https://*.vercel.app", // Vercel domains
].filter(Boolean);

dotenv.config();
console.log(process.env.MONGODB_URI);
connectDB();

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.some(
          (allowed) =>
            allowed === origin ||
            (allowed.includes("*") &&
              origin.includes(allowed.replace("*", ""))),
        )
      ) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin);
        callback(null, true); //  Allow all in development
        // callback(new Error('Not allowed by CORS')); // Uncomment in production
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

// just for the checking the route;
app.use("/api/rooms", roomRoute);
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
