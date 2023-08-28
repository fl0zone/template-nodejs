import { google } from "googleapis";
import fs from "fs";

const CLIENT_SECRET_PATH = "path_to_credentials.json";

export default class DataModel {
  static async fetchData(sheetId, range) {
    const content = fs.readFileSync(CLIENT_SECRET_PATH);
    const auth = await DataModel.authorize(JSON.parse(content));
    return await DataModel.getData(auth, sheetId, range);
  }

  static async authorize(credentials) {
    const { client_email, private_key } = credentials;

    const client = new google.auth.JWT(client_email, null, private_key, [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
    ]);

    return client;
  }

  static async getData(auth, sheetId, range) {
    const sheets = google.sheets({ version: "v4", auth });
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: range,
      });
      const rows = response.data.values;
      const headers = rows.shift();

      return rows.map((row) => {
        let obj = {};
        headers.forEach((header, index) => {
          obj[header.toLowerCase()] = row[index];
        });
        return obj;
      });
    } catch (error) {
      throw new Error("Failed to access the provided Google Sheet.");
    }
  }
}
