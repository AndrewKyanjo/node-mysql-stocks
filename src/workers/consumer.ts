import { connectRabbitMQ } from "../config/rabbitmq.js";
import { prisma } from "../services/db.js";
import { log } from "../services/logger.js";

let savedCount = 0;

export const startConsumer = async () => {
  const channel = await connectRabbitMQ();
  log.consumer.info("Consumer waiting for stock quotes...");

  channel.consume("stock_quotes_queue", async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString()) as {
        symbol: string;
        currentPrice: number;
        highPrice: number;
        lowPrice: number;
        openPrice: number;
        previousClose: number;
      };

      await prisma.stockQuote.create({
        data: {
          symbol: data.symbol,
          currentPrice: data.currentPrice,
          highPrice: data.highPrice,
          lowPrice: data.lowPrice,
          openPrice: data.openPrice,
          previousClose: data.previousClose,
        },
      });

      savedCount++;
      log.consumer.success(
        `Saved ${data.symbol} — $${data.currentPrice}`,
        { totalSaved: savedCount, symbol: data.symbol }
      );

      channel.ack(msg);
    } catch (error) {
      log.consumer.error(`Failed to save to database`, error);
      // Reject and requeue for retry
      channel.nack(msg, false, true);
    }
  });
};
