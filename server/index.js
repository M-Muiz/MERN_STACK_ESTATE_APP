import express from "express";
import mongoose from "./db/index.js";
import router from "./routes/index.js";
import cors from 'cors';
import cookieParser from "cookie-parser";


const app = express();
app.use(cors());
const PORT = process.env.PORT;



const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("db connected")
});


app.use(express.json());
app.use(cookieParser());
app.use('/api', router);


app.get("/", (req,res)=>{
  res.json("hello wrold")
})

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});