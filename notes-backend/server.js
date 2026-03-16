import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import {connectDB} from "./config/db.js";
import noteRoutes from "./routes/noteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "passport";
import "./config/passport.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();
connectDB();
app.set("trust proxy",1);
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(passport.initialize());
app.use(helmet());

const authLimiter = rateLimit({
  windowMs: 15*60*1000,
  max: 10,
  message: {
    message: "Too many request. Please try again later"
  }
});

app.use("/api/notes", noteRoutes);
app.use("/api/auth",authLimiter, authRoutes);

app.get('/', (req,res)=>{
    res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});