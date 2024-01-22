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
import { DrillDownNav } from "@/components/DrillDownNav";

const defaultLayout = [265, 440, 655];

export default async function Page({
  params: { tags = [] },
}: ServerSideComponentProp<{ tags?: string[] }>) {
  const [hub = "all", tagPrimary = "place", ...tagsParam] = tags;
  const tagsBase = [hub, tagPrimary].filter((t) => !!t && t !== "all");
  await new Promise((r) => setTimeout(r, 0));
  const ps =
    tagPrimary === "person"
      ? [
          fetchEntities(tagsBase.concat("comedian"), 8),
          fetchEntities(tagsBase.concat("musician"), 8),
          fetchEntities(tagsBase.concat("sports"), 8),
        ]
      : [
          fetchEntities(tagsBase.concat("museum"), 8),
          fetchEntities(tagsBase.concat("nature"), 8),
          fetchEntities(tagsBase.concat("college"), 8),
        ];
  // <Skeleton className="h-12 w-12 rounded-full" />
  const [[comedians, count], [musicians], [sports]] = await Promise.all(ps);

  return (
    <>
      <div className="flex items-center mb-10 justify-between space-x-4">
        <Tabs
          value={tagPrimary ? tagPrimary : "person"}
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
        </Tabs>{" "}
        <DrillDownNav tagPrimary={tagPrimary as TagName} />
      </div>

      <h2 className="flex items-center text-4xl font-semibold tracking-tight mb-1">
        Discover what&#39;s awesome about{" "}
        {tagDefinitionMap[tagPrimary as TagName].plural}.
      </h2>
      <p className="text-lg text-muted-foreground mb-6">
        Inclusion in the what&#39;s awesome catalog is by invitation only.
        Everyone can vote on what&#39;s awesome.
      </p>
      <div className="hidden flex items-center justify-end pb-0"></div>
      {tagPrimary === "person" && (
        <>
          <div className="">
            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              Comedians
            </h2>
            <ScrollArea className="whitespace-nowrap rounded-md border bg-white mb-12">
              <div className="flex w-max space-x-4 p-4">
                {comedians.map((artwork, index) => (
                  <figure key={artwork.id} className="shrink-0">
                    <div className="relative overflow-hidden rounded-md bg-blue-500">
                      <Image
                        src={artwork.pic}
                        alt={`Photo by ${artwork.name}`}
                        className="aspect-square h-fit w-fit object-cover object-top   transition-all duration-1000 opacity-80 hover:opacity-100"
                        width={150}
                        height={150}
                        priority={index < 6}
                      />
                    </div>
                    <figcaption className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                      <Link
                        href={`/admin/edit/${artwork.id}`}
                        className="text-foreground"
                      >
                        {artwork.name}
                      </Link>
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
                    <div className="overflow-hidden rounded-md bg-blue-500">
                      <Image
                        src={artwork.pic}
                        alt={`Photo by ${artwork.name}`}
                        className="aspect-[3/4] h-fit w-fit object-cover   transition-all duration-1000 opacity-80 hover:opacity-100"
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
            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              Sports
            </h2>
            <ScrollArea className="whitespace-nowrap rounded-md border bg-white mb-12">
              <div className="flex w-max space-x-4 p-4">
                {sports.map((artwork) => (
                  <figure key={artwork.id} className="shrink-0">
                    <div className="overflow-hidden rounded-md bg-blue-500 w-fit h-fit">
                      <Image
                        src={artwork.pic}
                        alt={`Photo by ${artwork.name}`}
                        className="aspect-square h-fit w-fit object-cover object-top transition-all duration-1000 opacity-80 hover:opacity-100"
                        width={150}
                        height={150}
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
      )}
      {tagPrimary === "place" && (
        <>
          <div className="">
            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              Nature
            </h2>
            <ScrollArea className="whitespace-nowrap rounded-md border bg-white mb-12">
              <div className="flex w-max space-x-4 p-4">
                {musicians.map((artwork, index) => (
                  <figure key={artwork.id} className="shrink-0">
                    <div className="relative overflow-hidden rounded-md bg-blue-500 w-fit h-fit">
                      <Image
                        src={artwork.pic}
                        alt={`Photo by ${artwork.name}`}
                        className={`aspect-square h-fit w-fit object-cover  transition-all duration-500 opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer ${
                          index % 2 === 0 ? "hover:rotate-1" : "hover:-rotate-1"
                        }`}
                        width={150}
                        height={150}
                        priority={index < 6}
                      />
                    </div>
                    <figcaption className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                      <Link
                        href={`/admin/edit/${artwork.id}`}
                        className="text-foreground"
                      >
                        {artwork.name.substring(0, 20)}
                      </Link>
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
              Museums
            </h2>
            <ScrollArea className="whitespace-nowrap rounded-md border bg-white mb-12">
              <div className="flex w-max space-x-4 p-4">
                {comedians.map((artwork, index) => (
                  <figure key={artwork.id} className="shrink-0">
                    <div className="relative overflow-hidden rounded-md bg-blue-500">
                      <Image
                        src={artwork.pic}
                        alt={`Photo by ${artwork.name}`}
                        className="aspect-[3/4] w-fit h-fit object-cover  transition-all duration-1000 opacity-80 hover:opacity-100"
                        width={150}
                        height={200}
                        priority={index < 6}
                      />
                    </div>
                    <figcaption className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                      <Link
                        href={`/admin/edit/${artwork.id}`}
                        className="text-foreground"
                      >
                        {artwork.name.substring(0, 32)}
                      </Link>
                    </figcaption>
                    <div className="flex items-center justify-end mt-2">
                      <Badge className="" variant={"outline"}>
                        <Image
                          alt="whyawesome logo"
                          width="16"
                          height="16"
                          src="/cute-mushroom.png"
                          className="mr-2"
                        />
                        {artwork.oinks}
                      </Badge>
                    </div>
                  </figure>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="">
            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              Colleges and Universities
            </h2>
            <ScrollArea className="whitespace-nowrap rounded-md border bg-white mb-12">
              <div className="flex w-max space-x-4 p-4">
                {sports.map((artwork, index) => (
                  <figure key={artwork.id} className="shrink-0">
                    <div className="relative overflow-hidden rounded-md bg-blue-500">
                      <Image
                        src={artwork.pic}
                        alt={`Photo by ${artwork.name}`}
                        className="aspect-square h-fit w-fit object-cover   transition-all duration-1000  opacity-80 hover:opacity-100"
                        width={150}
                        height={150}
                        priority={index < 6}
                      />
                    </div>
                    <figcaption className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                      <Link
                        href={`/admin/edit/${artwork.id}`}
                        className="text-foreground"
                      >
                        {artwork.name.substring(0, 20)}
                      </Link>
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
      )}
    </>
  );
}
