import express from "express";
import { config } from "./config/env.js";
import { prisma } from "./services/db.js";
import { startProducer } from "./workers/producer.js";
import { startConsumer } from "./workers/consumer.js";
import stockRoutes from "./routes/stock.js";
import { log } from "./services/logger.js";

const app = express();
app.use(express.json());

app.use("/api/stocks", stockRoutes);

const bootstrap = async () => {
  try {
    await prisma.$connect();
    log.server.success("Connected to MySQL via Prisma");

    await startProducer();
    await startConsumer();

    app.listen(config.port, () => {
      log.server.info(`Server running on http://localhost:${config.port}`);
      log.server.info("API endpoints:");
      log.server.info("  GET /api/stocks");
      log.server.info("  GET /api/stocks/:symbol/latest");
      log.server.info("  GET /api/stocks/:symbol/history");
    });
  } catch (error) {
    log.server.error("Failed to start server", error);
    process.exit(1);
  }
};

bootstrap();
