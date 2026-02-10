'use client';

import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import LoadingSpinner from '../ui/LoadingSpinner';
import styles from './LiveTimetable.module.css';

export default function LiveTimetable() {
    const [departures, setDepartures] = useState([]);
    const [selectedStation, setSelectedStation] = useState('10101100'); // Central Station
    const [loading, setLoading] = useState(true);
    const [stations] = useState([
        { id: '10101100', name: 'Central' },
        { id: '10101120', name: 'Town Hall' },
        { id: '10101121', name: 'Wynyard' },
        { id: '10101122', name: 'Circular Quay' },
    ]);

    useEffect(() => {
        fetchDepartures();
        const interval = setInterval(fetchDepartures, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [selectedStation]);

    async function fetchDepartures() {
        try {
            const response = await fetch(`/api/transport/departures?stopId=${selectedStation}`);
            const data = await response.json();
            setDepartures(data.departures || []);
        } catch (error) {
            console.error('Error fetching departures:', error);
        } finally {
            setLoading(false);
        }
    }

    function getTimeUntil(departureTime) {
        const now = new Date();
        const departure = new Date(departureTime);
        const diff = Math.floor((departure - now) / 1000 / 60);

        if (diff < 0) return 'Departed';
        if (diff === 0) return 'Now';
        if (diff < 60) return `${diff} min`;
        return departure.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
    }

    function getDelayBadge(delay) {
        if (delay === 0) return <Badge variant="success">On time</Badge>;
        if (delay > 0) return <Badge variant="warning">+{delay} min</Badge>;
        return <Badge variant="info">{delay} min</Badge>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className="gradient-text">🚆 Sydney Trains</h2>
                <select
                    className={styles.stationSelect}
                    value={selectedStation}
                    onChange={(e) => setSelectedStation(e.target.value)}
                >
                    {stations.map(station => (
                        <option key={station.id} value={station.id}>{station.name}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <Card>
                    <div className={styles.loading}>
                        <LoadingSpinner />
                    </div>
                </Card>
            ) : (
                <div className={styles.departures}>
                    {departures.length === 0 ? (
                        <Card>
                            <p className={styles.noDepartures}>No upcoming departures</p>
                        </Card>
                    ) : (
                        departures.map((departure, index) => (
                            <Card key={index} className={styles.departureCard}>
                                <div className={styles.departureInfo}>
                                    <div className={styles.route}>
                                        <Badge variant="primary">{departure.routeId || 'T1'}</Badge>
                                        <span className={styles.destination}>Platform {index + 1}</span>
                                    </div>
                                    <div className={styles.time}>
                                        <span className={styles.countdown}>{getTimeUntil(departure.scheduledTime)}</span>
                                        {getDelayBadge(departure.delay / 60)}
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
