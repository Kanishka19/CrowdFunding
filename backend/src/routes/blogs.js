// Google Drive blog API route
import express from 'express';
import getDriveClient from '../helpers/gdrive_service.js';
const router = express.Router();

// Blog file names to fetch (now .json files)
const BLOG_FILES = [
  'Founders Journey.json',
  'Featured Story.json',
  'Latest Updates.json',
  'Guides & Tips.json',
  'Community Impact.json',
  'Call to Action.json'
];

// In-memory cache for blogs
let blogsCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper to get and parse JSON file content by name from 'blogs' folder (parallel fetch)
async function getBlogFiles(drive) {
  // Find the 'blogs' folder
  const folderRes = await drive.files.list({
    q: "name='Blogs' and mimeType='application/vnd.google-apps.folder'",
    fields: 'files(id)',
    spaces: 'drive'
  });
  if (!folderRes.data.files.length) throw new Error('Blogs folder not found');
  const folderId = folderRes.data.files[0].id;

  // Get files in the folder
  const filesRes = await drive.files.list({
    q: `'${folderId}' in parents`,
    fields: 'files(id, name)',
    spaces: 'drive'
  });
  const files = filesRes.data.files;

  // Fetch all blog files in parallel
  const fetchPromises = BLOG_FILES.map(async (fileName) => {
    const file = files.find(f => f.name === fileName);
    let stories = [];
    if (file) {
      try {
        const contentRes = await drive.files.get({
          fileId: file.id,
          alt: 'media'
        }, { responseType: 'text' });
        stories = JSON.parse(contentRes.data);
      } catch (e) {
        stories = [];
      }
    }
    return [fileName.replace('.json', ''), stories];
  });
  const results = await Promise.all(fetchPromises);
  return Object.fromEntries(results);
}

// GET /api/blogs
router.get('/', async (req, res) => {
  try {
    const now = Date.now();
    if (blogsCache && now - cacheTimestamp < CACHE_TTL) {
      return res.json(blogsCache);
    }
    const drive = getDriveClient("readOnly");
    const blogs = await getBlogFiles(drive);
    blogsCache = blogs;
    cacheTimestamp = now;
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
