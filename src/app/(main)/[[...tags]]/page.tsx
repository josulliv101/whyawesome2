import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  ServerSideComponentProp,
  TagDefinition,
  TagName,
  tagDefinitionList,
  tagDefinitionMap,
} from "@/lib/types";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { fetchEntities } from "@/lib/firebase";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import { tagDefinitions } from "@/lib/tags";
import { Skeleton } from "@/components/ui/skeleton";

const defaultLayout = [265, 440, 655];

export default async function Page({
  params: { tags = [] },
}: ServerSideComponentProp<{ tags?: string[] }>) {
  const [hub, tagPrimary = "person", ...tagsParam] = tags;
  const tagsBase = [hub, tagPrimary].filter((t) => !!t && t !== "all");
  await new Promise((r) => setTimeout(r, 3000));
  const ps = [
    fetchEntities(tagsBase.concat("comedian"), 8),
    fetchEntities(tagsBase.concat("musician"), 8),
    fetchEntities(tagsBase.concat("sports"), 8),
  ];
  // <Skeleton className="h-12 w-12 rounded-full" />
  const [[comedians, count], [musicians], [sports]] = await Promise.all(ps);
  return (
    <>
      <h2 className="flex items-center text-4xl font-semibold tracking-tight mb-1">
        Discover why {tagDefinitionMap[tagPrimary as TagName].plural} are
        awesome.
      </h2>
      <p className="text-lg text-muted-foreground mb-12">
        Inclusion in <>whyaweso.me's catalog</> is currently by invitation only
        &mdash; everyone can vote on why things are awesome.
      </p>

      <div className="">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Comedians
        </h2>
        <ScrollArea className="whitespace-nowrap rounded-md border bg-white mb-12">
          <div className="flex w-max space-x-4 p-4">
            {comedians.map((artwork, index) => (
              <figure key={artwork.id} className="shrink-0">
                <div className="relative overflow-hidden rounded-md">
                  <Image
                    src={artwork.pic}
                    alt={`Photo by ${artwork.name}`}
                    className="aspect-[3/4] h-fit w-fit object-cover"
                    width={150}
                    height={200}
                    priority={index < 6}
                  />
                </div>
                <figcaption className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                  <span className="text-foreground">{artwork.name}</span>
                  <Badge className="" variant={"outline"}>
                    {artwork.oinks}
                    <Image
                      alt="whyawesome logo"
                      width="16"
                      height="16"
                      src="/cute-mushroom.png"
                      className="ml-1"
                    />
                  </Badge>
                </figcaption>
              </figure>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Musicians
        </h2>
        <ScrollArea className="whitespace-nowrap rounded-md border bg-white mb-12">
          <div className="flex w-max space-x-4 p-4">
            {musicians.map((artwork) => (
              <figure key={artwork.id} className="shrink-0">
                <div className="overflow-hidden rounded-md">
                  <Image
                    src={artwork.pic}
                    alt={`Photo by ${artwork.name}`}
                    className="aspect-[3/4] h-fit w-fit object-cover"
                    width={150}
                    height={200}
                    priority
                  />
                </div>
                <figcaption className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                  <span className="text-foreground">{artwork.name}</span>
                  <Badge className="" variant={"outline"}>
                    {artwork.oinks}
                    <Image
                      alt="whyawesome logo"
                      width="16"
                      height="16"
                      src="/cute-mushroom.png"
                      className="ml-1"
                    />
                  </Badge>
                </figcaption>
              </figure>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="mb-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Sports</h2>
        <ScrollArea className="whitespace-nowrap rounded-md border bg-white mb-12">
          <div className="flex w-max space-x-4 p-4">
            {sports.map((artwork) => (
              <figure key={artwork.id} className="shrink-0">
                <div className="overflow-hidden rounded-md">
                  <Image
                    src={artwork.pic}
                    alt={`Photo by ${artwork.name}`}
                    className="aspect-[3/4] h-fit w-fit object-cover"
                    width={150}
                    height={200}
                  />
                </div>
                <figcaption className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                  <span className="text-foreground">{artwork.name}</span>
                  <Badge className="" variant={"outline"}>
                    {artwork.oinks}
                    <Image
                      alt="whyawesome logo"
                      width="16"
                      height="16"
                      src="/cute-mushroom.png"
                      className="ml-1"
                    />
                  </Badge>
                </figcaption>
              </figure>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}
