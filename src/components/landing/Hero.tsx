import Link from "next/link";
import { Button } from "@/components/ui/Button";
import styles from "./Hero.module.css";

export const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className="container">
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        Your <span className={styles.highlight}>NCET</span> Preparation Partner
                    </h1>
                    <p className={styles.subtitle}>
                        Master the NCET exam with our comprehensive study materials, mock tests, and expert guidance. Join thousands of students achieving their dreams.
                    </p>
                    <div className={styles.actions}>
                        <Link href="/signup">
                            <Button className={styles.ctaButton}>Get Started</Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline">Login</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
