import { Transaction } from "../components/transactions/interface-transaction";

const mockTransactions: Transaction[] = [
    {
        id: 1,
        category_id: 1, // Relacionado con 'Salary'
        account_id: 1,
        amount: 1500,
        comment: 'Salary for January',
        date: '2025-01-31T10:00:00Z', // Fecha en enero
    },
    {
        id: 2,
        category_id: 4, // Relacionado con 'Entertainment'
        account_id: 2,
        amount: 50,
        comment: 'Movie night with friends',
        date: '2025-02-04T19:00:00Z',
    },
    {
        id: 3,
        category_id: 7, // Relacionado con 'Transport'
        account_id: 1,
        amount: 30,
        comment: 'Public transport pass',
        date: '2025-02-09T08:30:00Z',
    },
    {
        id: 4,
        category_id: 10, // Relacionado con 'Groceries'
        account_id: 3,
        amount: 100,
        comment: 'Weekly grocery shopping',
        date: '2025-02-10T14:00:00Z',
    },
    {
        id: 5,
        category_id: 13, // Relacionado con 'Health'
        account_id: 2,
        amount: 60,
        comment: 'Doctor visit',
        date: '2025-02-12T10:00:00Z',
    },
    {
        id: 6,
        category_id: 16, // Relacionado con 'Education'
        account_id: 3,
        amount: 200,
        comment: 'Online course payment',
        date: '2025-02-13T09:00:00Z',
    },
    {
        id: 7,
        category_id: 19, // Relacionado con 'Shopping'
        account_id: 1,
        amount: 120,
        comment: 'New clothes for winter',
        date: '2025-02-14T16:00:00Z',
    },
    {
        id: 8,
        category_id: 21, // Relacionado con 'Travel'
        account_id: 2,
        amount: 400,
        comment: 'Flight tickets to Rome',
        date: '2025-02-15T12:00:00Z',
    },
    {
        id: 9,
        category_id: 3, // Relacionado con 'Bonus'
        account_id: 3,
        amount: 500,
        comment: 'Year-end bonus',
        date: '2025-02-05T17:00:00Z',
    },
    {
        id: 10,
        category_id: 5, // Relacionado con 'Interest'
        account_id: 1,
        amount: 15,
        comment: 'Bank interest',
        date: '2025-02-06T09:30:00Z',
    },
    {
        id: 11,
        category_id: 8, // Relacionado con 'Food'
        account_id: 2,
        amount: 20,
        comment: 'Lunch with colleagues',
        date: '2025-02-18T12:00:00Z', // Hoy
    },
    {
        id: 12,
        category_id: 6, // Relacionado con 'Bills'
        account_id: 3,
        amount: 200,
        comment: 'Electricity bill payment',
        date: '2025-02-18T14:00:00Z', // Hoy
    },

    // Transacciones de esta semana
    {
        id: 13,
        category_id: 11, // Relacionado con 'Sports'
        account_id: 1,
        amount: 50,
        comment: 'Gym membership',
        date: '2025-02-15T10:00:00Z', // Esta semana
    },
    {
        id: 14,
        category_id: 14, // Relacionado con 'Dining'
        account_id: 2,
        amount: 80,
        comment: 'Dinner at restaurant',
        date: '2025-02-16T18:00:00Z', // Esta semana
    },

    // Transacciones de este mes
    {
        id: 15,
        category_id: 9, // Relacionado con 'Transportation'
        account_id: 3,
        amount: 60,
        comment: 'Taxi to the airport',
        date: '2025-02-01T07:30:00Z', // Este mes
    },
    {
        id: 16,
        category_id: 2, // Relacionado con 'Clothing'
        account_id: 1,
        amount: 100,
        comment: 'Winter jacket purchase',
        date: '2025-02-04T16:00:00Z', // Este mes
    },

    // Transacciones de este año
    {
        id: 17,
        category_id: 12, // Relacionado con 'Gifts'
        account_id: 2,
        amount: 150,
        comment: 'Birthday gift for friend',
        date: '2025-01-15T10:00:00Z', // Este año
    },
    {
        id: 18,
        category_id: 15, // Relacionado con 'Travel'
        account_id: 3,
        amount: 500,
        comment: 'Vacation trip to Spain',
        date: '2025-02-10T09:00:00Z', // Este año (en abril)
    },
];

export default mockTransactions;