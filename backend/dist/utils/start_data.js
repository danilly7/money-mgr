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
exports.insertInitialData = void 0;
const models_1 = __importDefault(require("../models"));
const { Category } = models_1.default;
const insertInitialData = () => __awaiter(void 0, void 0, void 0, function* () {
    const categoriesData = [
        // Income categories
        { name: 'Salary', type: 'income' },
        { name: 'Side Job', type: 'income' },
        { name: 'Bonus', type: 'income' },
        { name: 'Refund', type: 'income' },
        { name: 'Interest', type: 'income' },
        { name: 'Funding', type: 'income' },
        { name: 'Misc', type: 'income' },
        // Expenses categories
        { name: 'Housing', type: 'expense' },
        { name: 'Bills', type: 'expense' },
        { name: 'Transport', type: 'expense' },
        { name: 'Groceries', type: 'expense' },
        { name: 'Dining', type: 'expense' },
        { name: 'Pets', type: 'expense' },
        { name: 'Coffee', type: 'expense' },
        { name: 'Entertainment', type: 'expense' },
        { name: 'Health', type: 'expense' },
        { name: 'Education', type: 'expense' },
        { name: 'Shopping', type: 'expense' },
        { name: 'Emergency', type: 'expense' },
        { name: 'Clothing', type: 'expense' },
        { name: 'Gifts', type: 'expense' },
        { name: 'Travel', type: 'expense' },
        { name: 'Luxury', type: 'expense' },
        { name: 'Social', type: 'expense' },
        { name: 'Subscriptions', type: 'expense' },
        { name: 'Donations', type: 'expense' },
        { name: 'Fees', type: 'expense' },
        { name: 'Self-care', type: 'expense' },
        { name: 'Misc', type: 'expense' },
    ];
    //Insertar datos con opción ignoreDuplicates
    //Para actualizar todas las filas: updateOnDuplicate: Object.keys(User.rawAttributes)
    yield Category.bulkCreate(categoriesData, {
        ignoreDuplicates: true,
        updateOnDuplicate: ['name', 'type'],
    });
});
exports.insertInitialData = insertInitialData;
