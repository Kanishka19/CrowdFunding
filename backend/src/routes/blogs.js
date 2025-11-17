import express from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import nodemailer from "nodemailer";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

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

// Configure nodemailer transporter for real email delivery
const createEmailTransporter = () => {
  // Try SendGrid first, fallback to Gmail
  if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your-sendgrid-api-key-here') {
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else {
    // Fallback to Gmail
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
};

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

// Submit blog via email
router.post("/submit", upload.single("image"), async (req, res) => {
  try {
    console.log("📧 Blog submission received");
    console.log("📝 Title:", req.body.title);
    console.log("👤 Author:", req.body.author);
    console.log("✉️ User Email:", req.body.email);
    console.log("🖼️ Image:", req.file ? req.file.originalname : "No image");
    
    const { title, category, summary, content, author, email } = req.body;
    const image = req.file;

    // Validate required fields
    if (!title || !content) {
      console.log("❌ Validation failed: Missing title or content");
      return res.status(400).json({ error: "Title and content are required" });
    }

    console.log("🔧 Creating email transporter...");
    const transporter = createEmailTransporter();
    console.log("✅ Email transporter created successfully");

    // Prepare email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #694F8E; text-align: center;">New Blog Submission</h2>
        
        <div style="background-color: #f5e6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #694F8E; margin-top: 0;">📝 ${title}</h3>
          ${category ? `<p><strong>Category:</strong> ${category}</p>` : ''}
          ${summary ? `<p><strong>Summary:</strong> ${summary}</p>` : ''}
        </div>
        
        <div style="margin: 20px 0;">
          <h4 style="color: #694F8E;">Content:</h4>
          <div style="background-color: #fff; padding: 15px; border-left: 4px solid #694F8E; white-space: pre-wrap;">
            ${content}
          </div>
        </div>
        
        <div style="background-color: #ece8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #694F8E; margin-top: 0;">Author Information:</h4>
          <p><strong>Name:</strong> ${author || 'Anonymous'}</p>
          ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 15px; background-color: #f0f0f0; border-radius: 8px;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            This blog submission was sent from the CrowdFunding platform.<br>
            Submitted on: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `;

    // Prepare email options - Use verified admin email as sender
    const mailOptions = {
      from: `"CrowdFunding Blog System" <${process.env.ADMIN_EMAIL}>`,
      replyTo: email || process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `📝 New Blog Submission from ${author || 'Anonymous'}: "${title}"`,
      html: emailHtml,
      attachments: [],
    };

    // Add image attachment if provided
    if (image) {
      mailOptions.attachments.push({
        filename: image.originalname,
        content: image.buffer,
        contentType: image.mimetype,
      });
    }

    console.log("📮 Sending email...");
    console.log("📧 From:", `"${author || 'CrowdFunding User'}" <${email || 'noreply@crowdfunding.com'}>`);
    console.log("📧 To:", process.env.ADMIN_EMAIL);
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("📬 Message ID:", info.messageId);

    // Get preview URL for development
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("🔗 Preview URL:", previewUrl);

    return res.json({ 
      success: true, 
      message: "Blog submission sent successfully! Check the console for preview URL.",
      previewUrl: previewUrl,
      messageId: info.messageId
    });
    
  } catch (err) {
    console.error("❌ Error sending blog submission email:", err);
    return res.status(500).json({ 
      error: "Failed to send blog submission. Please try again later.",
      details: err.message 
    });
  }
});

export default router;