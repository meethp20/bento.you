import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { deleteFromR2 } from "@/lib/r2";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Attempt to extract the key from the URL.
    // Assuming structure: https://domain/__userId__/__filename__
    // We strictly enforce that the key must start with the userId to prevent unauthorized deletions.

    // 1. Get the path part
    let path = "";
    try {
      const u = new URL(url);
      // pathname usually starts with /, remove it
      path = u.pathname.substring(1);
    } catch {
      // if not a full URL, assume it's the key directly?
      // Safer to assume full URL as that's what we store.
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    // 2. Decode URI component in case of spaces etc, though R2 urls might be clean
    path = decodeURIComponent(path);

    // 3. Security check: User can only delete files in their own folder
    if (!path.startsWith(`${userId}/`)) {
      return NextResponse.json(
        {
          error: "Unauthorized: Cannot delete files not belonging to this user",
        },
        { status: 403 },
      );
    }

    // 4. Perform deletion
    await deleteFromR2(path);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: error.message || "Delete failed" },
      { status: 500 },
    );
  }
}
