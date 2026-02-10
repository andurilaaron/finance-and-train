// ANZ Banking API Client
import bankConfig from './bank-config';

// ANZ API base URL
const ANZ_API_BASE = 'https://api.anz.com/banking/v1';

async function getAuthToken() {
    // Implement OAuth 2.0 token generation
    // This would use the credentials from bank-config.js
    // For now, we'll use the API key directly
    return bankConfig.apiKey;
}

export async function fetchAccounts() {
    try {
        // In a real implementation, you would make an actual API call to ANZ
        // For now, returning structured mock data that matches ANZ's format

        // Real ANZ API would be something like:
        // const token = await getAuthToken();
        // const response = await fetch(`${ANZ_API_BASE}/accounts`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'x-api-key': bankConfig.apiKey
        //   }
        // });
        // return await response.json();

        // Mock data with realistic structure
        return {
            accounts: [
                {
                    id: '1',
                    name: 'Everyday Account',
                    type: 'transaction',
                    bsb: '012-003',
                    accountNumber: '****1234',
                    balance: 5234.67,
                    availableBalance: 5234.67,
                },
                {
                    id: '2',
                    name: 'Savings Account',
                    type: 'savings',
                    bsb: '012-003',
                    accountNumber: '****5678',
                    balance: 12450.00,
                    availableBalance: 12450.00,
                },
            ],
            transactions: [
                {
                    id: '1',
                    description: 'Woolworths Supermarket',
                    amount: -87.50,
                    category: 'Groceries',
                    date: new Date(Date.now() - 86400000).toISOString(),
                    balance: 5234.67,
                },
                {
                    id: '2',
                    description: 'Salary Credit',
                    amount: 3200.00,
                    category: 'Income',
                    date: new Date(Date.now() - 172800000).toISOString(),
                    balance: 5322.17,
                },
                {
                    id: '3',
                    description: 'Netflix Subscription',
                    amount: -16.99,
                    category: 'Entertainment',
                    date: new Date(Date.now() - 259200000).toISOString(),
                    balance: 2122.17,
                },
                {
                    id: '4',
                    description: 'Coles Supermarket',
                    amount: -124.80,
                    category: 'Groceries',
                    date: new Date(Date.now() - 345600000).toISOString(),
                    balance: 2139.16,
                },
            ],
        };
    } catch (error) {
        console.error('Error fetching ANZ accounts:', error);
        return {
            accounts: [],
            transactions: [],
        };
    }
}

export async function fetchTransactions(accountId, limit = 50) {
    try {
        const mockTransactions = [
            {
                id: '1',
                date: new Date('2025-11-23'),
                description: 'Woolworths Sydney',
                amount: -87.45,
                category: 'groceries',
                merchant: 'Woolworths',
            },
            {
                id: '2',
                date: new Date('2025-11-22'),
                description: 'Opal Travel',
                amount: -17.80,
                category: 'transport',
                merchant: 'Transport NSW',
            },
            {
                id: '3',
                date: new Date('2025-11-22'),
                description: 'Salary Deposit',
                amount: 3500.00,
                category: 'income',
                merchant: 'Employer',
            },
            {
                id: '4',
                date: new Date('2025-11-21'),
                description: 'Netflix Subscription',
                amount: -17.99,
                category: 'entertainment',
                merchant: 'Netflix',
            },
            {
                id: '5',
                date: new Date('2025-11-20'),
                description: 'Cafe Coffee',
                amount: -5.50,
                category: 'dining',
                merchant: 'Local Cafe',
            },
        ];

        return mockTransactions.slice(0, limit);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
}

export function categorizeTransaction(transaction) {
    const categories = {
        groceries: ['woolworths', 'coles', 'aldi', 'iga'],
        transport: ['opal', 'uber', 'taxi', 'transport'],
        dining: ['cafe', 'restaurant', 'mcdonald', 'kfc', 'subway'],
        entertainment: ['netflix', 'spotify', 'cinema', 'gym'],
        utilities: ['electricity', 'gas', 'water', 'internet'],
        shopping: ['amazon', 'ebay', 'kmart', 'target'],
    };

    const description = transaction.description.toLowerCase();

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => description.includes(keyword))) {
            return category;
        }
    }

    return transaction.amount > 0 ? 'income' : 'other';
}

export function calculateSpending(transactions, period = 'month') {
    const now = new Date();
    const startDate = new Date();

    if (period === 'week') {
        startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
        startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'year') {
        startDate.setFullYear(now.getFullYear() - 1);
    }

    const filteredTransactions = transactions.filter(
        t => new Date(t.date) >= startDate && t.amount < 0
    );

    const byCategory = {};
    let total = 0;

    for (const transaction of filteredTransactions) {
        const category = transaction.category || categorizeTransaction(transaction);
        const amount = Math.abs(transaction.amount);

        byCategory[category] = (byCategory[category] || 0) + amount;
        total += amount;
    }

    return {
        total,
        byCategory,
        transactionCount: filteredTransactions.length,
        period,
    };
}

export function forecastCashFlow(transactions, daysAhead = 30) {
    const monthlyExpenses = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0) / 30;

    const monthlyIncome = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0) / 30;

    const forecast = [];
    const currentBalance = 5234.67;

    for (let i = 0; i <= daysAhead; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);

        const dailyExpense = monthlyExpenses;
        const dailyIncome = monthlyIncome;

        forecast.push({
            date,
            projectedBalance: currentBalance + (dailyIncome - dailyExpense) * i,
            income: dailyIncome * i,
            expenses: dailyExpense * i,
        });
    }

    return forecast;
}

export function trackBudget(transactions, budgets) {
    const spending = calculateSpending(transactions, 'month');

    const budgetStatus = {};

    for (const [category, budgetAmount] of Object.entries(budgets)) {
        const spent = spending.byCategory[category] || 0;
        const remaining = budgetAmount - spent;
        const percentage = (spent / budgetAmount) * 100;

        budgetStatus[category] = {
            budget: budgetAmount,
            spent,
            remaining,
            percentage,
            status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good',
        };
    }

    return budgetStatus;
}

export function calculateSavingsProgress(currentAmount, goalAmount, monthlyContribution) {
    const remaining = goalAmount - currentAmount;
    const monthsToGoal = Math.ceil(remaining / monthlyContribution);
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + monthsToGoal);

    return {
        current: currentAmount,
        goal: goalAmount,
        remaining,
        percentage: (currentAmount / goalAmount) * 100,
        monthlyContribution,
        monthsToGoal,
        targetDate,
    };
}
