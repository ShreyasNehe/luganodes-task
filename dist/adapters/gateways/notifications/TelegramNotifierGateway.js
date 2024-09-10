"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramNotifierGateway = void 0;
const telegraf_1 = require("telegraf");
class TelegramNotifierGateway {
    constructor(config) {
        this.botToken = config.botToken;
        this.chatId = config.chatId;
        this.bot = new telegraf_1.Telegraf(this.botToken);
    }
    sendNotification(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.bot.telegram.sendMessage(this.chatId, message);
                console.log("Notification sent successfully");
            }
            catch (error) {
                console.error("Error sending notification:", error);
                throw error;
            }
        });
    }
}
exports.TelegramNotifierGateway = TelegramNotifierGateway;
