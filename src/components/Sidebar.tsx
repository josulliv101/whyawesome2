import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  hub?: string;
  tagPrimary: string;
}

export function Sidebar({ className, hub, tagPrimary }: SidebarProps) {
  return (
    <div className={cn("w-[240px] pb-12 border-r", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Explore
          </h2>
          <div className="space-y-1">
            <Button
              variant={hub === "boston" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={`/boston/${tagPrimary}`}>Boston</Link>
            </Button>
            <Button
              variant={hub === "chicago" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={`/chicago/${tagPrimary}`}>Chicago</Link>
            </Button>
            <Button
              variant={hub === "new-york-city" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={`/new-york-city/${tagPrimary}`}>New York City</Link>
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
