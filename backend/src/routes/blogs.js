import express from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const router = express.Router();

// Configure S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.IAM_ACCESS_KEY,
    secretAccessKey: process.env.IAM_SECRET_KEY,
  },
});

// S3 Bucket name
const BUCKET = process.env.BLOG_BUCKET_NAME;

// Blog file names in S3
const BLOG_FILES = [
  "Founders Journey.json",
  "Featured Story.json",
  "Latest Updates.json",
  "Guides & Tips.json",
  "Community Impact.json",
  "CallToAction.json",
];

// In-memory caching
let blogsCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Convert S3 file stream to string
async function bodyToString(stream) {
  return new Promise((resolve, reject) => {
    let data = "";
    stream.on("data", (chunk) => {
      data += chunk.toString();
    });
    stream.on("end", () => resolve(data));
    stream.on("error", reject);
  });
}

// Fetch and parse a single JSON file from S3
async function fetchJsonFromS3(key) {
  try {
    const resp = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );
    const text = await bodyToString(resp.Body);
    return text ? JSON.parse(text) : {};
  } catch (err) {
    console.error(`❌ Error reading ${key}:`, err.message);
    return {}; // Return empty object if file missing or invalid
  }
}


async function getBlogFilesFromS3() {
  if (!BUCKET) throw new Error("BLOG_BUCKET_NAME env var is required");

  const promises = BLOG_FILES.map(async (fileName) => {
    const jsonData = await fetchJsonFromS3(fileName);
    return [fileName.replace(".json", ""), jsonData];
  });

  const result = await Promise.all(promises);
  return Object.fromEntries(result);
}

router.get("/", async (req, res) => {
  try {
    const now = Date.now();

    if (blogsCache && now - cacheTimestamp < CACHE_TTL) {
      return res.json(blogsCache); // Use cache if fresh
    }

    const blogsDict = await getBlogFilesFromS3();
    blogsCache = blogsDict;
    cacheTimestamp = now;

    return res.json(blogsDict);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
