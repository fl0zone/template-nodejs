import axios from "axios";
import cron from "node-cron";

export class CronJobs {
  static startAllJobs() {
    // this.jobGermanyVisaCheck();
    this.logHelloWorld();
    // You can add and start other cron jobs here, e.g., `this.otherJobMethod();`
  }

  static jobGermanyVisaCheck() {
    cron.schedule("*/20 * * * *", async () => {
      try {
        const response = await axios.get("http://localhost:3000/orders");

        if (
          response.data &&
          response.data.entries &&
          Array.isArray(response.data.entries)
        ) {
          const filteredOrders = response.data.entries.filter(
            (order) => order.product === "Germany Shengen Visa"
          );

          const sortedOrders = filteredOrders.sort((a, b) => {
            const daysA = parseInt(a.deadline.split(" ")[0], 10);
            const daysB = parseInt(b.deadline.split(" ")[0], 10);
            return daysA - daysB;
          });

          for (const order of sortedOrders) {
            const embassyResponse = await axios.get(
              "http://localhost:3000/germanyVisa/Appointment/embassy",
              {
                headers: {
                  "x-target-url": order.appointment_location,
                  "x-captcha-api-key": process.env.TWOCAPTCHA_API_KEY,
                },
              }
            );
            console.log(embassyResponse.data);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }

  static logHelloWorld() {
    cron.schedule("* * * * *", () => {
      console.log("hello world");
    });
  }

  // You can define other cron jobs as static methods below...
}
