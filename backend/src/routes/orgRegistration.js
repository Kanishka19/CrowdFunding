import express from 'express'
import multer from 'multer'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();
const storage = multer.memoryStorage();
const upload =multer({storage})


router.post('/registerOrg', async (req, res) => {

    const { orgName, registrationNumber, organizationType, dateOfEstablishment, cityStatePincode, websiteOrSocialLinks, officialEmail, contactNumbers, authorizedRepresentativeDetails } = req.body;

    const existingOrg = await OrgRegistry.findOne({ orgName });
    if (existingOrg) {
        return res.status(400).json({ error: 'Organization name already exists' });
    }

    const newOrg = new OrgRegistry({
        orgName,
        registrationNumber,
        organizationType,
        dateOfEstablishment,
        address,
        cityStatePincode,
        websiteOrSocialLinks,
        officialEmail,
        contactNumbers,
        authorizedRepresentativeDetails
    });
    await newOrg.save();
    res.status(201).json({ orgId: newOrg._id });
});


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.IAM_ACCESS_KEY,
    secretAccessKey: process.env.IAM_SECRET_KEY,
  },
});

router.post("/uploadOrg", upload.array("files", 3), async (req, res) => {
  try {
    const { orgId } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Upload all files
    const uploaded = await Promise.all(
      files.map(async (file) => {
        const key = `${orgId}/${uuidv4()}-${file.originalname}`;

        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        return {
          fileName: file.originalname,
          s3Key: key,
          url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        };
      })
    );

    res.status(200).json({
      message: "Files uploaded successfully!",
      uploadedFiles: uploaded,
    });
  } catch (err) {
    console.error("Error uploading to S3:", err);
    res.status(500).json({ message: "Failed to upload", error: err.message });
  }
});

export default router;
