import { NextResponse } from 'next/server';
import { databases, DB_ID } from '@/lib/server/appwrite-admin';
import { ID, Query, Permission, Role } from 'node-appwrite';

// Helper to ensure collection exists with correct attributes
async function ensureBannerCollection() {
    try {
        await databases.getCollection(DB_ID, 'banners');
    } catch (error: any) {
        if (error.code === 404) {
            console.log("Creating banners collection...");
            await databases.createCollection(
                DB_ID,
                'banners',
                'Carousel Banners',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.any()),
                    Permission.update(Role.any()),
                    Permission.delete(Role.any()),
                ]
            );

            // Create attributes
            const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

            await databases.createStringAttribute(DB_ID, 'banners', 'title', 255, true);
            await delay(1000);
            await databases.createStringAttribute(DB_ID, 'banners', 'imageUrl', 1024, true);
            await delay(1000);
            await databases.createStringAttribute(DB_ID, 'banners', 'linkUrl', 1024, false);
            await delay(1000);
            await databases.createBooleanAttribute(DB_ID, 'banners', 'isActive', true, true);
            await delay(1000);
            await databases.createIntegerAttribute(DB_ID, 'banners', 'order', true, 0);
            await delay(1000);
            await databases.createIntegerAttribute(DB_ID, 'banners', 'createdAt', true);
            await delay(1000);
        }
    }
}

export async function GET() {
    try {
        await ensureBannerCollection();
        const response = await databases.listDocuments(DB_ID, 'banners', [
            Query.orderAsc('order')
        ]);
        return NextResponse.json(response.documents.map(doc => ({ id: doc.$id, ...doc })));
    } catch (error: any) {
        console.error("API Error (Banners GET):", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await ensureBannerCollection();
        const body = await request.json();

        const response = await databases.createDocument(
            DB_ID,
            'banners',
            ID.unique(),
            {
                ...body,
                createdAt: body.createdAt || Math.floor(Date.now() / 1000)
            }
        );

        return NextResponse.json({ id: response.$id, ...response });
    } catch (error: any) {
        console.error("API Error (Banners POST):", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, ...data } = await request.json();
        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        const response = await databases.updateDocument(DB_ID, 'banners', id, data);
        return NextResponse.json(response);
    } catch (error: any) {
        console.error("API Error (Banners PATCH):", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await databases.deleteDocument(DB_ID, 'banners', id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("API Error (Banners DELETE):", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
