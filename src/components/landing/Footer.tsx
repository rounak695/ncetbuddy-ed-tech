import Link from "next/link";
import styles from "./Footer.module.css";

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.section}>
                        <h3 className={styles.logo}>NCET Buddy</h3>
                        <p className={styles.description}>
                            Your one-stop destination for NCET exam preparation.
                        </p>
                    </div>
                    <div className={styles.section}>
                        <h4 className={styles.heading}>Quick Links</h4>
                        <ul className={styles.links}>
                            <li><Link href="/login">Login</Link></li>
                            <li><Link href="/signup">Sign Up</Link></li>
                            <li><Link href="/#features">Features</Link></li>
                        </ul>
                    </div>
                    <div className={styles.section}>
                        <h4 className={styles.heading}>Legal</h4>
                        <ul className={styles.links}>
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                            <li><Link href="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.copyright}>
                    &copy; {new Date().getFullYear()} NCET Buddy. All rights reserved.
                </div>
            </div>
        </footer>
    );
};
