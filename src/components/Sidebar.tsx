"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { cn, getHubColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  hub?: string;
  tagPrimary: string;
}

export function Sidebar({ className, hub, tagPrimary }: SidebarProps) {
  const segment = useSelectedLayoutSegment() || "";

  const [hubSegment, primaryTagSegment = "person"] = segment.split("/");

  return (
    <div className={cn("hidden lg:block w-[240px] pb-12 border-r", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Explore Cities
          </h2>
          <div className="space-y-1">
            <Button
              variant={hub === "boston" ? "secondary" : "ghost"}
              className="relative w-full justify-start items-center"
              asChild
            >
              <div className="w-full">
                <Link
                  className="w-full h-[40px] flex items-center"
                  href={`/boston/${primaryTagSegment}`}
                >
                  Boston
                </Link>
                <div
                  className={`${getHubColor(
                    "boston"
                  )} rounded-full w-4 h-4 absolute right-4 hidden`}
                />
              </div>
            </Button>
            <Button
              variant={hub === "chicago" ? "secondary" : "ghost"}
              className="relative w-full justify-start"
              asChild
            >
              <div className="w-full">
                <Link className="w-full" href={`/chicago/${primaryTagSegment}`}>
                  Chicago
                </Link>
                <div
                  className={`${getHubColor(
                    "chicago"
                  )} rounded-full w-4 h-4 absolute right-4 hidden`}
                />
              </div>
            </Button>
            <Button
              variant={hub === "new-york-city" ? "secondary" : "ghost"}
              className="relative w-full justify-start"
              asChild
            >
              <div className="w-full">
                <Link
                  className="w-full"
                  href={`/new-york-city/${primaryTagSegment}`}
                >
                  New York City
                </Link>
                <div
                  className={`${getHubColor(
                    "new-york-city"
                  )}  rounded-full w-4 h-4 absolute right-4 hidden`}
                />
              </div>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Explore Colleges
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href={`/tufts-university/person`}>Tufts University</Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Admin
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href={`/admin/new`}>Add New Profile</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href={`/admin/tags`}>Manage Tags</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
