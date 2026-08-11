import "dotenv/config";

export const config = {
  port: process.env["PORT"] || 3000,
  dbUrl: process.env["DATABASE_URL"] as string,
  rabbitMqUrl: process.env["RABBITMQ_URL"] as string,
  finnhubApiKey: process.env["FINNHUB_API_KEY"] as string,
};

if (!config.dbUrl || !config.finnhubApiKey) {
  throw new Error("Missing critical environment variables.");
}
