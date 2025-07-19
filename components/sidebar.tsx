/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, shadowDepthPrimary } from "@/app/utils";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const navItems = [
  { label: "Portfolio", href: "https://somani09.github.io/portfolio/" },
  { label: "Projects", href: "https://vaibhav-somani.vercel.app/projects" },
];

const sidebarContainerClasses = cn(
  "flex h-max w-96 flex-col justify-center overflow-hidden rounded-r-4xl p-6",
  "bg-glass/20",
  "border-primary/10 border-2",
  "backdrop-blur-[6px]",
  shadowDepthPrimary,
);

const navLinkBaseClasses =
  "flex h-16 items-center rounded-2xl border px-8 py-2 text-lg transition";

const activeNavLinkClasses = cn(
  "bg-accent-2 border-secondary text-primary font-bold backdrop-blur-[6px] hover:border-accent-2 ",
  shadowDepthPrimary,
);

const inactiveNavLinkClasses =
  "bg-glass text-secondary border-primary hover:text-primary  hover:font-bold";

const Sidebar: React.FC<SidebarProps> = ({ className, onClose }) => {
  const pathname = usePathname();

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <aside ref={sidebarRef} className={cn(sidebarContainerClasses, className)}>
      <IoIosCloseCircleOutline
        onClick={() => onClose?.()}
        className="text-primary absolute top-14 right-4 h-6 w-6 cursor-pointer"
      />

      <div>
        <div className="flex items-center space-x-4">
          <div className="bg-secondary border-primary relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2">
            <img
              src="/avatar.jpeg"
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>{" "}
          <div>
            <p className="text-primary text-2xl font-bold">Vaibhav Somani</p>
            <p className="text-secondary text-lg font-semibold">
              Software Developer
            </p>
          </div>
        </div>

        <p className="text-text mt-4 text-base leading-relaxed">
          Full-Stack Software Engineer | 3+ years of experience | Master’s in
          CS, ASU | Expert in React.js, Next.js, TanStack, Tailwind, Figma |
          Bringing designs to life.
        </p>

        <hr className="border-accent-1 my-6 border-1" />

        <nav className="space-y-3">
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  navLinkBaseClasses,
                  isActive ? activeNavLinkClasses : inactiveNavLinkClasses,
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
