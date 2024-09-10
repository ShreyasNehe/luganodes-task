"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envs = {
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    MONGO_URI: process.env.MONGO_URI,
    ETH_BLOCK_FROM: parseInt(process.env.ETH_BLOCK_FROM),
    TELEGRAM_NOTIFICATIONS_BOT_TOKEN: process.env.TELEGRAM_NOTIFICATIONS_BOT_TOKEN,
    TELEGRAM_NOTIFICATIONS_CHAT_ID: process.env.TELEGRAM_NOTIFICATIONS_CHAT_ID,
};
exports.default = envs;
