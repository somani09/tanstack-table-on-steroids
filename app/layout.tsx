import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientRoot from "./client-root";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata = {
  title:
    "Advanced React Table with Drag, Pinning & Resizing | TanStack Table Showcase",
  description:
    "A highly interactive data table built with TanStack Table v8, featuring column pinning, drag-and-drop reordering, resizing, selection, and full keyboard accessibility. Built using Next.js, Tailwind CSS, and @dnd-kit.",
  keywords: [
    "React Table",
    "TanStack Table",
    "Drag and Drop",
    "Column Pinning",
    "Resizable Columns",
    "Interactive Table",
    "Next.js",
    "Tailwind CSS",
    "@dnd-kit",
    "TypeScript",
    "Open Source Table UI",
    "Vaibhav Somani",
    "Vaibhav Somani Portfolio",
    "Vaibhav Somani Projects",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "TanStack Table Showcase – Advanced React Table",
    description:
      "Explore a powerful and customizable data table built with TanStack Table v8, featuring drag-and-drop, column pinning, resizing, and accessibility features.",
    url: "https://tanstack-table-on-steroids.vercel.app/",
    siteName: "TanStack Table Showcase",
    type: "website",
    images: [
      {
        url: "/table.png",
        width: 1200,
        height: 630,
        alt: "TanStack Table Showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TanStack Table Showcase – Interactive Drag, Pin & Resize",
    description:
      "An advanced, accessible React table UI built using TanStack Table v8 and @dnd-kit. Supports drag-to-reorder, column pinning, resizing, and more.",
    images: ["/table.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${plusJakarta.className} antialiased`}>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
