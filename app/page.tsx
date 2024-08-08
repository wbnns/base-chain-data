import { Metadata } from "next";
import SnapshotsTable from "./components/SnapshotsTable";

export const metadata: Metadata = {
  title: "Base Chain Data",
  description:
    "View and download the latest snapshot sizes for Base Testnet and Mainnet for Geth and Reth clients.",
  openGraph: {
    title: "Base Chain Data",
    description:
      "View and download the latest snapshot sizes for Base Testnet and Mainnet for Geth and Reth clients.",
    type: "website",
    url: "https://base-chain-data.vercel.app", // Replace with your actual URL
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Chain Data",
    description:
      "View and download the latest snapshot sizes for Base Testnet and Mainnet for Geth and Reth clients.",
  },
};

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold text-dark-primary mb-4">
        Snapshots
      </h2>
      <p className="mb-6 text-dark-secondary">
        This table shows the current sizes of various snapshots for Base Testnet
        and Mainnet along with the option to download.
      </p>
      <SnapshotsTable />
    </div>
  );
}
