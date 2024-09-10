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
exports.getDepositsFetcherService = void 0;
const createMongooseConnection_1 = __importDefault(require("database/createMongooseConnection"));
const env_1 = __importDefault(require("utils/env"));
const Deposit_1 = require("database/schemas/Deposit");
const DepositsRepository_1 = require("adapters/repositories/DepositsRepository");
const DepositsFetcherService_1 = require("core/services/DepositsFetcherService");
// Mongoose connection
let mongooseConnection;
// Repositories
let depositsRepository;
// Services
let depositsFetcherService;
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
const getDepositsFetcherService = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!depositsFetcherService) {
        yield getMongooseConnection();
        const depositsRepository = yield getDepositsRepository();
        depositsFetcherService = new DepositsFetcherService_1.DepositsFetcherService({
            depositsRepository: depositsRepository,
        });
        console.info("EthBeaconService created");
    }
    return depositsFetcherService;
});
exports.getDepositsFetcherService = getDepositsFetcherService;
