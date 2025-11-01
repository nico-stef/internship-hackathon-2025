import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./connections/mongoDb.js"
import reviewRoutes from "./routes/review.routes.js";
import userRoutes from "./routes/user.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());
app.use(cookieParser());

// CORS middleware
app.use(cors({
    origin: "http://localhost:5173", // frontend-ul tău
    credentials: true // dacă folosești cookie-uri
}));

app.use(reviewRoutes);
app.use(userRoutes);

//------conectare la MongoDb----------
connectDB();

app.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
