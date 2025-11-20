import express from 'express';
import dotenv from 'dotenv';
import connnectDB from './db/database.js';
import router from './Routes/index.js';

dotenv.config()
const app = express();
connnectDB()

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use("/", router)

app.listen(PORT,() => {
    console.log(`Server is Running on ${PORT}`);
});