import express from "express";
import CaptchaController from "./captchaController.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get("/scrape", CaptchaController.handleCaptchaRequest);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
