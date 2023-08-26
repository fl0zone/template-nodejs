import express from "express";
import puppeteer from "puppeteer";
import axios from "axios";

const app = express();
const PORT = process.env.PORT ?? 3000;

const TWOCAPTCHA_API_KEY = "YOUR_2CAPTCHA_API_KEY";
const XPATH_CAPTCHA_STYLE =
  "//form[@id='appointment_captcha_month']/div[1]/captcha[1]/div[1]";
const XPATH_TEXT_INPUT = "//input[@id='appointment_captcha_month_captchaText']";
const XPATH_SUBMIT_BUTTON =
  "//input[@id='appointment_captcha_month_appointment_showMonth']";

app.get("/scrape", async (req, res) => {
  const targetURL = req.headers["x-target-url"];

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
    const captchaSolution = await solveCaptcha(captchaImageBase64);

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
});

async function solveCaptcha(base64Image) {
  const API_ENDPOINT = "http://2captcha.com/in.php";
  const SOLUTION_ENDPOINT = "http://2captcha.com/res.php";

  const response = await axios.post(API_ENDPOINT, {
    key: TWOCAPTCHA_API_KEY,
    method: "base64",
    body: base64Image,
    json: 1,
  });

  if (response.data.status !== 1) {
    throw new Error(`Failed to submit captcha: ${response.data.request}`);
  }

  const requestId = response.data.request;

  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 5000));

    const solutionResponse = await axios.get(SOLUTION_ENDPOINT, {
      params: {
        key: TWOCAPTCHA_API_KEY,
        action: "get",
        id: requestId,
        json: 1,
      },
    });

    if (solutionResponse.data.status === 1) {
      return solutionResponse.data.request;
    }
  }

  throw new Error("Failed to solve captcha in time.");
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
