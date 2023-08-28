import express from "express";
import GermanyVisaController from "./controllers/GermanyVisaController.js";
import DataController from "./controllers/DataController.js";
import { Notifier } from "./models/Notifier.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get(
  "/germanyVisa/Appointment/embassy",
  GermanyVisaController.embassyAppointmentAvailability
);

app.get("/orders", DataController.fetchOrders);

app.get("/test", async (req, res) => {
  const nextAppointmentDate = "YOUR_DATE_HERE"; // Replace with actual data source
  const targetURL = "YOUR_URL_HERE"; // Replace with actual data source
  const SLACK_WEBHOOK = "YOUR_SLACK_WEBHOOK_URL"; // Environment variable or config

  const channel = "#germany-appointment-availability";
  const text = `¡Hay una cita disponible \nFecha: ${nextAppointmentDate}\nURL: ${targetURL}`;
  const webhookUrl =
    "https://hooks.slack.com/services/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";
  const username = "Germany Appointment Alert!";
  const iconEmoji = ":de:";

  try {
    await Notifier.sendToSlack(channel, text, webhookUrl, username, iconEmoji);
    res.json({ status: "success" });
  } catch (error) {
    console.error("Error sending to Slack:", error);
    res.json({ status: "error", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
