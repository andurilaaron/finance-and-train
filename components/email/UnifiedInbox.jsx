'use client';

import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import styles from './UnifiedInbox.module.css';

export default function UnifiedInbox() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, important, unread
    const [selectedEmail, setSelectedEmail] = useState(null);

    useEffect(() => {
        fetchAllEmails();
    }, []);

    async function fetchAllEmails() {
        try {
            // Mock data for now - will integrate with Gmail + Outlook APIs
            const mockEmails = [
                {
                    id: '1',
                    source: 'gmail',
                    from: 'boss@company.com',
                    fromName: 'Sarah Johnson',
                    subject: 'Q4 Report Due Friday - URGENT',
                    snippet: 'Please submit your quarterly report by end of day Friday...',
                    category: 'work',
                    priority: 'high',
                    unread: true,
                    hasAttachments: true,
                    date: new Date('2025-11-25T09:30:00'),
                    aiSuggestion: 'reply',
                    aiReason: 'Urgent deadline - requires response',
                },
                {
                    id: '2',
                    source: 'outlook',
                    from: 'noreply@netflix.com',
                    fromName: 'Netflix',
                    subject: 'New releases this week',
                    snippet: 'Check out these new shows and movies...',
                    category: 'entertainment',
                    priority: 'low',
                    unread: false,
                    hasAttachments: false,
                    date: new Date('2025-11-24T18:00:00'),
                    aiSuggestion: 'delete',
                    aiReason: 'Promotional content',
                },
                {
                    id: '3',
                    source: 'gmail',
                    from: 'statements@anz.com',
                    fromName: 'ANZ Bank',
                    subject: 'Your November statement is ready',
                    snippet: 'View your monthly statement and transaction history...',
                    category: 'finance',
                    priority: 'medium',
                    unread: true,
                    hasAttachments: true,
                    date: new Date('2025-11-24T08:00:00'),
                    aiSuggestion: 'file',
                    aiReason: 'Important financial document',
                    suggestedFolder: 'Bank Statements',
                },
                {
                    id: '4',
                    source: 'outlook',
                    from: 'friend@email.com',
                    fromName: 'Alex Chen',
                    subject: 'Coffee this weekend?',
                    snippet: 'Hey! Want to grab coffee on Saturday?',
                    category: 'personal',
                    priority: 'medium',
                    unread: true,
                    hasAttachments: false,
                    date: new Date('2025-11-23T16:45:00'),
                    aiSuggestion: 'reply',
                    aiReason: 'Personal message from friend',
                },
            ];

            setEmails(mockEmails);
        } catch (error) {
            console.error('Error fetching emails:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleAction(email, action) {
        console.log(`Action: ${action} on email:`, email.id);
        // Remove from list
        setEmails(emails.filter(e => e.id !== email.id));
    }

    const filteredEmails = emails.filter(email => {
        if (filter === 'important') return email.priority === 'high';
        if (filter === 'unread') return email.unread;
        return true;
    });

    const unreadCount = emails.filter(e => e.unread).length;
    const importantCount = emails.filter(e => e.priority === 'high').length;

    if (loading) {
        return (
            <Card>
                <div className={styles.loading}>
                    <LoadingSpinner />
                </div>
            </Card>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className="gradient-text">📬 Unified Inbox</h2>
                    <p className={styles.subtitle}>Gmail + Outlook</p>
                </div>
                <div className={styles.counts}>
                    <Badge variant="info">{unreadCount} unread</Badge>
                    {importantCount > 0 && (
                        <Badge variant="error">{importantCount} important</Badge>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <button
                    className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All ({emails.length})
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'important' ? styles.active : ''}`}
                    onClick={() => setFilter('important')}
                >
                    Important ({importantCount})
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'unread' ? styles.active : ''}`}
                    onClick={() => setFilter('unread')}
                >
                    Unread ({unreadCount})
                </button>
            </div>

            {/* Email List */}
            <div className={styles.emails}>
                {filteredEmails.length === 0 ? (
                    <Card>
                        <div className={styles.empty}>
                            <h3>🎉 Inbox Zero!</h3>
                            <p>You're all caught up</p>
                        </div>
                    </Card>
                ) : (
                    filteredEmails.map((email) => (
                        <Card key={email.id} className={`${styles.emailCard} ${email.unread ? styles.unread : ''}`}>
                            <div className={styles.emailHeader}>
                                <div className={styles.emailMeta}>
                                    <Badge variant={email.source === 'gmail' ? 'error' : 'info'} className={styles.sourceBadge}>
                                        {email.source}
                                    </Badge>
                                    <span className={styles.from}>{email.fromName}</span>
                                    {email.hasAttachments && <span className={styles.attachment}>📎</span>}
                                </div>
                                <span className={styles.time}>
                                    {email.date.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>

                            <div className={styles.subject}>{email.subject}</div>
                            <div className={styles.snippet}>{email.snippet}</div>

                            {/* AI Suggestion */}
                            <div className={styles.aiSuggestion}>
                                <div className={styles.aiLabel}>
                                    <span className={styles.aiIcon}>🤖</span>
                                    <span>AI suggests: <strong>{email.aiSuggestion}</strong></span>
                                </div>
                                <span className={styles.aiReason}>{email.aiReason}</span>
                            </div>

                            {/* Actions */}
                            <div className={styles.actions}>
                                {email.aiSuggestion === 'reply' && (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleAction(email, 'reply')}
                                    >
                                        ✉️ Reply
                                    </Button>
                                )}
                                {email.aiSuggestion === 'file' && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleAction(email, 'file')}
                                    >
                                        📁 File to {email.suggestedFolder}
                                    </Button>
                                )}
                                {email.aiSuggestion === 'delete' && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleAction(email, 'delete')}
                                    >
                                        🗑️ Delete
                                    </Button>
                                )}
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleAction(email, 'skip')}
                                >
                                    Skip
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Progress to Inbox Zero */}
            {emails.length > 0 && (
                <Card className={styles.progressCard}>
                    <div className={styles.progressHeader}>
                        <span>Progress to Inbox Zero</span>
                        <span className={styles.progressCount}>{emails.length} remaining</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${Math.max(5, (1 - emails.length / 10) * 100)}%` }}
                        />
                    </div>
                </Card>
            )}
        </div>
    );
}
