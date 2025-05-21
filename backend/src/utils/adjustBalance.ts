export function adjustBalance(
  balance: number,
  amount: number,
  type: 'income' | 'expense',
  operation: 'add' | 'subtract'
): number {
  if (type === 'income') {
    return operation === 'add' ? balance + amount : balance - amount;
  } else if (type === 'expense') {
    return operation === 'add' ? balance - amount : balance + amount;
  }
  return balance;
};