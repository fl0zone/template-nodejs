import express from "express";
import puppeteer from "puppeteer";
const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.static("public"));

app.get("/scrape", async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.goto("https://traders.studio/");

    const result = await page.$eval(".brxe-post-title", (el) => el.innerText);

    res.json({ title: result });
  } catch (error) {
    res.status(500).send(`Error al extraer el contenido: ${error.toString()}`);
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
