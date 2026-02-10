'use client';

import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import LoadingSpinner from '../ui/LoadingSpinner';
import styles from './AccountSummary.module.css';

export default function AccountSummary() {
    const [accounts, setAccounts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, []);

    async function fetchAccounts() {
        try {
            const response = await fetch('/api/banking/accounts');
            const data = await response.json();
            setAccounts(data.accounts);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <Card>
                <div className={styles.loading}>
                    <LoadingSpinner />
                </div>
            </Card>
        );
    }

    const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className="gradient-text">Accounts</h2>
                <Badge variant="success">${totalBalance.toFixed(2)}</Badge>
            </div>

            <div className={styles.accounts}>
                {accounts?.map((account) => (
                    <Card key={account.id} className={styles.accountCard}>
                        <div className={styles.accountInfo}>
                            <div className={styles.accountName}>
                                <span>{account.name}</span>
                                <Badge variant="info">{account.type}</Badge>
                            </div>
                            <div className={styles.accountNumber}>{account.accountNumber}</div>
                        </div>
                        <div className={styles.balance}>
                            <span className={styles.currency}>{account.currency}</span>
                            <span className={styles.amount}>${account.balance.toFixed(2)}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
