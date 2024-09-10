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
exports.DepositsFetcherService = void 0;
// TODO - would be nice to store which was the last block processed
// NOTE - error handling for fetches to data gateways is missing and it's relative to business logics needs
class DepositsFetcherService {
    constructor(options) {
        this.depositsRepository = options.depositsRepository;
    }
    getDeposits(props) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.depositsRepository.getDeposits(props);
        });
    }
}
exports.DepositsFetcherService = DepositsFetcherService;
