import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ size = 'md', className = '' }) {
    return (
        <div className={`${styles.spinner} ${styles[size]} ${className}`}>
            <div className={styles.circle}></div>
        </div>
    );
}
