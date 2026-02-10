'use client';

import { useState } from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose }) {
    const tabs = [
        { id: 'home', icon: '🏠', label: 'Home' },
        { id: 'debt', icon: '💳', label: 'Debt' },
        { id: 'banking', icon: '💰', label: 'Banking' },
        { id: 'emails', icon: '📧', label: 'Emails' },
        { id: 'transport', icon: '🚆', label: 'Transport' },
    ];

    return (
        <>
            {/* Overlay backdrop for mobile */}
            {isOpen && (
                <div className={styles.overlay} onClick={onClose}></div>
            )}

            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <span className={styles.logoIcon}>✨</span>
                    <span className={styles.logoText}>Assistant</span>
                </div>

                <nav className={styles.nav}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => onTabChange(tab.id)}
                        >
                            <span className={styles.navIcon}>{tab.icon}</span>
                            <span className={styles.navLabel}>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className={styles.footer}>
                    <div className={styles.user}>
                        <div className={styles.userAvatar}>AT</div>
                        <div className={styles.userName}>Andrew</div>
                    </div>
                </div>
            </aside>
        </>
    );
}
