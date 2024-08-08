import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-dark-bg text-dark-on-bg`}
      >
        <header className="bg-dark-surface shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-dark-primary">
              Base Chain Data
            </h1>
          </div>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="w-full h-1 bg-gradient-to-r from-dark-primary via-dark-accent to-dark-secondary"></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
