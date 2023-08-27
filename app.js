import express from "express";
import germanyVisaAppointmentController from "./controllers/germanyVisaAppointment.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get("/scrape", germanyVisaAppointmentController.appointmentAvailability);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
