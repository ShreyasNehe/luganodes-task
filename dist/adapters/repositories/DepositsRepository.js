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
exports.DepositsRepository = void 0;
class DepositsRepository {
    constructor(depositsModel) {
        this.depositsModel = depositsModel;
    }
    storeDeposit(deposit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newDeposit = new this.depositsModel(Object.assign({ id: deposit.hash }, deposit));
                yield newDeposit.save();
            }
            catch (error) {
                // Check if the error is a duplicate key error
                if (error.code === 11000) {
                    // 11000 is the error code for duplicate key in MongoDB
                    console.warn("Deposit with this hash already exists:", deposit.hash);
                    return;
                }
                console.error("Error storing deposit:", error);
                throw error; // Rethrow the error if it's not a duplicate key error
            }
        });
    }
    getLatestStoredBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield this.depositsModel
                .findOne()
                .sort({ blockNumber: -1 })
                .limit(1)
                .exec();
            return tx ? tx.blockNumber : null;
        });
    }
    getDeposits(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const deposits = yield this.depositsModel
                .find({
                blockchain: props.blockchain,
                network: props.network,
                token: props.token,
                blockTimestamp: props.blockTimestamp
                    ? { $gte: props.blockTimestamp }
                    : undefined,
            })
                .exec();
            return deposits;
        });
    }
}
exports.DepositsRepository = DepositsRepository;
