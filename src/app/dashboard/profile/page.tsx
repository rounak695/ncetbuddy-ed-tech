"use client";

import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

export default function ProfilePage() {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate update
        setTimeout(() => {
            setLoading(false);
            alert("Profile updated!");
        }, 1000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
                <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
            </div>

            <Card className="overflow-hidden border-white/10 bg-neutral-900">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 rounded-full bg-neutral-900 p-1">
                            <div className="w-full h-full rounded-full bg-yellow-400 flex items-center justify-center text-3xl font-bold text-black border-4 border-neutral-900">
                                {user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white">{user?.name || "User"}</h2>
                        <p className="text-gray-400">{user?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full">
                            Student Plan
                        </span>
                    </div>

                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-300 border-b border-white/10 pb-2">Personal Details</h3>
                            <Input
                                label="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-neutral-800 border-white/10"
                            />
                            <Input
                                label="Email"
                                value={user?.email || ""}
                                disabled
                                className="bg-neutral-800/50 border-white/5 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-300 border-b border-white/10 pb-2">Preferences</h3>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800 border border-white/5">
                                <span className="text-sm text-gray-300">Email Notifications</span>
                                <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <Button type="submit" isLoading={loading} className="w-full md:w-auto bg-white text-black hover:bg-gray-200">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}
