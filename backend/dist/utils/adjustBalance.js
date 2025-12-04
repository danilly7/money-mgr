"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustBalance = adjustBalance;
function adjustBalance(balance, amount, type, operation) {
    if (type === 'income') {
        return operation === 'add' ? balance + amount : balance - amount;
    }
    else if (type === 'expense') {
        return operation === 'add' ? balance - amount : balance + amount;
    }
    return balance;
}
;
