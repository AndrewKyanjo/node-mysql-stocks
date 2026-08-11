import axios from "axios";
import { config } from "../config/env.js";

export const finnhubClient = axios.create({
  baseURL: "https://finnhub.io/api/v1",
  headers: {
    "X-Finnhub-Token": config.finnhubApiKey,
  },
});
