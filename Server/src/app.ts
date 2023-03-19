import express, { Application } from "express";
import useRoute from "./Routes/useRoute";
import connectDB from "./config/db";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import cors from "cors";

const app: Application = express();
dotenv.config();

app.use(express.json());
connectDB();
app.use(cors());
app.use(useRoute);

let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Express started ${port}`));
