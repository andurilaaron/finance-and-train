import styles from './Card.module.css';

export default function Card({ children, className = '', hover = true, onClick }) {
    return (
        <div
            className={`${styles.card} ${hover ? styles.hover : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
