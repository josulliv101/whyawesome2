"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTags } from "./useTags";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { config } from "@/lib/config";

export default function Foobar() {
  const [hub, primaryTag, isTagsPage] = useTags();
  console.log("latest", hub, primaryTag);

  const { tags: [_, primaryTag2] = [] } = useParams();
  const [tag, setTag] = useState(primaryTag || config.defaultPrimaryTag);

  if (!isTagsPage) {
    return null;
  }
  console.log("Foobar render()");
  return (
    <Tabs
      key={primaryTag}
      value={primaryTag2 || tag}
      className="h-full space-y-6 "
    >
      <div className="space-between flex items-center">
        <TabsList>
          <TabsTrigger value="person">
            <Link href={`/${hub}/person`} className="relative">
              People
            </Link>
          </TabsTrigger>
          <TabsTrigger value="place">
            <Link href={`/${hub}/place`} className="relative">
              Places
            </Link>
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
}
