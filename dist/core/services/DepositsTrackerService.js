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
exports.DepositsTrackerService = void 0;
const deposit_1 = require("core/domain/deposit");
// TODO - would be nice to store which was the last block processed
// NOTE - error handling for fetches to data gateways is missing and it's relative to business logics needs
class DepositsTrackerService {
    constructor(options) {
        var _a;
        this.blockchainGateway = options.blockchainGateway;
        this.notificatorGateway = options.notificatorGateway;
        this.depositsRepository = options.depositsRepository;
        this.filterIn = options.filterIn;
        if (this.filterIn.length)
            console.info(`Filtering deposits for addresses: ${this.filterIn.join(", ")}`);
        // Send a notification
        (_a = this.notificatorGateway) === null || _a === void 0 ? void 0 : _a.sendNotification(`Deposits tracker service started`);
    }
    // Process the last block's transactions in batches
    processBlockTransactions() {
        return __awaiter(this, arguments, void 0, function* (blockNumberOrHash = "latest") {
            try {
                const transactions = yield this.blockchainGateway.fetchBlockTransactions(blockNumberOrHash);
                const sotreBatchSize = 5;
                if (transactions && transactions.length > 0) {
                    const batches = Math.ceil(transactions.length / sotreBatchSize);
                    for (let i = 0; i < batches; i++) {
                        const batch = transactions.slice(i * sotreBatchSize, (i + 1) * sotreBatchSize);
                        for (const tx of batch) {
                            yield this.processTransaction(tx);
                        }
                    }
                }
            }
            catch (error) {
                //
            }
        });
    }
    processBlockTransactionsFrom(blockNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastStoredBlockNumber = (yield this.depositsRepository.getLatestStoredBlock()) || blockNumber;
            if (lastStoredBlockNumber)
                console.info(`Executing block txs processing from block number ${lastStoredBlockNumber} as it's <last stored/requested> block number:`);
            let latestBlock = yield this.blockchainGateway.getBlockNumber();
            console.info(`Latest block number: ${latestBlock}`);
            const promises = [];
            for (let i = lastStoredBlockNumber; i <= latestBlock; i++) {
                promises.push(this.processBlockTransactions(i));
            }
            yield Promise.all(promises);
            console.info(`Finished processing blocks from ${lastStoredBlockNumber} to ${latestBlock}`);
        });
    }
    // Listen to pending transactions in real-time
    startPendingTransactionsListener() {
        this.blockchainGateway.watchPendingTransactions((tx) => {
            // Check if tx corresponds to the public key
            this.processTransaction(tx);
        });
    }
    // Listen to new minted blocks in real-time
    startMintedBlocksListener() {
        this.blockchainGateway.watchMintedBlocks((blockNumber) => {
            this.processBlockTransactions(blockNumber);
            // Check if tx corresponds to the public key
            // this.processTransactions(tx);
        });
    }
    processTransaction(txData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (!this.filterIn.includes(txData.to))
                    return;
                console.info("Found deposit transaction:", txData.hash);
                // Calculate the transaction fee as the product of gas limit and gas price
                // TODO - Check this is acurate
                const fee = txData.gasLimit * txData.gasPrice;
                const deposit = {
                    blockNumber: txData.blockNumber,
                    blockTimestamp: txData.blockTimestamp,
                    pubkey: txData.from,
                    fee: fee,
                    hash: txData.hash,
                    blockchain: this.blockchainGateway.blockchain,
                    network: this.blockchainGateway.network,
                    token: this.blockchainGateway.token,
                };
                deposit_1.DepositSchema.parse(deposit);
                // Save the deposit to the storage repository
                yield this.depositsRepository.storeDeposit(deposit);
                // Send a notification
                yield ((_a = this.notificatorGateway) === null || _a === void 0 ? void 0 : _a.sendNotification(`Deposit processed: ${txData.hash}\n\nAmount: ${txData.value}\nFee: ${fee}\nFrom: ${txData.from}\nTo: ${txData.to}\nBlock: ${txData.blockNumber}`));
            }
            catch (error) {
                yield ((_b = this.notificatorGateway) === null || _b === void 0 ? void 0 : _b.sendNotification(`Error processing deposit: ${txData.hash}`));
            }
        });
    }
}
exports.DepositsTrackerService = DepositsTrackerService;
