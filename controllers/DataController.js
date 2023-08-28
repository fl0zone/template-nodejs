import DataModel from "../models/DataFetcher.js";

export default class DataController {
  static async fetchOrders(req, res) {
    const sheetId = req.headers["x-sheetid"];
    const range = req.headers["x-range"] || "A:Z";

    if (!sheetId) {
      return res.status(400).send("Sheet ID is required in the headers.");
    }

    try {
      const data = await DataModel.fetchData(sheetId, range);
      res.json(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      res.status(500).send(error.message);
    }
  }
}
