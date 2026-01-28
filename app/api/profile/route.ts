import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/core/models/User";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const { username, bio, avatar, blocks, theme } = body;

    // Validate username if provided (basic regex)
    if (username && !/^[a-zA-Z0-9_-]+$/.test(username)) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      email: user.emailAddresses[0]?.emailAddress,
    };

    // Only update fields that are defined in the payload
    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (blocks) updateData.blocks = blocks;
    if (theme) updateData.theme = theme;

    // Upsert user: Update if exists, create if not
    // Note: If creating a NEW user here, 'username' is required.
    // If the user attempts to set a username that is taken by someone else, Mongo will throw a duplicate key error.

    // Check if username is taken by ANOTHER user
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser.clerkId !== userId) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 },
        );
      }
    }

    const dbUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json(dbUser);
  } catch (error: any) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  // Helper to get CURRENT user's profile if authenticated (for the editor)
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
