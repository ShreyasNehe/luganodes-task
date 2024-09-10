"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositSchema = void 0;
const zod_1 = require("zod");
// Define the Zod schema
exports.DepositSchema = zod_1.z.object({
    blockNumber: zod_1.z.number(),
    blockTimestamp: zod_1.z.number(),
    fee: zod_1.z.bigint().optional(),
    hash: zod_1.z.string().optional(),
    pubkey: zod_1.z.string(),
    blockchain: zod_1.z.string(),
    network: zod_1.z.string(),
    token: zod_1.z.string(),
});
