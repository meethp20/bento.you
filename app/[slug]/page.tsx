import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/core/models/User";
import ProfileClient from "@/components/profile/ProfileClient";

export default async function UserBentoPage({ params }: { params: Promise<{ slug: string }> }) {
    await dbConnect();

    // Await params for Next.js 15+
    const { slug } = await params;

    // Find user by username (case-insensitive for better UX?)
    // For now exact match to match creation logic
    const userDoc = await User.findOne({ username: slug }).lean();

    if (!userDoc) {
        return notFound();
    }

    // Check ownership
    const { userId } = await auth();
    const isOwner = userId === userDoc.clerkId;

    // Serialize Mongoose document to plain JSON
    // lean() returns a POJO but ObjectIDs need stringification
    const user = {
        username: userDoc.username,
        bio: userDoc.bio,
        avatar: userDoc.avatar,
        blocks: userDoc.blocks || [],
        theme: userDoc.theme || 'hero',
        email: userDoc.email,
        // We generally don't need the full object, just what the UI needs
    };


    return <ProfileClient user={user} isOwner={!!isOwner} />;
}
