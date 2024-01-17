import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ServerSideComponentProp } from "@/lib/types";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";

const defaultLayout = [265, 440, 655];

export default function Page({
  params: { tags = [] },
}: ServerSideComponentProp<{ tags?: string[] }>) {
  const [hub, tagPrimary, ...tagsParam] = tags;
  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">
        Discover why things are awesome
        {hub ? (
          <>
            {" "}
            in <Badge>{hub}</Badge>
          </>
        ) : (
          ""
        )}
      </h2>
      <p className="text-md text-muted-foreground">
        Inclusion in the <em>why awesome</em> catalog is currently by invitation
        only.
      </p>
    </>
  );
}
