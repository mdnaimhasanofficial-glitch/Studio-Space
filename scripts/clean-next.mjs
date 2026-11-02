// Prebuild cleanup for Windows/OneDrive setups.
// The default `next build` wipes .next itself, but when a running
// `npm run dev` (or OneDrive sync) holds files open, the wipe fails with a
// cryptic "EPERM: operation not permitted, unlink ...". This script removes
// .next first and explains the fix if something is still locked.
import fs from "node:fs";

try {
  fs.rmSync(new URL("../.next", import.meta.url), {
    recursive: true,
    force: true,
    maxRetries: 3,
    retryDelay: 300,
    // Node's rmSync retries handle transient locks (AV scanners, OneDrive).
  });
  console.log("Cleaned .next build cache.");
} catch (error) {
  console.error(
    "\nCould not remove the .next cache — some files are locked.\n\n" +
      "Most likely your `npm run dev` server is still running.\n" +
      "  1. Stop it (Ctrl+C in its terminal), then run `npm run build` again.\n" +
      "  2. If OneDrive is syncing this folder, right-click the OneDrive\n" +
      "     tray icon and choose \"Pause syncing\" before building.\n",
  );
  console.error(error);
  process.exit(1);
}
