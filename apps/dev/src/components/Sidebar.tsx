"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

export type SidebarProps = JSX.IntrinsicElements["aside"];

const links: { href: string; children: ReactNode }[] = [
  { href: "/", children: "Query" },
  { href: "/insertOne", children: "Insert one" },
  { href: "/insertMany", children: "Insert many" },
  { href: "/updateMany", children: "Update many" },
  { href: "/deleteMany", children: "Delete many" },
  { href: "/findOne", children: "Find one" },
  { href: "/findMany", children: "Find many" },
  { href: "/createEmbedding", children: "Create embedding" },
  { href: "/vectorSearch", children: "Vector search" },
  { href: "/chatCompletion", children: "Chat completion" },
  { href: "/createFileEmbeddings", children: "Create file embeddings" },
  { href: "/createAndInsertFileEmbeddings", children: "Create and insert file embeddings" }
];

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside {...props} className={clsx("border-r p-2", className)}>
      <h1 className="p-2 px-4 text-xl font-bold">SignleStore Elegance SDK</h1>

      <nav className="mt-8 flex flex-col">
        {links.map(link => {
          const isActive = link.href === pathname;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "rounded px-4 py-2",
                !isActive && "hover:bg-s2-indigo-50",
                isActive && "bg-s2-indigo-600 text-white"
              )}
            >
              {link.children}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
