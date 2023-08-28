import axios from "axios";

export class Notifier {
  static async sendToSlack(
    channel,
    text,
    webhookUrl,
    username = "webhookbot",
    iconEmoji = ":robot_face:"
  ) {
    try {
      const payload = {
        channel,
        username,
        text,
        icon_emoji: iconEmoji,
      };

      const response = await axios.post(webhookUrl, payload);

      if (response.status === 200) {
        console.log("Notification sent successfully.");
      } else {
        console.error("Failed to send notification:", response.statusText);
        return;
      }
    } catch (error) {
      console.error("Error sending notification:", error.message);
    }
  }
}
