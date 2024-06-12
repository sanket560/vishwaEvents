import dotenv from 'dotenv';
dotenv.config({
  path : './env'
})
import cors from 'cors';
import express from "express";
import authRoute from "./router/auth.router.js";
import contactRoute from "./router/contact.router.js"
import connectDB from "./database/db.js";
import errorMiddleware from './middleware/error.middleware.js';
import eventRoute from './router/event.router.js'
import applicationRoute from './router/application.router.js'
import emailRoute from './router/email.router.js'

const app = express();

const crosOptions = {
  origin : "*",
  methods : "GET , POST , PUT , DELETE , PATCH , HEAD",
  credentials : true
}
app.use(cors(crosOptions))

app.use(express.json());
app.use("/api/auth",authRoute);
app.use("/api/form",contactRoute);
app.use("/",eventRoute);
app.use("/application",applicationRoute)
app.use(errorMiddleware)
app.use("/rsvp",emailRoute)
const PORT = 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
  });
});

