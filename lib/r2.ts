import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // Optional custom domain

if (
  !R2_ACCOUNT_ID ||
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_BUCKET_NAME
) {
  // Determine which keys are missing
  const missing = [];
  if (!R2_ACCOUNT_ID) missing.push("R2_ACCOUNT_ID");
  if (!R2_ACCESS_KEY_ID) missing.push("R2_ACCESS_KEY_ID");
  if (!R2_SECRET_ACCESS_KEY) missing.push("R2_SECRET_ACCESS_KEY");
  if (!R2_BUCKET_NAME) missing.push("R2_BUCKET_NAME");

  // Only throw in production or when actually trying to upload
  console.warn(
    `Missing R2 Environment Variables: ${missing.join(", ")}. Image uploads will fail.`,
  );
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<string> {
  if (!R2_BUCKET_NAME) throw new Error("R2_BUCKET_NAME is not defined");

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    // ACL: 'public-read', // R2 doesn't support ACLs like S3, access is controlled by Bucket settings
  });

  try {
    await r2Client.send(command);

    // Construct public URL
    if (R2_PUBLIC_URL) {
      return `${R2_PUBLIC_URL}/${fileName}`;
    } else {
      // Fallback to r2.dev subdomain if not custom domain,
      // BUT user needs to enable "Public Access" in R2 dashboard to get a ".r2.dev" subdomain
      return `https://pub-${R2_ACCOUNT_ID}.r2.dev/${fileName}`;
      // Note: The 'pub-...' part is actually unique per bucket public access setting,
      // so R2_PUBLIC_URL is highly recommended to be set manually.
    }
  } catch (error) {
    console.error("Error uploading to R2:", error);
    throw error;
  }
}

export async function deleteFromR2(fileName: string): Promise<void> {
  if (!R2_BUCKET_NAME) throw new Error("R2_BUCKET_NAME is not defined");

  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
  });

  try {
    await r2Client.send(command);
  } catch (error) {
    console.error("Error deleting from R2:", error);
    throw error;
  }
}
