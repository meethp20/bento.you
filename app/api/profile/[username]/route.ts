import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/core/models/User";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    await dbConnect();

    // Await params as required in newer Next.js versions
    const { username } = await params;

    const user = await User.findOne({ username: username });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return public data
    return NextResponse.json({
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      blocks: user.blocks,
      layouts: user.layouts,
      theme: user.theme,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
