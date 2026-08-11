import type { Request, Response } from "express";
import { prisma } from "../services/db.js";

type SymbolParams = { symbol: string };

export const getStocks = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const quotes = await prisma.stockQuote.findMany({
      take: limit,
      orderBy: { recordedAt: "desc" },
    });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quotes" });
  }
};

export const getLatestBySymbol = async (
  req: Request<SymbolParams>,
  res: Response
) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const quote = await prisma.stockQuote.findFirst({
      where: { symbol },
      orderBy: { recordedAt: "desc" },
    });

    if (!quote) {
      res.status(404).json({ error: `No quotes found for ${symbol}` });
      return;
    }

    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch latest quote" });
  }
};

export const getHistoryBySymbol = async (
  req: Request<SymbolParams>,
  res: Response
) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const limit = Number(req.query.limit) || 100;

    const quotes = await prisma.stockQuote.findMany({
      where: { symbol },
      take: limit,
      orderBy: { recordedAt: "desc" },
    });

    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};
