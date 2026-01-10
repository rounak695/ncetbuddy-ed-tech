"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Notification } from "@/types";
import { getNotifications, createNotification } from "@/lib/appwrite-db";

export default function NotificationsManagerPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState<'info' | 'alert' | 'success'>('info');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!title || !message) {
            alert("Please fill in title and message.");
            return;
        }

        try {
            await createNotification({
                title,
                message,
                type,
                createdAt: Math.floor(Date.now() / 1000)
            });
            alert("Notification sent successfully!");
            setTitle("");
            setMessage("");
            fetchNotifications();
        } catch (error) {
            console.error("Error sending notification:", error);
            alert("Failed to send notification.");
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{ marginBottom: "2rem" }}>Notifications Manager</h1>

            <Card style={{ marginBottom: "2rem" }}>
                <h3 style={{ marginBottom: "1.5rem" }}>Send New Notification</h3>
                <Input label="Title" placeholder="e.g. New Mock Test Live!" value={title} onChange={(e) => setTitle(e.target.value)} />

                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Message</label>
                    <textarea
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "var(--surface)", color: "white", border: "1px solid #333", minHeight: "100px" }}
                        placeholder="Enter notification message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Type</label>
                    <select
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "var(--surface)", color: "white", border: "1px solid #333" }}
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                    >
                        <option value="info">Info (Blue)</option>
                        <option value="success">Success (Green)</option>
                        <option value="alert">Alert (Red)</option>
                    </select>
                </div>

                <Button onClick={handleSend} style={{ width: "100%" }}>Send Notification</Button>
            </Card>

            <h3 style={{ marginBottom: "1rem" }}>Recent Notifications</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
                {notifications.map((notif) => (
                    <Card key={notif.id} style={{ borderLeft: `4px solid ${notif.type === 'alert' ? 'var(--error)' : notif.type === 'success' ? 'var(--success)' : 'var(--primary)'}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                            <div>
                                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{notif.title}</h4>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{notif.message}</p>
                            </div>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                {new Date(notif.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </Card>
                ))}
                {!loading && notifications.length === 0 && (
                    <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>No notifications sent yet.</p>
                )}
            </div>
        </div>
    );
}
