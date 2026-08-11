import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { config } from "../config/env.js";

const dbUrl = new URL(config.dbUrl);

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.replace("/", ""),
  connectionLimit: 5,
});

export const prisma = new PrismaClient({ adapter });
