import { createClient } from "redis";
import { config } from "../config/config.js";

export const redis = createClient({ url: config.redis.url });