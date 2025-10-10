import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICE_ACCOUNT_FILE =
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH ||
  path.join(__dirname, "key.json");


const SCOPES = {
  readOnly: ["https://www.googleapis.com/auth/drive.readonly"],
  write: ["https://www.googleapis.com/auth/drive.file"],
};

/**
 * Returns an authenticated Google Drive client.
 * @param {"readOnly"|"write"} mode - choose permission level
 */
export default function getDriveClient(mode = "write") {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: SCOPES[mode] || SCOPES.write,
  });

  return google.drive({ version: "v3", auth });
}

