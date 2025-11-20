import express from 'express';
import dotenv from 'dotenv';
import connnectDB from './db/database.js';
import router from './Routes/index.js';
import todoRoutes from "./Routes/todoRoutes.js"
import cookieParser from 'cookie-parser';

dotenv.config()
const app = express();
connnectDB()

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use("/", router);
app.use("/api", todoRoutes)

app.listen(PORT,() => {
    console.log(`Server is Running on ${PORT}`);
});