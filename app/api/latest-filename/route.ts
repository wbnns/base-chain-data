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
    const response = await fetch(url + "latest");
    const content = await response.text();
    const lines = content.split("\n").filter((line) => line.trim() !== "");
    const fileName = lines[lines.length - 1].trim();

    return NextResponse.json({ fileName });
  } catch (error) {
    console.error("Error fetching latest file name:", error);
    return NextResponse.json(
      { error: "Unable to fetch the latest filename" },
      { status: 500 }
    );
  }
}
