"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import styles from "./Layout.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (role !== "admin") {
                router.push("/dashboard"); // Redirect non-admins to user dashboard
            }
        }
    }, [user, role, loading, router]);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    if (!user || role !== "admin") {
        return null;
    }

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>NCET Admin</div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navItem}>Dashboard</Link>
                    <Link href="/admin/users" className={styles.navItem}>Users</Link>
                    <Link href="/admin/content" className={styles.navItem}>Content</Link>
                    <Link href="/admin/tests" className={styles.navItem}>Tests</Link>
                </nav>
            </aside>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
