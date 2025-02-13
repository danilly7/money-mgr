import Account from "./account";
import Category from "./category";
import Transaction from "./transaction";
import Transfer from "./transfer";
import User from "./user";

//un usuario puede tener muchas cuentas (1:N)
User.hasMany(Account, { foreignKey: 'user_id', as: 'accounts' });
Account.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

//una cuenta puede tener muchas transacciones (1:N)
Account.hasMany(Transaction, { foreignKey: 'account_id', as: 'transactions' });
Transaction.belongsTo(Account, { foreignKey: 'account_id', as: 'account' });

//una cuenta puede estar involucrada en muchas transferencias (1:N)
// ojo que sea: origin_account_id y destination_account_id
Account.hasMany(Transfer, { foreignKey: 'origin_account_id', as: 'originTransfers' });
Account.hasMany(Transfer, { foreignKey: 'destination_account_id', as: 'destinationTransfers' });

//una categoría puede tener muchas transacciones (1:N)
Category.hasMany(Transaction, { foreignKey: 'category_id', as: 'transactions' });
Transaction.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

const models = {Account, Category, Transaction, Transfer, User};

export default models;