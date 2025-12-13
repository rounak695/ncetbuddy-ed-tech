"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import styles from "./Layout.module.css"; // We'll create this

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>NCET Buddy</div>
                <nav className={styles.nav}>
                    <Link href="/dashboard" className={styles.navItem}>Dashboard</Link>
                    <Link href="/dashboard/books" className={styles.navItem}>Books</Link>
                    <Link href="/dashboard/notes" className={styles.navItem}>Notes</Link>
                    <Link href="/dashboard/tests" className={styles.navItem}>Mock Tests</Link>
                    <Link href="/dashboard/leaderboard" className={styles.navItem}>Leaderboard</Link>
                    <Link href="/dashboard/profile" className={styles.navItem}>Profile</Link>
                </nav>
            </aside>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
