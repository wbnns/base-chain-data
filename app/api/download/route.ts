import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch the latest filename
    const latestResponse = await fetch(url + "latest");
    const latestFileName = await latestResponse.text();
    const fileUrl = url + latestFileName.trim();

    // Fetch file headers to get the correct Content-Length
    const headResponse = await fetch(fileUrl, { method: "HEAD" });
    const contentLength = headResponse.headers.get("content-length");
    const contentType = headResponse.headers.get("content-type");

    // Fetch the actual file
    const fileResponse = await fetch(fileUrl);
    const fileName = fileUrl.split("/").pop() || "snapshot.tar.zst";

    // Set appropriate headers for file download
    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
    if (contentType) headers.set("Content-Type", contentType);
    if (contentLength) headers.set("Content-Length", contentLength);

    // Stream the response
    const { readable, writable } = new TransformStream();
    fileResponse.body?.pipeTo(writable);

    return new NextResponse(readable, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}
