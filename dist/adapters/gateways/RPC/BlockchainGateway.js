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
exports.BlockchainGateway = void 0;
const sleep_1 = __importDefault(require("utils/sleep"));
class BlockchainGateway {
    constructor(config) {
        this.fetchQueue = [];
        this.isFetching = false;
        this.provider = config.provider;
        this.batchSize = config.batchSize || 15;
        this.retries = config.retries || 15;
        this.blockchain = config.blockchain;
        this.network = config.network;
        this.token = config.token;
    }
    // Generic method to add a fetch operation to the queue
    queueFetchOperation(fetchCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                this.fetchQueue.push({ fetchCallback, resolvePromise: resolve });
                this.processFetchQueue();
            });
        });
    }
    // Process the fetch queue in batches
    processFetchQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isFetching || this.fetchQueue.length === 0)
                return;
            this.isFetching = true;
            const batch = this.fetchQueue.splice(0, this.batchSize);
            const promises = batch.map((_a) => __awaiter(this, [_a], void 0, function* ({ fetchCallback, resolvePromise }) {
                const data = yield this.executeFetchWithRetry(fetchCallback);
                resolvePromise(data);
            }));
            yield Promise.all(promises);
            console.info(`Processed ${batch.length} fetch operations`);
            this.isFetching = false;
            this.processFetchQueue();
        });
    }
    // Execute a fetch operation with retries
    executeFetchWithRetry(fetchCallback_1) {
        return __awaiter(this, arguments, void 0, function* (fetchCallback, retries = this.retries, backoff = 1000) {
            var _a, _b;
            try {
                return yield fetchCallback();
            }
            catch (error) {
                if (retries > 0 && ((_a = error === null || error === void 0 ? void 0 : error.error) === null || _a === void 0 ? void 0 : _a.code) === 429) {
                    console.warn(`Rate limit exceeded. Retrying in ${backoff}ms...`);
                    yield (0, sleep_1.default)(backoff);
                    return this.executeFetchWithRetry(fetchCallback, retries - 1, backoff * 2);
                }
                // Check if it's a TIMEOUT error
                else if (((_b = error === null || error === void 0 ? void 0 : error.error) === null || _b === void 0 ? void 0 : _b.code) === -32603) {
                    console.warn(`Timeout error. Retrying in ${backoff}ms...`);
                    yield (0, sleep_1.default)(backoff);
                    return this.executeFetchWithRetry(fetchCallback, retries - 1, backoff * 2);
                }
                else {
                    console.error("System could not recover from rate limit error");
                    throw error;
                }
            }
        });
    }
    // Fetch transaction data
    getTransactionData(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.queueFetchOperation(() => __awaiter(this, void 0, void 0, function* () {
                const tx = yield this.provider.getTransaction(txHash);
                if (tx) {
                    const block = yield this.provider.getBlock(tx.blockNumber);
                    return {
                        value: tx.value,
                        blockTimestamp: block.timestamp,
                        blockNumber: tx.blockNumber,
                        blockHash: tx.blockHash,
                        index: tx.index,
                        hash: tx.hash,
                        type: tx.type,
                        to: tx.to,
                        from: tx.from,
                        nonce: tx.nonce,
                        gasLimit: tx.gasLimit,
                        gasPrice: tx.gasPrice,
                        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
                        maxFeePerGas: tx.maxFeePerGas,
                        maxFeePerBlobGas: tx.maxFeePerBlobGas,
                    };
                }
                return null;
            }));
        });
    }
    // Fetch and process transactions from a block
    fetchBlockTransactions(blockNumberOrHash) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info("Fetching block transactions from block:", blockNumberOrHash);
            const block = yield this.queueFetchOperation(() => this.provider.getBlock(blockNumberOrHash));
            if (block && block.transactions) {
                const deposits = [];
                const promises = block.transactions.map((txHash) => __awaiter(this, void 0, void 0, function* () {
                    const deposit = yield this.getTransactionData(txHash);
                    if (deposit) {
                        deposits.push(deposit);
                    }
                }));
                yield Promise.all(promises);
                return deposits.length > 0 ? deposits : null;
            }
            return null;
        });
    }
    // Watch for pending transactions in real-time
    watchPendingTransactions(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info("Watching for pending transactions...");
            this.provider.on("pending", (txHash) => __awaiter(this, void 0, void 0, function* () {
                const data = yield this.getTransactionData(txHash);
                data && callback(data);
            }));
        });
    }
    // Watch for new minted blocks in real-time
    watchMintedBlocks(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info("Watching for new minted blocks...");
            this.provider.on("block", (blockNumber) => __awaiter(this, void 0, void 0, function* () {
                callback(blockNumber);
            }));
        });
    }
    // Get the latest block number
    getBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.queueFetchOperation(() => this.provider.getBlockNumber());
        });
    }
}
exports.BlockchainGateway = BlockchainGateway;
