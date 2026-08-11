import { Router } from "express";
import {
  getStocks,
  getLatestBySymbol,
  getHistoryBySymbol,
} from "../controllers/stock.js";

const router = Router();

router.get("/", getStocks);
router.get("/:symbol/latest", getLatestBySymbol);
router.get("/:symbol/history", getHistoryBySymbol);

export default router;
