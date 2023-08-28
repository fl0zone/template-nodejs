import express from "express";
import GermanyVisaAppointmentController from "./controllers/germanyVisaAppointment.js";
import DataController from "./controllers/DataController.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get(
  "/germanyVisa/Appointment/embassy",
  GermanyVisaAppointmentController.appointmentAvailability
);

app.get("/orders", DataController.fetchOrders);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
