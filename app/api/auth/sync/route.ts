import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/core/models/User";

export async function POST() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // specific fallback for username if not set in metadata/clerk
    // We try to use their clerk username, or part of email, or just clerk ID as fallback
    let username = user.username;
    if (!username) {
      username = user.emailAddresses[0]?.emailAddress?.split("@")[0];
    }
    // Final fallback to avoid null username which is required
    if (!username) {
      username = `user_${userId.substring(0, 8)}`;
    }

    // Ensure uniqueness handled by Mongo (unique index), but we might want retry logic or "claim" logic at onboarding
    // For sync, we just try to ensure a record exists.

    // Check if user exists first to avoid overwriting existing data with defaults if valid
    const existingUser = await User.findOne({ clerkId: userId });

    if (existingUser) {
      // Update basic info that might have changed in Clerk (like avatar)
      existingUser.email = user.emailAddresses[0]?.emailAddress;
      existingUser.avatar = existingUser.avatar || user.imageUrl; // Only set if missing in DB? Or sync always? User might have custom avatar in Bento. Let's keep Bento one if set.
      await existingUser.save();
      return NextResponse.json(existingUser);
    }

    // Create new user
    // We need to handle potential username collision here if we are auto-generating
    // Simpler approach: Create with what we have, if error, frontend sends them to onboarding to pick username.

    // Actually, for "Sign Up", we usually want them to go to onboarding.
    // This sync might be best for logging in existing users or silent creation.

    const newUser = await User.create({
      clerkId: userId,
      username: username, // This might fail if taken!
      email: user.emailAddresses[0]?.emailAddress,
      avatar: user.imageUrl,
      blocks: [],
      theme: "hero",
    });

    return NextResponse.json(newUser);
  } catch (error: any) {
    console.error("Error syncing user:", error);

    // If duplicate key error (username taken), return specific code so frontend can redirect to Rename/Onboarding
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Username taken", code: "USERNAME_TAKEN" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
