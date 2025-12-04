"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = __importDefault(require("./account"));
const category_1 = __importDefault(require("./category"));
const transaction_1 = __importDefault(require("./transaction"));
const transfer_1 = __importDefault(require("./transfer"));
const user_1 = __importDefault(require("./user"));
//un usuario puede tener muchas cuentas (1:N)
user_1.default.hasMany(account_1.default, { foreignKey: 'user_id', as: 'accounts' });
account_1.default.belongsTo(user_1.default, { foreignKey: 'user_id', as: 'user' });
//una cuenta puede tener muchas transacciones (1:N)
account_1.default.hasMany(transaction_1.default, { foreignKey: 'account_id', as: 'transactions' });
transaction_1.default.belongsTo(account_1.default, { foreignKey: 'account_id', as: 'account' });
//una cuenta puede estar involucrada en muchas transferencias (1:N)
// ojo que sea: origin_account_id y destination_account_id
account_1.default.hasMany(transfer_1.default, { foreignKey: 'origin_account_id', as: 'originTransfers' });
account_1.default.hasMany(transfer_1.default, { foreignKey: 'destination_account_id', as: 'destinationTransfers' });
//una categoría puede tener muchas transacciones (1:N)
category_1.default.hasMany(transaction_1.default, { foreignKey: 'category_id', as: 'transactions' });
transaction_1.default.belongsTo(category_1.default, { foreignKey: 'category_id', as: 'category' });
const models = { Account: account_1.default, Category: category_1.default, Transaction: transaction_1.default, Transfer: transfer_1.default, User: user_1.default };
exports.default = models;
