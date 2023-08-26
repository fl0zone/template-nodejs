import puppeteer from "puppeteer";
import CaptchaSolverModel from "./captchaSolverModel.js";

const XPATH_CAPTCHA_STYLE =
  "//form[@id='appointment_captcha_month']/div[1]/captcha[1]/div[1]";
const XPATH_TEXT_INPUT = "//input[@id='appointment_captcha_month_captchaText']";
const XPATH_SUBMIT_BUTTON =
  "//input[@id='appointment_captcha_month_appointment_showMonth']";

export default class CaptchaController {
  static async handleCaptchaRequest(req, res) {
    const targetURL = decodeURIComponent(req.headers["x-target-url"]);

    if (!targetURL) {
      return res
        .status(400)
        .json({ error: "The X-Target-URL header is required." });
    }

    let browser;

    try {
      browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.goto(targetURL);

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
      const captchaSolution = await CaptchaSolverModel.solveCaptcha(
        base64Image
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
        const h4Content = await page.$eval("h4", (el) => el.innerText);
        res.json({ title: h4Content });
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
