import express from "express";
import GermanyVisaController from "./controllers/GermanyVisaController.js";
import DataController from "./controllers/DataController.js";
import { CronJobs } from "./controllers/CronJobs.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get(
  "/germanyVisa/Appointment/embassy",
  GermanyVisaController.embassyAppointmentAvailability
);

app.get("/orders", DataController.sample);

CronJobs.startAllJobs();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
