import axios from "axios";

const TWOCAPTCHA_API_KEY = process.env.TWOCAPTCHA_API_KEY;

export default class CaptchaSolverModel {
  static async solveCaptcha(base64Image) {
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
}
