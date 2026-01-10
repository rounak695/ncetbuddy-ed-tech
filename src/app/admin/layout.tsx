"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import styles from "@/components/admin/AdminSidebar.module.css";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === "/admin/login") {
            setChecking(false);
            setIsAuthenticated(true);
            return;
        }

        // Check if admin is authenticated
        const authStatus = localStorage.getItem("admin_authenticated");
        const loginTime = localStorage.getItem("admin_login_time");

        // Session expires after 24 hours
        const sessionDuration = 24 * 60 * 60 * 1000;
        const isSessionValid = loginTime && (Date.now() - parseInt(loginTime)) < sessionDuration;

        if (authStatus === "true" && isSessionValid) {
            setIsAuthenticated(true);
        } else {
            // Clear expired session
            localStorage.removeItem("admin_authenticated");
            localStorage.removeItem("admin_login_time");
            router.push("/admin/login");
        }
        setChecking(false);
    }, [pathname, router]);

    // Show nothing while checking auth
    if (checking) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0f0f0f"
            }}>
                <p style={{ color: "#888" }}>Loading...</p>
            </div>
        );
    }

    // For login page, don't show sidebar
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // If not authenticated, don't render anything (redirect will happen)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div style={{ display: "flex" }}>
            <AdminSidebar />
            <main className={styles.mainContent} style={{ flex: 1 }}>
                {children}
            </main>
        </div>
    );
}
