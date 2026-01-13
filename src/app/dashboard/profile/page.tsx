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
                <h1 className="text-3xl font-black text-foreground">My Profile</h1>
                <p className="text-foreground mt-1 font-bold">Manage your account settings and preferences</p>
            </div>

            <Card className="overflow-hidden border-2 border-black bg-white shadow-2xl rounded-3xl">
                <div className="h-32 bg-primary relative border-b-2 border-black">
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 rounded-full bg-black p-1">
                            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-3xl font-black text-black border-4 border-black">
                                {user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-foreground">{user?.name || "User"}</h2>
                        <p className="text-foreground font-bold opacity-70">{user?.email}</p>
                        <span className="inline-block mt-3 px-4 py-1 bg-black text-white text-xs font-black rounded-full uppercase tracking-widest">
                            Premium Plan
                        </span>
                    </div>

                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                        <div className="space-y-6">
                            <h3 className="font-black text-foreground border-b-2 border-black pb-2 uppercase text-sm tracking-wider">Personal Details</h3>
                            <Input
                                label="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-white border-2 border-black font-bold"
                            />
                            <div className="space-y-1.5">
                                <label className="text-sm font-black text-foreground ml-1">Email</label>
                                <div className="px-4 py-3 rounded-xl bg-gray-50 border-2 border-black/10 text-black/50 font-bold cursor-not-allowed">
                                    {user?.email || ""}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-black text-foreground border-b-2 border-black pb-2 uppercase text-sm tracking-wider">Preferences</h3>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white border-2 border-black">
                                <span className="text-sm font-black text-foreground">Notifications</span>
                                <div className="w-12 h-6 bg-black rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <Button type="submit" isLoading={loading} className="w-full md:w-auto bg-primary text-black hover:bg-primary-hover font-black px-8 py-3 rounded-xl shadow-xl border-2 border-black transition-all transform hover:-translate-y-1">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}
