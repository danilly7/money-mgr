import models from "../models";

const { Category } = models;

const insertInitialData = async () => {

  const categoriesData: { name: string; type: 'income' | 'expense' }[] = [
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
  await Category.bulkCreate(categoriesData, {
    ignoreDuplicates: true,
    updateOnDuplicate: ['name', 'type'],
  });
};

export { insertInitialData };