import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { uploadToR2 } from "@/lib/r2";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Basic validation
    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size too large (max 5MB)" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Optimize image
    let optimizedBuffer: Buffer = buffer;
    let extension = file.type.split("/")[1] || "bin";
    let contentType = file.type;

    // Only process if it is an image
    if (file.type.startsWith("image/")) {
      try {
        optimizedBuffer = await sharp(buffer)
          .resize({ width: 1200, withoutEnlargement: true }) // Reasonable max width
          .webp({ quality: 80 })
          .toBuffer();
        extension = "webp";
        contentType = "image/webp";
      } catch (e) {
        console.warn("Image optimization failed, falling back to original", e);
        // Fallback to original buffer/type if sharp fails
      }
    }

    // Generate unique filename
    // Using randomUUID which is available in Node global crypto
    const uniqueId = crypto.randomUUID();
    const fileName = `${userId}/${uniqueId}.${extension}`; // Organize by user ID folder

    const url = await uploadToR2(optimizedBuffer, fileName, contentType);

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}
