import express, { json } from "express"
import dotenv from "dotenv"
import { connectDB } from "./lib/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"


dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(cookieParser())
app.use(json({limit:"10mb"}))
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))


app.use("/api/auth" , authRoutes)
app.use("/api/messages" , messageRoutes)


app.listen(PORT  , ()=>{
    console.log("Server running on port : " + PORT)
    console.log("http://localhost:"+PORT);
    connectDB();
})
