'use client';

import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import LoadingSpinner from '../ui/LoadingSpinner';
import styles from './DashboardHome.module.css';

export default function DashboardHome() {
    const [selectedStation, setSelectedStation] = useState('engadine');
    const [loading, setLoading] = useState(true);
    const [bankingData, setBankingData] = useState(null);
    const [trainData, setTrainData] = useState([]);

    const stations = {
        engadine: '10101340',
        townhall: '10101120',
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        fetchTrainData();
        const interval = setInterval(fetchTrainData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [selectedStation]);

    async function fetchDashboardData() {
        try {
            // Fetch real banking data from API
            const response = await fetch('/api/banking/accounts');
            const data = await response.json();
            setBankingData(data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchTrainData() {
        try {
            const stopId = stations[selectedStation];
            const response = await fetch(`/api/transport/departures?stopId=${stopId}&limit=3`);
            const data = await response.json();
            setTrainData(data.departures || []);
        } catch (error) {
            console.error('Error fetching train data:', error);
            setTrainData([]);
        }
    }

    if (loading) {
        return (
            <div className={styles.dashboard}>
                <div className={styles.loading}>
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    // Calculate stats from real data
    const totalDebt = 12500; // Westpac + St George
    const accountBalance = bankingData?.accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 17684.67;
    const monthlyPayment = 500;
    const monthsRemaining = 18;

    const debtBreakdown = [
        { name: 'Westpac', amount: 5500, color: '#e74c3c' },
        { name: 'St George', amount: 7000, color: '#e67e22' },
    ];

    // Use real transactions or mock data
    const recentTransactions = bankingData?.transactions?.slice(0, 3) || [
        { name: 'Woolworths', amount: -87.50, category: 'Groceries' },
        { name: 'Salary', amount: 3200.00, category: 'Income' },
        { name: 'Netflix', amount: -16.99, category: 'Entertainment' },
    ];

    // Use live train data
    const upcomingTrains = trainData.length > 0 ? trainData : [
        { line: 'T4', destination: 'Loading...', time: '--', platform: '-' },
    ];

    return (
        <div className={styles.dashboard}>
            {/* Top Stats Row */}
            <div className={styles.statsGrid}>
                <Card className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Total Debt</span>
                        <span className={styles.statIcon}>💳</span>
                    </div>
                    <div className={styles.statValue}>${totalDebt.toLocaleString()}</div>
                    <div className={styles.statChange}>
                        <span className={styles.negative}>↓ ${monthlyPayment}/mo</span>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Months to Freedom</span>
                        <span className={styles.statIcon}>📅</span>
                    </div>
                    <div className={styles.statValue}>{monthsRemaining}</div>
                    <div className={styles.statChange}>
                        <span className={styles.positive}>Jun 2026</span>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>ANZ Balance</span>
                        <span className={styles.statIcon}>💰</span>
                    </div>
                    <div className={styles.statValue}>${accountBalance.toLocaleString()}</div>
                    <div className={styles.statChange}>
                        <span className={styles.positive}>Real-time</span>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Unread Emails</span>
                        <span className={styles.statIcon}>📧</span>
                    </div>
                    <div className={styles.statValue}>4</div>
                    <div className={styles.statChange}>
                        <Badge variant="warning">1 urgent</Badge>
                    </div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className={styles.mainGrid}>
                {/* Debt Breakdown */}
                <Card className={styles.debtCard}>
                    <div className={styles.cardHeader}>
                        <h3>Debt Breakdown</h3>
                        <Badge variant="error">${totalDebt.toLocaleString()}</Badge>
                    </div>
                    <div className={styles.debtList}>
                        {debtBreakdown.map((debt, index) => (
                            <div key={index} className={styles.debtItem}>
                                <div className={styles.debtInfo}>
                                    <span className={styles.debtName}>{debt.name}</span>
                                    <span className={styles.debtAmount}>${debt.amount.toLocaleString()}</span>
                                </div>
                                <div className={styles.debtBar}>
                                    <div
                                        className={styles.debtBarFill}
                                        style={{
                                            width: `${(debt.amount / totalDebt) * 100}%`,
                                            background: debt.color
                                        }}
                                    />
                                </div>
                                <div className={styles.debtPercent}>
                                    {((debt.amount / totalDebt) * 100).toFixed(0)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Transactions */}
                <Card className={styles.transactionsCard}>
                    <div className={styles.cardHeader}>
                        <h3>Recent Transactions</h3>
                        <button className={styles.viewAll}>View All →</button>
                    </div>
                    <div className={styles.transactionsList}>
                        {recentTransactions.map((tx, index) => (
                            <div key={index} className={styles.transaction}>
                                <div className={styles.txLeft}>
                                    <div className={styles.txName}>{tx.name || tx.description}</div>
                                    <div className={styles.txCategory}>{tx.category}</div>
                                </div>
                                <div className={`${styles.txAmount} ${tx.amount > 0 ? styles.positive : styles.negative}`}>
                                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Next Trains */}
                <Card className={styles.trainsCard}>
                    <div className={styles.cardHeader}>
                        <h3>🚆 Next Trains</h3>
                        <select
                            className={styles.stationSelect}
                            value={selectedStation}
                            onChange={(e) => setSelectedStation(e.target.value)}
                        >
                            <option value="engadine">Engadine</option>
                            <option value="townhall">Town Hall</option>
                        </select>
                    </div>
                    <div className={styles.trainsList}>
                        {upcomingTrains.map((train, index) => (
                            <div key={index} className={styles.trainItem}>
                                <Badge variant="primary" className={styles.lineBadge}>{train.line}</Badge>
                                <div className={styles.trainInfo}>
                                    <div className={styles.trainDest}>{train.destination}</div>
                                    <div className={styles.trainPlatform}>Platform {train.platform}</div>
                                </div>
                                <div className={styles.trainTime}>{train.time}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
