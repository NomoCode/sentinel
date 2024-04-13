import SupabaseParent from "@/components/supabase/ParentWrapper";
import { ReduxProvider } from "@/redux/Provider";
import type { Metadata } from "next";

import "../styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sentinelmod.com"),
  title: "Sentinel | Game Moderation",
  keywords: "Game moderation, Moderation, Security",
  description: "Game Moderation",
  openGraph: {
    type: "website",
    title: "SentinelMod.com",
    description: "Automated Discord Management",
    url: "https://sentinelmod.com",
    images: [{url: "https://cdn.sideforge.io/Sentinel/Frame%201.png", width: 600, height: 400, alt: "image"}]
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <SupabaseParent>
        <html lang="en">
          <body>{children}</body>
        </html>
      </SupabaseParent>
    </ReduxProvider>
  );
}
