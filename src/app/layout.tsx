import type { Metadata } from "next";
import "./inter-font.css";
import "./globals.css";

// PLACEHOLDER: Replace Acme with your company name
// PLACEHOLDER: Replace Build something amazing with your main headline
// PLACEHOLDER: Replace The modern platform for teams who ship fast. with your product description
export const metadata: Metadata = {
  title: "Acme — Build something amazing",
  description: "The modern platform for teams who ship fast.",
  openGraph: {
    title: "Acme — Build something amazing",
    description: "The modern platform for teams who ship fast.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="inter-variable">
      <head>
        <link rel="preload" href="/fonts/inter/inter-baseline-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
