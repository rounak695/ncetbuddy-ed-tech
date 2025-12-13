

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import styles from "@/components/admin/AdminSidebar.module.css";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div style={{ display: "flex" }}>
            <AdminSidebar />
            <main className={styles.mainContent} style={{ flex: 1 }}>
                {children}
            </main>
        </div>
    );
}
