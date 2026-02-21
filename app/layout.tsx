import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ maxWidth: 460, margin: "0 auto", fontFamily: "Arial, sans-serif", padding: 16 }}>{children}</body>
    </html>
  );
}
