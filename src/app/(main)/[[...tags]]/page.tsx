import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Profile,
  ServerSideComponentProp,
  TagDefinition,
  TagName,
  getHubTagMap,
  tagDefinitionList,
  tagDefinitionMap,
} from "@/lib/types";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { fetchEntities, fetchProfile } from "@/lib/firebase";
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

  const profile: Profile = await fetchProfile(hub);
  const hubTags = Object.keys(profile.hubTagMap || {}) as TagName[];
  const hubTagsMap = getHubTagMap(hubTags);

  const activeTags = hubTagsMap[tagPrimary as "person" | "place"];

  const filteredActiveTags = activeTags.filter(
    (tag) => profile?.hubTagMap?.[tag] === true
  );
  console.log("filteredActiveTags", filteredActiveTags);

  const ps = filteredActiveTags.map((tag) =>
    fetchEntities(tagsBase.concat(tag), 8)
  );

  const fetchedData = await Promise.all(ps);

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
                <Link href={`/profile/${hub}`}>view {hub}&#39;s profile</Link>
              </div>
            </div>
          )}
          <DrillDownNav
            tags={activeTags}
            activeTags={filteredActiveTags}
            tagPrimary={tagPrimary as TagName}
          />
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
      {fetchedData.map(([profiles, count], tagIndex) => {
        return (
          <div key={tagIndex} className="">
            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              {hub && hub !== "all" ? `${hub} / ` : ""}{" "}
              {filteredActiveTags[tagIndex]}
            </h2>
            <ScrollArea className="whitespace-nowrap rounded-md border bg-white mb-12">
              <div className="flex w-max space-x-4 p-4">
                {profiles.map((artwork, index) => (
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
        );
      })}
    </>
  );
}
