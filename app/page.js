'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHome from '@/components/dashboard/DashboardHome';
import AccountSummary from '@/components/banking/AccountSummary';
import DebtTracker from '@/components/debt/DebtTracker';
import LiveTimetable from '@/components/transport/LiveTimetable';
import UnifiedInbox from '@/components/email/UnifiedInbox';
import styles from './page.module.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className={styles.appContainer}>
      <button
        className={styles.hamburger}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className={styles.mainContent}>
        {activeTab === 'home' && <DashboardHome />}
        {activeTab === 'debt' && <DebtTracker />}
        {activeTab === 'banking' && <AccountSummary />}
        {activeTab === 'emails' && <UnifiedInbox />}
        {activeTab === 'transport' && <LiveTimetable />}
      </main>
    </div>
  );
}
