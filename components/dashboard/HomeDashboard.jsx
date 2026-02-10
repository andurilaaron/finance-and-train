'use client';

import { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import styles from './HomeDashboard.module.css';

export default function HomeDashboard() {
    const [selectedStation, setSelectedStation] = useState('engadine');

    const stations = [
        { id: 'engadine', name: 'Engadine', stopId: '10101340' },
        { id: 'townhall', name: 'Town Hall', stopId: '10101120' },
    ];

    // Mock departures - will be replaced with real API
    const departures = [
        { id: 1, line: 'T4', destination: 'Bondi Junction', time: '5 min', platform: '1', status: 'on-time' },
        { id: 2, line: 'T4', destination: 'Waterfall', time: '12 min', platform: '2', status: 'on-time' },
        { id: 3, line: 'T4', destination: 'Bondi Junction', time: '20 min', platform: '1', status: 'on-time' },
        { id: 4, line: 'T4', destination: 'Waterfall', time: '27 min', platform: '2', status: 'delayed' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className="gradient-text">Welcome Back</h1>
                    <p className={styles.subtitle}>Your quick overview</p>
                </div>
                <div className={styles.time}>
                    {new Date().toLocaleTimeString('en-AU', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>

            {/* Quick Stats - Safe for public viewing */}
            <div className={styles.quickStats}>
                <Card className={styles.statCard}>
                    <div className={styles.statIcon}>📧</div>
                    <div className={styles.statInfo}>
                        <div className={styles.statValue}>4</div>
                        <div className={styles.statLabel}>Unread Emails</div>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statIcon}>✅</div>
                    <div className={styles.statInfo}>
                        <div className={styles.statValue}>2</div>
                        <div className={styles.statLabel}>Tasks Today</div>
                    </div>
                </Card>
            </div>

            {/* Train Schedule - Main Focus */}
            <div className={styles.trainSection}>
                <div className={styles.trainHeader}>
                    <h2 className="gradient-text">🚆 Next Trains</h2>
                    <select
                        className={styles.stationSelect}
                        value={selectedStation}
                        onChange={(e) => setSelectedStation(e.target.value)}
                    >
                        {stations.map(station => (
                            <option key={station.id} value={station.id}>
                                {station.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.departures}>
                    {departures.map((departure) => (
                        <Card key={departure.id} className={styles.departureCard}>
                            <div className={styles.departureContent}>
                                <div className={styles.departureLeft}>
                                    <Badge variant="primary" className={styles.lineBadge}>
                                        {departure.line}
                                    </Badge>
                                    <div className={styles.destination}>{departure.destination}</div>
                                </div>

                                <div className={styles.departureRight}>
                                    <div className={styles.time}>{departure.time}</div>
                                    <div className={styles.platform}>Platform {departure.platform}</div>
                                    {departure.status === 'on-time' ? (
                                        <Badge variant="success" className={styles.statusBadge}>On time</Badge>
                                    ) : (
                                        <Badge variant="warning" className={styles.statusBadge}>Delayed</Badge>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
