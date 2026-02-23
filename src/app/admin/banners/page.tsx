"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getBanners, createBanner, updateBanner, deleteBanner } from "@/lib/appwrite-db";
import { CarouselBanner } from "@/types";
import { Plus, Trash2, Edit2, Check, X, MoveUp, MoveDown } from "lucide-react";

export default function BannersAdminPage() {
    const [banners, setBanners] = useState<CarouselBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        imageUrl: "",
        linkUrl: "",
        isActive: true,
        order: 0
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const data = await getBanners();
            setBanners(data);
        } catch (error) {
            console.error("Failed to fetch banners:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        try {
            await createBanner({
                title: formData.title,
                imageUrl: formData.imageUrl,
                linkUrl: formData.linkUrl || undefined,
                isActive: formData.isActive,
                order: formData.order,
                createdAt: Math.floor(Date.now() / 1000)
            });
            setIsAdding(false);
            resetForm();
            fetchBanners();
        } catch (error) {
            alert("Failed to add banner");
        }
    };

    const handleUpdate = async (id: string, updates: Partial<CarouselBanner>) => {
        try {
            await updateBanner(id, updates);
            setEditingId(null);
            fetchBanners();
        } catch (error) {
            alert("Failed to update banner");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;
        try {
            await deleteBanner(id);
            fetchBanners();
        } catch (error) {
            alert("Failed to delete banner");
        }
    };

    const moveOrder = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === banners.length - 1) return;

        const bannerToMove = banners[index];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        const targetBanner = banners[swapIndex];

        // Swap orders locally temporarily, then update DB
        const newOrder1 = targetBanner.order;
        const newOrder2 = bannerToMove.order;

        try {
            await updateBanner(bannerToMove.id!, { order: newOrder1 });
            await updateBanner(targetBanner.id!, { order: newOrder2 });
            fetchBanners();
        } catch (error) {
            alert("Failed to reorder banners");
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            imageUrl: "",
            linkUrl: "",
            isActive: true,
            order: banners.length // Default to end of list
        });
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1>Manage Carousel Banners</h1>
                <Button
                    onClick={() => {
                        resetForm();
                        setIsAdding(!isAdding);
                    }}
                >
                    {isAdding ? "Cancel" : <><Plus size={18} style={{ marginRight: '8px' }} /> Add Banner</>}
                </Button>
            </div>

            {isAdding && (
                <Card style={{ marginBottom: "2rem", padding: "1.5rem" }}>
                    <h3>Add New Banner</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                        <Input
                            placeholder="Banner Title/Description"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <Input
                            placeholder="Image URL (hosted)"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        />
                        <Input
                            placeholder="Link URL (optional)"
                            value={formData.linkUrl}
                            onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                Active (Show on Dashboard)
                            </label>
                            <Input
                                type="number"
                                placeholder="Order (0, 1, 2...)"
                                value={formData.order.toString()}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                style={{ width: "100px" }}
                            />
                        </div>
                        <Button onClick={handleAdd} disabled={!formData.title || !formData.imageUrl}>
                            Save Banner
                        </Button>
                    </div>
                </Card>
            )}

            {loading ? (
                <p>Loading banners...</p>
            ) : banners.length === 0 ? (
                <Card style={{ textAlign: "center", padding: "3rem" }}>
                    <p style={{ color: "var(--text-secondary)" }}>No banners configured yet.</p>
                </Card>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {banners.map((banner, index) => (
                        <Card key={banner.id} style={{ display: "flex", gap: "1.5rem", padding: "1rem", alignItems: "center" }}>
                            {/* Order Controls */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <button
                                    onClick={() => moveOrder(index, 'up')}
                                    disabled={index === 0}
                                    style={{ background: 'none', border: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', color: index === 0 ? '#444' : '#fff' }}
                                >
                                    <MoveUp size={20} />
                                </button>
                                <span style={{ textAlign: "center", fontWeight: "bold", fontSize: "0.9rem" }}>{banner.order}</span>
                                <button
                                    onClick={() => moveOrder(index, 'down')}
                                    disabled={index === banners.length - 1}
                                    style={{ background: 'none', border: 'none', cursor: index === banners.length - 1 ? 'not-allowed' : 'pointer', color: index === banners.length - 1 ? '#444' : '#fff' }}
                                >
                                    <MoveDown size={20} />
                                </button>
                            </div>

                            {/* Image Preview */}
                            <div style={{ width: "160px", height: "80px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#333", flexShrink: 0 }}>
                                {banner.imageUrl ? (
                                    <img src={banner.imageUrl} alt={banner.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>Invalid Image</div>
                                )}
                            </div>

                            {/* Details */}
                            <div style={{ flex: 1 }}>
                                {editingId === banner.id ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        <Input
                                            defaultValue={banner.title}
                                            onChange={(e) => banner.title = e.target.value}
                                        />
                                        <Input
                                            defaultValue={banner.imageUrl}
                                            onChange={(e) => banner.imageUrl = e.target.value}
                                        />
                                        <Input
                                            defaultValue={banner.linkUrl}
                                            placeholder="Link URL (optional)"
                                            onChange={(e) => banner.linkUrl = e.target.value}
                                        />
                                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <input
                                                type="checkbox"
                                                defaultChecked={banner.isActive}
                                                onChange={(e) => banner.isActive = e.target.checked}
                                            />
                                            Active
                                        </label>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 style={{ margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            {banner.title}
                                            {!banner.isActive && <span style={{ fontSize: "0.7rem", padding: "2px 6px", backgroundColor: "#444", borderRadius: "4px" }}>Inactive</span>}
                                        </h3>
                                        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", wordBreak: "break-all" }}>
                                            Img: {banner.imageUrl}
                                        </p>
                                        {banner.linkUrl && (
                                            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--primary)", wordBreak: "break-all" }}>
                                                Link: {banner.linkUrl}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {editingId === banner.id ? (
                                    <>
                                        <Button
                                            style={{ padding: "0.5rem" }}
                                            onClick={() => handleUpdate(banner.id!, {
                                                title: banner.title,
                                                imageUrl: banner.imageUrl,
                                                linkUrl: banner.linkUrl,
                                                isActive: banner.isActive
                                            })}
                                        >
                                            <Check size={18} />
                                        </Button>
                                        <Button style={{ padding: "0.5rem", backgroundColor: "#444" }} onClick={() => setEditingId(null)}>
                                            <X size={18} />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button style={{ padding: "0.5rem", backgroundColor: "#334155" }} onClick={() => setEditingId(banner.id!)}>
                                            <Edit2 size={18} />
                                        </Button>
                                        <Button style={{ padding: "0.5rem", backgroundColor: "#ef4444" }} onClick={() => handleDelete(banner.id!)}>
                                            <Trash2 size={18} />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
