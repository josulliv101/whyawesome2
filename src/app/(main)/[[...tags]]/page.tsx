import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getHubColor } from "@/lib/utils";

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
      <div className="flex items-center mb-12 justify-between space-x-4">
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
        <div className="flex items-center space-x-4">
          {!!hub && hub !== "all" && (
            <div className="flex items-center border rounded-sm text-muted-foreground text-sm">
              <div className="relative w-[40px] h-[40px]">
                <Link href={`/profile/${hub}`}>
                  {/* <Image
                    className="w-[40px] h-[40px] opacity-75"
                    src="/boston.jpg"
                    alt="boston"
                    fill
                  /> */}
                  <Avatar className="rounded-sm">
                    {/* <AvatarImage src="/boston.jpg" alt="@boston" /> */}
                    <AvatarFallback
                      className={`${getHubColor(
                        hub as "chicago" | "boston" | "new-york-city"
                      )} text-white`}
                    >
                      {hub.split("-").map((token) => token[0])}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
              <div className="px-3 py-0">
                <Link href={`/profile/${hub}`}>view {hub}'s profile</Link>
              </div>
            </div>
          )}
          <DrillDownNav tagPrimary={tagPrimary as TagName} />
        </div>
      </div>

      <h2 className="flex items-center text-4xl font-semibold tracking-tight mb-1">
        {false && hub && hub !== "all" ? `${hub} / ` : ""} discover what&#39;s
        awesome about {tagDefinitionMap[tagPrimary as TagName].plural}.
      </h2>
      <p className="text-lg text-muted-foreground mb-12">
        Inclusion in the what&#39;s awesome catalog is by invitation only.
        Everyone can vote on what&#39;s awesome.
      </p>
      <div className="hidden flex items-center justify-end pb-0"></div>
      {tagPrimary === "person" && (
        <>
          <div className="">
            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              {hub && hub !== "all" ? `${hub} / ` : ""} comedians
            </h2>
            <ScrollArea className="whitespace-nowrap rounded-md border bg-white mb-12">
              <div className="flex w-max space-x-4 p-4">
                {comedians.map((artwork, index) => (
                  <figure key={artwork.id} className="shrink-0">
                    <div className="relative overflow-hidden rounded-md bg-blue-500">
                      <HoverCard>
                        <HoverCardTrigger href={`/profile/${artwork.id}`}>
                          <Image
                            src={artwork.pic}
                            alt={`Photo by ${artwork.name}`}
                            className="aspect-square h-fit w-fit object-cover object-top   transition-all duration-1000 opacity-80 hover:opacity-100"
                            width={150}
                            height={150}
                            priority={index < 6}
                          />
                        </HoverCardTrigger>
                        <HoverCardContent
                          sideOffset={24}
                          side="top"
                          className="w-[600px]"
                        >
                          <div className="flex px-4 pt-6 pb-2 space-x-8 w-[500px]">
                            <div className="relative min-w-[68px] w-[68px] h-[68px]">
                              <Image
                                className="object-cover"
                                alt={artwork.name}
                                src="/cute-mushroom.png"
                                fill
                              />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {artwork.oinks} mushrooms
                              </p>
                              <p className="whitespace-normal pr-2">
                                {artwork.description}{" "}
                                <p className="absolute top-2 right-4 text-muted-foreground text-md space-x-4">
                                  <span>
                                    #
                                    {artwork.id
                                      .replaceAll(/[\s'-]/g, "")
                                      .toLocaleLowerCase()}
                                  </span>
                                  <span>#whatsawesome</span>
                                </p>
                              </p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
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
              {hub && hub !== "all" ? `${hub} / ` : ""} musicians
            </h2>
            <ScrollArea className="whitespace-nowrap rounded-md border bg-white mb-12">
              <div className="flex w-max space-x-4 p-4">
                {musicians.map((artwork, index) => (
                  <figure key={artwork.id} className="shrink-0">
                    <div className="overflow-hidden rounded-md bg-blue-500">
                      <HoverCard>
                        <HoverCardTrigger href={`/profile/${artwork.id}`}>
                          <Image
                            src={artwork.pic}
                            alt={`Photo by ${artwork.name}`}
                            className="aspect-square h-fit w-fit object-cover object-top   transition-all duration-1000 opacity-80 hover:opacity-100"
                            width={150}
                            height={150}
                            priority={index < 6}
                          />
                        </HoverCardTrigger>
                        <HoverCardContent
                          sideOffset={24}
                          side="top"
                          className="w-[500px]"
                        >
                          <div className="flex p-2 space-x-8 w-[500px]">
                            <div className="relative min-w-[68px] w-[68px] h-[68px]">
                              <Image
                                className="object-cover"
                                alt={artwork.name}
                                src="/cute-mushroom.png"
                                fill
                              />
                            </div>
                            <div>
                              <p className="font-semibold">12 votes</p>
                              <p className="whitespace-normal pr-2">
                                {artwork.description}
                              </p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
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
              {hub && hub !== "all" ? (
                <span className="">{`${hub} / `}</span>
              ) : (
                ""
              )}{" "}
              sports
            </h2>
            <ScrollArea className="whitespace-nowrap rounded-md border bg-white mb-12">
              <div className="flex w-max space-x-4 p-4">
                {sports.map((artwork, index) => (
                  <figure key={artwork.id} className="shrink-0">
                    <div className="overflow-hidden rounded-md bg-blue-500 w-fit h-fit">
                      <HoverCard closeDelay={0}>
                        <HoverCardTrigger href={`/profile/${artwork.id}`}>
                          <Image
                            src={artwork.pic}
                            alt={`Photo by ${artwork.name}`}
                            className="aspect-square h-fit w-fit object-cover object-top   transition-all duration-1000 opacity-80 hover:opacity-100"
                            width={150}
                            height={150}
                            priority={index < 6}
                          />
                        </HoverCardTrigger>
                        <HoverCardContent
                          sideOffset={24}
                          side="top"
                          className="w-[500px]"
                        >
                          <div className="flex p-2 space-x-8 w-[500px]">
                            <div className="relative min-w-[48px] w-[48px] h-[48px]">
                              <Image
                                className="object-cover"
                                alt={artwork.name}
                                src="/cute-mushroom.png"
                                fill
                              />
                            </div>
                            <div>
                              <p className="font-semibold">12 votes</p>
                              <p className="whitespace-normal pr-2">
                                {artwork.description}
                              </p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
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
                      <Link href={`/profile//${artwork.id}`}>
                        <Image
                          src={artwork.pic}
                          alt={`Photo by ${artwork.name}`}
                          className={`aspect-square h-fit w-fit object-cover  transition-all duration-500 opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer ${
                            index % 2 === 0
                              ? "hover:rotate-1"
                              : "hover:-rotate-1"
                          }`}
                          width={150}
                          height={150}
                          priority={index < 6}
                        />
                      </Link>
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
                      <Link href={`/profile//${artwork.id}`}>
                        <Image
                          src={artwork.pic}
                          alt={`Photo by ${artwork.name}`}
                          className="aspect-[3/4] w-fit h-fit object-cover  transition-all duration-1000 opacity-80 hover:opacity-100"
                          width={150}
                          height={200}
                          priority={index < 6}
                        />
                      </Link>
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
                      <Link href={`/profile//${artwork.id}`}>
                        <Image
                          src={artwork.pic}
                          alt={`Photo by ${artwork.name}`}
                          className="aspect-square h-fit w-fit object-cover   transition-all duration-1000  opacity-80 hover:opacity-100"
                          width={150}
                          height={150}
                          priority={index < 6}
                        />
                      </Link>
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
