import cron from "node-cron";
import { finnhubClient } from "../services/finnhub.js";
import { connectRabbitMQ } from "../config/rabbitmq.js";
import { log } from "../services/logger.js";

const SYMBOLS = ["AAPL", "MSFT", "GOOGL"];

let round = 0;

export const startProducer = async () => {
  const channel = await connectRabbitMQ();

  log.producer.info("Producer started — fetching every 5 minutes");

  cron.schedule("*/5 * * * *", async () => {
    round++;
    const timestamp = new Date().toISOString();
    log.producer.info("──────────────────────────────────────────");
    log.producer.info(`Round ${round} started at ${timestamp}`);
    log.producer.info("──────────────────────────────────────────");

    let queued = 0;
    let failed = 0;

    for (const symbol of SYMBOLS) {
      try {
        const response = await finnhubClient.get(`/quote?symbol=${symbol}`);
        const data = response.data as {
          c: number;
          h: number;
          l: number;
          o: number;
          pc: number;
        };

        const payload = {
          symbol,
          currentPrice: data.c,
          highPrice: data.h,
          lowPrice: data.l,
          openPrice: data.o,
          previousClose: data.pc,
        };

        channel.sendToQueue(
          "stock_quotes_queue",
          Buffer.from(JSON.stringify(payload)),
          { persistent: true }
        );

        log.producer.info(
          `${symbol}: cur=$${data.c} high=$${data.h} low=$${data.l} open=$${data.o} prevClose=$${data.pc}`,
          { round, ...payload }
        );

        queued++;
      } catch (error) {
        failed++;
        log.producer.fail(`Failed to fetch ${symbol}`, {
          round,
          symbol,
          error: String(error),
        });
      }
    }

    log.producer.info(
      `Round ${round} complete — ${queued} queued, ${failed} failed`
    );
  });
};
