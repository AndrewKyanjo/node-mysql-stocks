import amqp from "amqplib";
import { config } from "./env.js";

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(config.rabbitMqUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue("stock_quotes_queue", { durable: true });
  return channel;
};
