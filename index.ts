import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/calendarEvents.js';
import { connectDB } from './database/config.js';
// load environment variables
dotenv.config();

// initialize express app
const app: Express = express();

// connect to database with mongoose
 connectDB();

// cors
app.use(cors());

// public directory
app.use(express.static('public'));

// parse json
app.use(express.json());

// routes of authentication     
app.use("/api/auth", authRoutes);

// routes of calendar events
app.use("/api/events", eventsRoutes);


// start
app.listen( process.env.PORT, () => {
    console.log(`server si running on port ${ process.env.PORT}`);
});
