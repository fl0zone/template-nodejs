import DataModel from "../services/DataFetcher.js";

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

  static sample(req, res) {
    const data = {
      entries: [
        {
          id: 1429,
          classification: "Travel Document",
          product: "Germany Shengen Visa",
          last_updated: "5 minutes",
          status: "info needed",
          delivery: "standard",
          deadline: "3 days",
          arrival_date: "01-02-1998",
          appointment_location:
            "https://service2.diplo.de/rktermin/extern/appointment_showForm.do?locationCode=jaun&realmId=271&categoryId=1323",
        },
        {
          id: 1430,
          classification: "Travel Document",
          product: "France Shengen Visa",
          last_updated: "10 minutes",
          status: "processing",
          delivery: "express",
          deadline: "2 days",
          arrival_date: "03-02-1998",
          appointment_location:
            "https://service2.diplo.de/rktermin/extern/appointment_showMonth.do?locationCode=abid&realmId=734&categoryId=1287",
        },
        {
          id: 1431,
          classification: "Travel Document",
          product: "Spain Shengen Visa",
          last_updated: "2 hours",
          status: "completed",
          delivery: "standard",
          deadline: "5 days",
          arrival_date: "05-02-1998",
          appointment_location:
            "https://service2.diplo.de/rktermin/extern/appointment_showMonth.do?locationCode=bern&realmId=198&categoryId=326",
        },
      ],
    };
    res.json(data);
  }
}
