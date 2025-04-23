import { NextResponse } from "next/server";
import axios from "axios";

type Snapshot = {
  network: string;
  client: string;
  type: string;
  size: string;
  url: string;
  age: string;
  latestFileName: string;
};

function calculateAge(timestamp: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 GB";

  // Convert bytes to GB with 2 decimal places
  const gb = (bytes / (1024 * 1024 * 1024)).toFixed(2);
  return `${gb} GB`;
}

export async function GET() {
  const snapshots = [
    {
      network: "Testnet",
      client: "Geth",
      type: "Full",
      url: "https://sepolia-full-snapshots.base.org/",
    },
    {
      network: "Testnet",
      client: "Reth",
      type: "Archive",
      url: "https://sepolia-reth-archive-snapshots.base.org/",
    },
    {
      network: "Mainnet",
      client: "Geth",
      type: "Full",
      url: "https://mainnet-full-snapshots.base.org/",
    },
    {
      network: "Mainnet",
      client: "Reth",
      type: "Archive",
      url: "https://mainnet-reth-archive-snapshots.base.org/",
    },
  ];

  const results = await Promise.all(
    snapshots.map(async (snapshot) => {
      try {
        // Get the latest filename
        const latestResponse = await axios.get(`${snapshot.url}latest`);
        const latestFileName = latestResponse.data.trim();

        // Get the file size using HEAD request
        const headResponse = await axios.head(
          `${snapshot.url}${latestFileName}`
        );
        const contentLength = headResponse.headers["content-length"];

        if (!contentLength) {
          throw new Error("No content-length header found");
        }

        const fileSize = parseInt(contentLength);

        // Extract timestamp from filename (assuming format like 'base-sepolia-full-1234567890.tar.zst')
        const timestamp = parseInt(
          latestFileName.split("-").pop().split(".")[0]
        );
        const age = calculateAge(timestamp * 1000); // Convert to milliseconds

        return {
          ...snapshot,
          size: formatFileSize(fileSize),
          age,
          latestFileName,
        };
      } catch (error) {
        console.error(`Error fetching ${snapshot.url}:`, error);
        return {
          ...snapshot,
          size: "Error",
          age: "Unknown",
          latestFileName: "Error",
        };
      }
    })
  );

  return NextResponse.json(results);
}
