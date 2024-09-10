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
const express_1 = __importDefault(require("express"));
const context_1 = require("./context");
const prom_client_1 = require("prom-client");
// Initialize Express app
const app = (0, express_1.default)();
// Create a Registry
const register = new prom_client_1.Registry();
// Define metrics
const depositsTotal = new prom_client_1.Counter({
    name: "crypto_deposits_total",
    help: "Total number of crypto deposits",
    labelNames: ["blockchain", "network", "token"],
    registers: [register],
});
const latestBlockNumber = new prom_client_1.Gauge({
    name: "crypto_deposits_latest_block",
    help: "Latest block number processed",
    labelNames: ["blockchain", "network"],
    registers: [register],
});
const latestBlockTimestamp = new prom_client_1.Gauge({
    name: "crypto_deposits_latest_timestamp",
    help: "Timestamp of the latest processed block",
    labelNames: ["blockchain", "network"],
    registers: [register],
});
// Middleware to parse JSON
app.use(express_1.default.json());
// Define the metrics endpoint
app.get("/prometheus", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blockchain, network, token } = req.query;
    // Current timestamp - 5 minutes, converted to seconds
    const fiveMinutesAgo = Math.floor((Date.now() - 5 * 60 * 1000) / 1000);
    // Check if all required parameters are present
    if (!blockchain || !network || !token) {
        return res.status(400).send("Missing required parameters");
    }
    try {
        const depositsFetcherService = yield (0, context_1.getDepositsFetcherService)();
        // Query the database for deposits matching the parameters
        const deposits = yield depositsFetcherService.getDeposits({
            blockchain: blockchain,
            network: network,
            token: token,
            blockTimestamp: fiveMinutesAgo,
        });
        // Update metrics
        deposits.forEach((deposit) => {
            depositsTotal
                .labels(deposit.blockchain, deposit.network, deposit.token)
                .inc();
            latestBlockNumber
                .labels(deposit.blockchain, deposit.network)
                .set(deposit.blockNumber);
            latestBlockTimestamp
                .labels(deposit.blockchain, deposit.network)
                .set(deposit.blockTimestamp);
        });
        // Return the metrics in Prometheus format
        res.set("Content-Type", register.contentType);
        res.end(yield register.metrics());
        console.log("Metrics sent to Prometheus");
    }
    catch (error) {
        console.error("Error querying deposits:", error);
        res.status(500).send("Internal Server Error");
    }
}));
// Connect to MongoDB and start the server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app.listen(3005, () => {
            console.log(`Server is running on http://localhost:3005`);
        });
    }
    catch (error) {
        console.error("Error starting server:", error);
    }
});
startServer();
