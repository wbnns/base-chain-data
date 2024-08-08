"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaDownload, FaSync, FaInfoCircle } from "react-icons/fa";

type Snapshot = {
  network: string;
  client: string;
  type: string;
  size: string;
  url: string;
  age: string;
  error?: string;
};

const formatSize = (size: string): string => {
  const match = size.match(/^([\d.]+)\s*(GB|TB)$/);
  if (match) {
    const [, value, unit] = match;
    const numericValue = parseFloat(value);
    if (unit === "GB" && numericValue >= 1000) {
      return `${(numericValue / 1000).toFixed(2)} TB`;
    }
    if (unit === "TB") {
      return `${numericValue.toFixed(2)} TB`;
    }
  }
  return size;
};

export default function SnapshotsTable() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSnapshots = useCallback(async (updateState = true) => {
    if (updateState) setLoading(true);
    setError(null);
    const apiUrl = "/api/snapshots";

    try {
      const response = await fetch(apiUrl, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch snapshots");
      }
      const data = await response.json();
      const formattedData = data.map((snapshot: Snapshot) => ({
        ...snapshot,
        size: formatSize(snapshot.size),
      }));
      if (updateState) {
        setSnapshots(formattedData);
        setLoading(false);
      }
      localStorage.setItem(
        "snapshots",
        JSON.stringify({ data: formattedData, timestamp: Date.now() })
      );
      return formattedData;
    } catch (error) {
      console.error("Error fetching snapshots:", error);
      setError("Failed to load snapshots. Please try again.");
      if (updateState) setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("snapshots");
    if (storedData) {
      try {
        const { data, timestamp } = JSON.parse(storedData);
        if (Array.isArray(data)) {
          setSnapshots(data);
          setLoading(false);
          const isStale = Date.now() - timestamp > 5 * 60 * 1000; // 5 minutes
          if (isStale) {
            fetchSnapshots(false).then((newData) => {
              if (newData && Array.isArray(newData)) setSnapshots(newData);
            });
          }
        } else {
          throw new Error("Cached data is not an array");
        }
      } catch (error) {
        console.error("Error parsing cached data:", error);
        fetchSnapshots();
      }
    } else {
      fetchSnapshots();
    }

    // Set up periodic refresh
    const intervalId = setInterval(() => {
      fetchSnapshots(false).then((newData) => {
        if (newData && Array.isArray(newData)) setSnapshots(newData);
      });
    }, 60000); // Refresh every minute

    return () => clearInterval(intervalId);
  }, [fetchSnapshots]);

  const handleRefresh = () => {
    fetchSnapshots();
  };

  const handleDownload = (snapshot: Snapshot) => {
    const downloadUrl = `/api/download?url=${encodeURIComponent(snapshot.url)}`;
    window.location.href = downloadUrl;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-dark-secondary flex items-center">
          <FaInfoCircle className="mr-2" />
          Note: Actual download size may vary slightly due to network conditions
          and file updates.
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 bg-dark-primary text-dark-bg rounded hover:bg-dark-accent transition-colors duration-150"
          disabled={loading}
        >
          <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
      {error && (
        <div className="bg-dark-error text-dark-on-bg p-4 rounded mb-4">
          {error}
        </div>
      )}
      <div className="overflow-x-auto shadow-lg rounded-lg mb-8">
        <table className="min-w-full bg-dark-surface">
          <thead>
            <tr className="bg-dark-bg text-dark-on-bg">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Network
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Download
              </th>
            </tr>
          </thead>
          <tbody className="bg-dark-surface divide-y divide-gray-700">
            {snapshots.length > 0 ? (
              snapshots.map((snapshot, index) => (
                <tr
                  key={index}
                  className="hover:bg-dark-bg transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-on-surface">
                    {snapshot.network}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-on-surface">
                    {snapshot.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-on-surface">
                    {snapshot.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-on-surface">
                    {snapshot.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-on-surface">
                    {snapshot.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-on-surface">
                    {snapshot.error ? (
                      <span className="text-dark-error">{snapshot.error}</span>
                    ) : (
                      <button
                        onClick={() => handleDownload(snapshot)}
                        className="text-dark-accent hover:text-dark-primary transition-colors duration-150 cursor-pointer"
                      >
                        <FaDownload className="inline mr-2" />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 whitespace-nowrap text-sm text-dark-on-surface text-center"
                >
                  {loading ? "Loading snapshots..." : "No snapshots available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
