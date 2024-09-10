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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEthBeaconDepositTrackerService = void 0;
const EthereumGateway_1 = require("adapters/gateways/RPC/EthereumGateway");
const DepositsTrackerService_1 = require("core/services/DepositsTrackerService");
const createMongooseConnection_1 = __importDefault(require("database/createMongooseConnection"));
const env_1 = __importDefault(require("utils/env"));
const Deposit_1 = require("database/schemas/Deposit");
const DepositsRepository_1 = require("adapters/repositories/DepositsRepository");
const TelegramNotifierGateway_1 = require("adapters/gateways/notifications/TelegramNotifierGateway");
// Mongoose connection
let mongooseConnection;
// Gateways
let ethGateway;
let telegramNotifierGateway;
// Repositories
let depositsRepository;
// Services
let ethBeaconService;
const getMongooseConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongooseConnection) {
        mongooseConnection = yield (0, createMongooseConnection_1.default)(env_1.default.MONGO_URI);
    }
    return mongooseConnection;
});
const getDepositsRepository = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!depositsRepository) {
        console.info("Creating new DepositsRepository");
        yield getMongooseConnection();
        depositsRepository = new DepositsRepository_1.DepositsRepository(Deposit_1.DepositModel);
    }
    return depositsRepository;
});
const getEthGateway = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!ethGateway) {
        console.info("Creating new EthereumGateway");
        ethGateway = new EthereumGateway_1.EthereumGateway({
            rpcUrl: "https://eth-mainnet.g.alchemy.com",
            apiKey: env_1.default.ALCHEMY_API_KEY,
            metadata: {
                network: "mainnet",
            },
        });
    }
    return ethGateway;
});
const getTelegramNotifierGateway = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!telegramNotifierGateway) {
        console.info("Creating new TelegramNotifierGateway");
        telegramNotifierGateway = new TelegramNotifierGateway_1.TelegramNotifierGateway({
            botToken: env_1.default.TELEGRAM_NOTIFICATIONS_BOT_TOKEN,
            chatId: env_1.default.TELEGRAM_NOTIFICATIONS_CHAT_ID,
        });
    }
    return telegramNotifierGateway;
});
const getEthBeaconDepositTrackerService = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!ethBeaconService) {
        yield getMongooseConnection();
        const depositsRepository = yield getDepositsRepository();
        const telegramNotifierGateway = yield getTelegramNotifierGateway();
        // Initialize the EthereumGateway with the Alchemy API key
        const ethGateway = yield getEthGateway();
        ethBeaconService = new DepositsTrackerService_1.DepositsTrackerService({
            blockchainGateway: ethGateway,
            notificatorGateway: telegramNotifierGateway,
            depositsRepository: depositsRepository,
            filterIn: ["0x00000000219ab540356cBB839Cbe05303d7705Fa"],
        });
        console.info("EthBeaconService created");
    }
    return ethBeaconService;
});
exports.getEthBeaconDepositTrackerService = getEthBeaconDepositTrackerService;
