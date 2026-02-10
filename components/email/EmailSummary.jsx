'use client';

import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import LoadingSpinner from '../ui/LoadingSpinner';
import styles from './EmailSummary.module.css';

export default function EmailSummary() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState('');

    useEffect(() => {
        fetchEmails();
    }, []);

    async function fetchEmails() {
        try {
            // This would fetch from Gmail API
            // For now, using mock data
            const mockEmails = [
                {
                    id: '1',
                    from: 'boss@company.com',
                    subject: 'Q4 Report Due Friday',
                    snippet: 'Please submit your quarterly report by end of day Friday...',
                    category: 'work',
                    priority: 'high',
                    unread: true,
                },
                {
                    id: '2',
                    from: 'netflix@netflix.com',
                    subject: 'New releases this week',
                    snippet: 'Check out these new shows and movies...',
                    category: 'entertainment',
                    priority: 'low',
                    unread: false,
                },
                {
                    id: '3',
                    from: 'bank@anz.com',
                    subject: 'Your monthly statement is ready',
                    snippet: 'View your November statement...',
                    category: 'finance',
                    priority: 'medium',
                    unread: true,
                },
            ];

            setEmails(mockEmails);
            setSummary('3 unread emails, 1 requires action by Friday');
        } catch (error) {
            console.error('Error fetching emails:', error);
        } finally {
            setLoading(false);
        }
    }

    function getCategoryColor(category) {
        const colors = {
            work: 'error',
            finance: 'warning',
            personal: 'info',
            entertainment: 'success',
        };
        return colors[category] || 'info';
    }

    function getPriorityIcon(priority) {
        if (priority === 'high') return '🔴';
        if (priority === 'medium') return '🟡';
        return '🟢';
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className="gradient-text">📧 Emails</h2>
                <Badge variant="info">{emails.filter(e => e.unread).length} unread</Badge>
            </div>

            {loading ? (
                <Card>
                    <div className={styles.loading}>
                        <LoadingSpinner />
                    </div>
                </Card>
            ) : (
                <>
                    {summary && (
                        <Card className={styles.summaryCard}>
                            <p className={styles.summary}>{summary}</p>
                        </Card>
                    )}

                    <div className={styles.emails}>
                        {emails.map((email) => (
                            <Card
                                key={email.id}
                                className={`${styles.emailCard} ${email.unread ? styles.unread : ''}`}
                            >
                                <div className={styles.emailHeader}>
                                    <div className={styles.from}>
                                        {getPriorityIcon(email.priority)}
                                        <span>{email.from}</span>
                                    </div>
                                    <Badge variant={getCategoryColor(email.category)}>
                                        {email.category}
                                    </Badge>
                                </div>
                                <div className={styles.subject}>{email.subject}</div>
                                <div className={styles.snippet}>{email.snippet}</div>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
