// Debt Management and Payoff Calculator

export function calculateDebtPayoff(debts, monthlyPayment, strategy = 'avalanche') {
    // debts: [{ name, balance, interestRate, minimumPayment }]

    const sortedDebts = [...debts];

    if (strategy === 'avalanche') {
        // Highest interest rate first
        sortedDebts.sort((a, b) => b.interestRate - a.interestRate);
    } else if (strategy === 'snowball') {
        // Lowest balance first
        sortedDebts.sort((a, b) => a.balance - b.balance);
    }

    const timeline = [];
    let month = 0;
    let remainingDebts = sortedDebts.map(d => ({ ...d }));

    while (remainingDebts.some(d => d.balance > 0) && month < 360) { // Max 30 years
        month++;
        let availablePayment = monthlyPayment;

        // Pay minimums on all debts first
        for (const debt of remainingDebts) {
            if (debt.balance > 0) {
                const monthlyInterest = (debt.balance * (debt.interestRate / 100)) / 12;
                const minPayment = Math.min(debt.minimumPayment, debt.balance + monthlyInterest);

                debt.balance += monthlyInterest;
                debt.balance -= minPayment;
                availablePayment -= minPayment;

                if (debt.balance < 0) debt.balance = 0;
            }
        }

        // Apply extra payment to priority debt
        if (availablePayment > 0) {
            const priorityDebt = remainingDebts.find(d => d.balance > 0);
            if (priorityDebt) {
                const extraPayment = Math.min(availablePayment, priorityDebt.balance);
                priorityDebt.balance -= extraPayment;
            }
        }

        // Record snapshot
        timeline.push({
            month,
            debts: remainingDebts.map(d => ({
                name: d.name,
                balance: Math.max(0, d.balance),
            })),
            totalBalance: remainingDebts.reduce((sum, d) => sum + Math.max(0, d.balance), 0),
        });

        // Remove paid-off debts
        remainingDebts = remainingDebts.filter(d => d.balance > 0);
    }

    const totalInterestPaid = timeline.reduce((sum, snapshot) => {
        return sum + snapshot.debts.reduce((debtSum, debt) => {
            const original = debts.find(d => d.name === debt.name);
            return debtSum + (original ? (original.balance * (original.interestRate / 100) / 12) : 0);
        }, 0);
    }, 0);

    return {
        timeline,
        monthsToPayoff: month,
        totalInterestPaid,
        strategy,
    };
}

export function compareStrategies(debts, monthlyPayment) {
    const avalanche = calculateDebtPayoff(debts, monthlyPayment, 'avalanche');
    const snowball = calculateDebtPayoff(debts, monthlyPayment, 'snowball');

    return {
        avalanche: {
            months: avalanche.monthsToPayoff,
            interestPaid: avalanche.totalInterestPaid,
            savings: snowball.totalInterestPaid - avalanche.totalInterestPaid,
        },
        snowball: {
            months: snowball.monthsToPayoff,
            interestPaid: snowball.totalInterestPaid,
            quickWins: snowball.timeline.filter(t =>
                t.debts.some(d => d.balance === 0)
            ).length,
        },
    };
}

export function calculateSpendingImpact(currentDebts, monthlyPayment, newPurchase) {
    const baseline = calculateDebtPayoff(currentDebts, monthlyPayment, 'avalanche');

    // Add new purchase to highest interest debt
    const debtsWithPurchase = [...currentDebts];
    const highestRateDebt = debtsWithPurchase.reduce((max, debt) =>
        debt.interestRate > max.interestRate ? debt : max
    );
    highestRateDebt.balance += newPurchase;

    const withPurchase = calculateDebtPayoff(debtsWithPurchase, monthlyPayment, 'avalanche');

    return {
        delayDays: Math.round((withPurchase.monthsToPayoff - baseline.monthsToPayoff) * 30),
        extraInterest: withPurchase.totalInterestPaid - baseline.totalInterestPaid,
        newPayoffDate: new Date(Date.now() + withPurchase.monthsToPayoff * 30 * 24 * 60 * 60 * 1000),
    };
}

export function suggestOptimalPayment(debts, monthlyIncome) {
    const totalMinimums = debts.reduce((sum, d) => sum + d.minimumPayment, 0);
    const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0);

    // Suggest 20% of income toward debt if possible
    const suggested = Math.max(totalMinimums * 1.5, monthlyIncome * 0.2);

    const payoff12Months = calculateDebtPayoff(debts, totalBalance / 12, 'avalanche');
    const payoff24Months = calculateDebtPayoff(debts, totalBalance / 24, 'avalanche');

    return {
        minimum: totalMinimums,
        suggested: Math.round(suggested),
        aggressive: Math.round(totalBalance / 12), // Pay off in 1 year
        moderate: Math.round(totalBalance / 24), // Pay off in 2 years
        scenarios: {
            oneYear: {
                payment: Math.round(totalBalance / 12),
                interestPaid: payoff12Months.totalInterestPaid,
            },
            twoYears: {
                payment: Math.round(totalBalance / 24),
                interestPaid: payoff24Months.totalInterestPaid,
            },
        },
    };
}

export function getDebtAlerts(debts, recentTransactions, monthlyPayment) {
    const alerts = [];

    // Check if debt increased
    const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
    const recentCharges = recentTransactions
        .filter(t => t.amount < 0 && t.category !== 'debt_payment')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    if (recentCharges > monthlyPayment * 0.5) {
        alerts.push({
            type: 'warning',
            title: 'High Spending Alert',
            message: `Recent charges ($${recentCharges.toFixed(2)}) are offsetting your debt payments.`,
            action: 'Review spending categories',
        });
    }

    // Check for high interest
    const highInterestDebt = debts.filter(d => d.interestRate > 20);
    if (highInterestDebt.length > 0) {
        const monthlyInterest = highInterestDebt.reduce((sum, d) =>
            sum + (d.balance * (d.interestRate / 100) / 12), 0
        );

        alerts.push({
            type: 'error',
            title: 'High Interest Warning',
            message: `You're paying $${monthlyInterest.toFixed(2)}/month in interest on high-rate cards.`,
            action: 'Consider balance transfer or increase payments',
        });
    }

    // Positive progress
    const payoff = calculateDebtPayoff(debts, monthlyPayment, 'avalanche');
    if (payoff.monthsToPayoff <= 12) {
        alerts.push({
            type: 'success',
            title: 'Great Progress!',
            message: `At this rate, you'll be debt-free in ${payoff.monthsToPayoff} months!`,
            action: 'Keep it up',
        });
    }

    return alerts;
}
