import { NextRequest, NextResponse } from "next/server";
import { stat, open } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const MIME_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePathSegments = params.path;
    if (!filePathSegments || filePathSegments.length === 0) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Sanitize and resolve file path inside public/uploads or public/
    const safePath = filePathSegments.map((s) => path.basename(s)).join("/");
    
    // Check in public/uploads first, then public/
    let fullPath = path.join(process.cwd(), "public", "uploads", safePath);
    let fileStat;

    try {
      fileStat = await stat(fullPath);
    } catch {
      // Fallback check in public/
      fullPath = path.join(process.cwd(), "public", safePath);
      try {
        fileStat = await stat(fullPath);
      } catch {
        return new NextResponse("Media file not found", { status: 404 });
      }
    }

    if (!fileStat.isFile()) {
      return new NextResponse("Not a file", { status: 400 });
    }

    const fileSize = fileStat.size;
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    const range = req.headers.get("range");

    if (range) {
      // Parse Range Header e.g. "bytes=0-1048575"
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize || start > end) {
        return new NextResponse("Requested Range Not Satisfiable", {
          status: 416,
          headers: {
            "Content-Range": `bytes */${fileSize}`,
          },
        });
      }

      const chunkSize = end - start + 1;
      const fileHandle = await open(fullPath, "r");
      const buffer = Buffer.alloc(chunkSize);
      await fileHandle.read(buffer, 0, chunkSize, start);
      await fileHandle.close();

      return new NextResponse(buffer, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // Full file response
    const fileHandle = await open(fullPath, "r");
    const buffer = await fileHandle.readFile();
    await fileHandle.close();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Length": fileSize.toString(),
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Media streaming error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
