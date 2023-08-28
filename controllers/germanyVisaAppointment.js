import puppeteer from "puppeteer";
import CaptchaSolver from "../models/CaptchaSolver.js";
import { Notifier } from "../models/Notifier.js";

const XPATH_CAPTCHA_STYLE =
  "//form[@id='appointment_captcha_month']/div[1]/captcha[1]/div[1]";
const XPATH_TEXT_INPUT = "//input[@id='appointment_captcha_month_captchaText']";
const XPATH_SUBMIT_BUTTON =
  "//input[@id='appointment_captcha_month_appointment_showMonth']";

export default class GermanyVisaAppointmentController {
  static async appointmentAvailability(req, res) {
    const targetURL = decodeURIComponent(req.headers["x-target-url"]);

    if (!targetURL) {
      return res
        .status(400)
        .json({ error: "The X-Target-URL header is required." });
    }

    const captchaApikey = decodeURIComponent(req.headers["x-captcha-api-key"]);
    if (!captchaApikey) {
      return res
        .status(400)
        .json({ error: "The x-captcha-api-key header is required." });
    }

    const puppeteerOptions = {
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };

    const proxy = req.headers["x-proxy-server"];
    if (proxy) {
      puppeteerOptions.args.push(`--proxy-server=${proxy}`);
    }

    let browser;
    let proxyErrorOccurred = false;

    try {
      browser = await puppeteer.launch(puppeteerOptions);

      const page = await browser.newPage();

      if (proxy) {
        page.on("requestfailed", (request) => {
          proxyErrorOccurred = true;
        });
      }

      await page.goto(targetURL);

      if (proxyErrorOccurred) {
        throw new Error(
          "Proxy used, but a request failed. Proxy might not be working."
        );
      }

      const captchaElements = await page.$x(XPATH_CAPTCHA_STYLE);
      if (!captchaElements || captchaElements.length === 0) {
        throw new Error("Captcha element not found.");
      }

      const backgroundImage = await page.evaluate(
        (el) => el.style.backgroundImage,
        captchaElements[0]
      );
      const base64Match = backgroundImage.match(
        /url\("data:image\/\w+;base64,([^"]+)"\)/
      );
      if (!base64Match) {
        throw new Error("Failed to extract CAPTCHA image.");
      }

      const captchaImageBase64 = base64Match[1];
      const captchaSolution = await CaptchaSolver.solveCaptchaBase64(
        captchaImageBase64,
        captchaApikey
      );

      const textInputElements = await page.$x(XPATH_TEXT_INPUT);
      if (!textInputElements || textInputElements.length === 0) {
        throw new Error("Text input element not found.");
      }
      await textInputElements[0].type(captchaSolution);

      const submitButtonElements = await page.$x(XPATH_SUBMIT_BUTTON);
      if (!submitButtonElements || submitButtonElements.length === 0) {
        throw new Error("Submit button not found.");
      }

      const navigationPromise = page.waitForNavigation({
        waitUntil: "networkidle0",
      });
      await submitButtonElements[0].click();
      await navigationPromise;

      const h4Elements = await page.$$("h4");
      if (h4Elements.length > 0) {
        const nextAppointmentDate = await page.$eval(
          "h4",
          (el) => el.innerText
        );

        const channel = "#germany-appointment-availability";
        const text = `¡Hay una cita disponible \nFecha: ${nextAppointmentDate}\nURL: ${targetURL}`;
        const webhookUrl =
          "https://hooks.slack.com/services/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";
        const username = "Germany Appointment Alert!";
        const iconEmoji = ":de:";

        await Notifier.sendToSlack(
          channel,
          text,
          webhookUrl,
          username,
          iconEmoji
        );

        res.json({ title: nextAppointmentDate });
      } else {
        res.json({ message: "No hay citas disponibles" });
      }
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    } finally {
      if (browser) await browser.close();
    }
  }
}
