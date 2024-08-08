import { NextResponse } from "next/server";

type Snapshot = {
  network: string;
  client: string;
  type: string;
  size: string;
  url: string;
};

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockSnapshots: Snapshot[] = [
    {
      network: "Testnet",
      client: "Geth",
      type: "Full",
      size: "123.45 GB",
      url: "https://sepolia-full-snapshots.base.org/",
    },
    {
      network: "Testnet",
      client: "Geth",
      type: "Archive",
      size: "456.78 GB",
      url: "https://sepolia-archive-snapshots.base.org/",
    },
    {
      network: "Testnet",
      client: "Reth",
      type: "Archive",
      size: "789.01 GB",
      url: "https://sepolia-reth-archive-snapshots.base.org/",
    },
    {
      network: "Mainnet",
      client: "Geth",
      type: "Full",
      size: "234.56 GB",
      url: "https://mainnet-full-snapshots.base.org/",
    },
    {
      network: "Mainnet",
      client: "Geth",
      type: "Archive",
      size: "567.89 GB",
      url: "https://mainnet-archive-snapshots.base.org/",
    },
    {
      network: "Mainnet",
      client: "Reth",
      type: "Archive",
      size: "890.12 GB",
      url: "https://mainnet-reth-archive-snapshots.base.org/",
    },
  ];

  return NextResponse.json(mockSnapshots);
}
