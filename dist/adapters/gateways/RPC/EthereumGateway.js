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
exports.EthereumGateway = void 0;
const ethers_1 = require("ethers");
const BlockchainGateway_1 = require("./BlockchainGateway");
// Implement the Ethereum-specific provider that adheres to the IBlockchainProvider interface
class EthereumProvider {
    constructor(config) {
        const fullRpcUrl = `${config.rpcUrl}/v2/${config.apiKey}`;
        this.provider = new ethers_1.ethers.JsonRpcProvider(fullRpcUrl, config.network);
    }
    getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.getTransaction(txHash);
        });
    }
    getBlock(blockNumberOrHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.getBlock(blockNumberOrHash);
        });
    }
    getBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.getBlockNumber();
        });
    }
    getTransactionTrace(txHash_1) {
        return __awaiter(this, arguments, void 0, function* (txHash, options = {}) {
            try {
                // Make a request to the Ethereum node to get the transaction trace
                const opts = Object.assign({ tracer: "callTracer" }, options);
                const trace = yield this.provider.send("debug_traceTransaction", [
                    txHash,
                    opts,
                ]);
                return trace;
            }
            catch (error) {
                console.error("Error fetching transaction trace:", error);
                return null;
            }
        });
    }
    on(event, listener) {
        this.provider.on(event, listener);
    }
}
// Extend the generic BlockchainGateway to create an Ethereum-specific gateway
class EthereumGateway extends BlockchainGateway_1.BlockchainGateway {
    constructor(config) {
        const ethereumProvider = new EthereumProvider(config);
        super({
            provider: ethereumProvider,
            blockchain: "ethereum",
            network: config.metadata.network,
            token: "ETH",
        });
        this.token = "ETH";
    }
}
exports.EthereumGateway = EthereumGateway;
