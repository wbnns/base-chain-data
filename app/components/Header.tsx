import React from "react";

export default function Header() {
  return (
    <header className="bg-dark-surface text-dark-on-surface py-6 shadow-md">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-dark-primary">
          Base Chain Data
        </h1>
        <p className="text-xl mt-2 text-dark-secondary">
          View and download snapshot sizes for Base networks
        </p>
      </div>
    </header>
  );
}
