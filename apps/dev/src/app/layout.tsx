import "../styles/globals.css";
import { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "SignleStore Elegance SDK"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full min-w-[320px] max-w-full overflow-y-auto overflow-x-hidden bg-white text-black">
        <Sidebar className="h-screen min-w-fit" />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
