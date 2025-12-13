"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { account, databases } from "@/lib/appwrite";
import { Models } from "appwrite";
import { useRouter } from "next/navigation";

// Define User Type based on Appwrite Account + Custom Preferences/Document
interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    role: "user" | "admin" | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [role, setRole] = useState<"user" | "admin" | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await account.get();
                setUser(session);

                // Fetch User Role from Database (collection 'users')
                // Assuming we store role in a 'users' collection with document ID = user ID
                try {
                    const userDoc = await databases.getDocument(
                        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db',
                        'users',
                        session.$id
                    );
                    setRole(userDoc.role as "user" | "admin");
                } catch (error) {
                    console.warn("User document not found, defaulting to user role.");
                    setRole("user");
                }

            } catch (error) {
                // No session
                setUser(null);
                setRole(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            setRole(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
