'use client';

import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import styles from './DebtTracker.module.css';

export default function DebtTracker() {
    const [debts, setDebts] = useState([
        {
            id: 1,
            name: 'Westpac Credit Card',
            balance: 5500,
            interestRate: 19.99,
            minimumPayment: 110,
            color: '#e74c3c',
        },
        {
            id: 2,
            name: 'St George Credit Card',
            balance: 7000,
            interestRate: 20.99,
            minimumPayment: 140,
            color: '#e67e22',
        },
    ]);

    const [monthlyPayment, setMonthlyPayment] = useState(500);
    const [payoffData, setPayoffData] = useState(null);

    useEffect(() => {
        calculatePayoff();
    }, [debts, monthlyPayment]);

    function calculatePayoff() {
        // Simple calculation for display
        const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
        const avgInterest = debts.reduce((sum, d) => sum + (d.balance * d.interestRate), 0) / totalDebt / 100;

        let balance = totalDebt;
        let months = 0;
        let totalInterest = 0;

        while (balance > 0 && months < 360) {
            const monthlyInterest = (balance * avgInterest) / 12;
            totalInterest += monthlyInterest;
            balance += monthlyInterest;
            balance -= monthlyPayment;
            months++;

            if (balance < 0) balance = 0;
        }

        const payoffDate = new Date();
        payoffDate.setMonth(payoffDate.getMonth() + months);

        setPayoffData({
            months,
            totalInterest,
            payoffDate,
            totalDebt,
        });
    }

    const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
    const totalMinimum = debts.reduce((sum, d) => sum + d.minimumPayment, 0);
    const progress = ((totalDebt - (payoffData?.totalDebt || totalDebt)) / totalDebt) * 100;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className="gradient-text">💳 Debt Destroyer</h2>
                <Badge variant="error">${totalDebt.toFixed(2)}</Badge>
            </div>

            {/* Progress Overview */}
            <Card className={styles.progressCard}>
                <div className={styles.progressHeader}>
                    <div>
                        <h3>Total Debt</h3>
                        <p className={styles.debtAmount}>${totalDebt.toLocaleString()}</p>
                    </div>
                    <div className={styles.payoffInfo}>
                        <span className={styles.label}>Debt-Free Date</span>
                        <span className={styles.date}>
                            {payoffData?.payoffDate.toLocaleDateString('en-AU', {
                                month: 'short',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${Math.max(5, 100 - progress)}%` }}
                    />
                </div>

                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>Months to Freedom</span>
                        <span className={styles.statValue}>{payoffData?.months || 0}</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>Total Interest</span>
                        <span className={styles.statValue}>${payoffData?.totalInterest.toFixed(0) || 0}</span>
                    </div>
                </div>
            </Card>

            {/* Individual Debts */}
            <div className={styles.debts}>
                {debts.map((debt) => (
                    <Card key={debt.id} className={styles.debtCard}>
                        <div className={styles.debtHeader}>
                            <div className={styles.debtInfo}>
                                <h4>{debt.name}</h4>
                                <Badge variant="warning">{debt.interestRate}% APR</Badge>
                            </div>
                            <div className={styles.debtBalance}>
                                ${debt.balance.toLocaleString()}
                            </div>
                        </div>

                        <div className={styles.debtBar}>
                            <div
                                className={styles.debtFill}
                                style={{
                                    width: `${(debt.balance / totalDebt) * 100}%`,
                                    background: debt.color,
                                }}
                            />
                        </div>

                        <div className={styles.debtFooter}>
                            <span className={styles.minimum}>
                                Min: ${debt.minimumPayment}/mo
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Payment Adjuster */}
            <Card className={styles.paymentCard}>
                <h4>Monthly Payment</h4>
                <div className={styles.paymentSlider}>
                    <input
                        type="range"
                        min={totalMinimum}
                        max={2000}
                        step={50}
                        value={monthlyPayment}
                        onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                        className={styles.slider}
                    />
                    <div className={styles.paymentValue}>
                        ${monthlyPayment}
                        <span className={styles.perMonth}>/month</span>
                    </div>
                </div>

                {monthlyPayment <= totalMinimum && (
                    <div className={styles.warning}>
                        ⚠️ Paying only minimums will take {payoffData?.months} months!
                    </div>
                )}

                {monthlyPayment > totalMinimum * 2 && (
                    <div className={styles.success}>
                        🎉 Great! You'll save ${((payoffData?.totalInterest || 0) * 0.3).toFixed(0)} in interest!
                    </div>
                )}
            </Card>

            {/* Quick Actions */}
            <div className={styles.actions}>
                <Button variant="primary" size="sm">
                    Log Payment
                </Button>
                <Button variant="secondary" size="sm">
                    Update Balances
                </Button>
            </div>
        </div>
    );
}
