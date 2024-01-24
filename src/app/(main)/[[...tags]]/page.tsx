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
  const [hubState = "all", tagPrimary = "place", ...tagsParam] = tags;
  const hub = hubState === "index" ? "all" : hubState;
  const tagsBase = [hub, tagPrimary].filter((t) => !!t && t !== "all");
  await new Promise((r) => setTimeout(r, 0));

  const profile: Profile = await fetchProfile(hub);
  const hubTags = Object.keys(profile.hubTagMap || {}) as TagName[];
  const hubTagsMap = getHubTagMap(hubTags);

  const activeTags = hubTagsMap[tagPrimary as "person" | "place"];

  const defaultActiveTags = activeTags.filter(
    (tag) => profile?.hubTagMap?.[tag] === true
  );
  console.log("filteredActiveTags", tagsParam, defaultActiveTags);
  const tagsToUse = (
    tagsParam.length > 0 ? tagsParam : defaultActiveTags
  ) as TagName[];
  const ps = tagsToUse.map((tag) => fetchEntities(tagsBase.concat(tag), 8));

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
                <Link href={`/profile/${hub}`} prefetch={false}>
                  {/* <Image
                    className="w-[40px] h-[40px] opacity-75"
                    src="/boston.jpg"
                    alt="boston"
                    fill
                  /> */}
                  <Avatar className="rounded-sm">
                    <AvatarImage src={profile.pic} alt={profile.name} />
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
                <Link href={`/profile/${hub}`} prefetch={false}>
                  view {hub}&#39;s profile
                </Link>
              </div>
            </div>
          )}
          <DrillDownNav
            tags={activeTags}
            activeTags={tagsToUse}
            tagPrimary={tagPrimary as "person" | "place"}
            hub={hub}
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
      {fetchedData.map(([profiles, count, _1, _2, label], tagIndex) => {
        return (
          <div key={tagIndex} className="">
            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              {label}
            </h2>
            <ScrollArea className="whitespace-nowrap rounded-md border bg-white mb-12">
              <div className="flex w-max space-x-4 p-4">
                {profiles.map((artwork, index) => (
                  <figure key={artwork.id} className="shrink-0 w-[192px]">
                    <div className="relative overflow-hidden rounded-md w-[192px] bg-gray-100">
                      <Link href={`/profile/${artwork.id}`} prefetch={false}>
                        <Image
                          src={artwork.pic}
                          alt={`Photo by ${artwork.name}`}
                          className="aspect-square h-fit w-[192px] object-cover object-center"
                          width={150}
                          height={150}
                          priority={true}
                          placeholder="empty"
                        />
                        <div className="absolute w-full h-full bg-blue-500/30 hover:bg-blue-500/0 top-0 left-0 transition-all duration-500" />
                      </Link>
                    </div>
                    <figcaption className="pt-2 text-xs text-muted-foreground w-[192px]">
                      <Link
                        href={`/admin/edit/${artwork.id}`}
                        prefetch={false}
                        className="text-foreground"
                      >
                        {artwork.name.substring(0, 30)}
                      </Link>
                      <div className="mt-2 flex items-center justify-start">
                        {/* <Link className="" href={`/profile/${artwork.id}`}>
                          @{artwork.id}
                        </Link> */}
                        <HoverCard>
                          <HoverCardTrigger href={`/profile/${artwork.id}`}>
                            <Badge className="" variant={"outline"}>
                              <Image
                                alt="whyawesome logo"
                                width="16"
                                height="16"
                                src="/earth2.jpg"
                                className="mr-1 relative left-[-2px]"
                              />
                              {artwork.oinks}
                            </Badge>
                          </HoverCardTrigger>
                          <HoverCardContent
                            sideOffset={24}
                            side="top"
                            className="w-[600px] text-lg"
                          >
                            <div className="flex px-4 pt-2 pb-2 space-x-12 w-[500px] min-h-[162px]">
                              <div className="relative min-w-[68px] w-[68px] h-[68px]">
                                <Image
                                  className="object-cover"
                                  alt={artwork.name}
                                  src="/earth2.jpg"
                                  fill
                                />
                                <p className="text-sm font-semibold mt-[74px]">
                                  {artwork.oinks} votes
                                </p>
                              </div>
                              <div>
                                <p className="whitespace-normal pr-2">
                                  <p>
                                    <strong>{artwork.name}</strong>
                                  </p>
                                  <p>{artwork.description} </p>
                                  <p className="absolute top-2 right-4 text-muted-foreground text-sm space-x-4">
                                    {/* <span>
                                      #
                                      {artwork.id
                                        .replaceAll(/[\s'-]/g, "")
                                        .toLocaleLowerCase()}
                                    </span> */}
                                    <span>#whatsawesome</span>
                                  </p>
                                </p>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
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
