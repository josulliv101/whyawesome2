import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Profile,
  ServerSideComponentProp,
  TagDefinition,
  TagName,
  getHubTagMap,
  tagDefinitionList,
  tagDefinitionMap,
} from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { config } from "@/lib/config";
import { ChevronDownIcon, PlusIcon, StarIcon } from "@radix-ui/react-icons";

const defaultLayout = [265, 440, 655];

function getTruncatedString(str: string, boundary: number = 26) {
  if (str.length < boundary) {
    return str;
  }
  return `${str.substring(0, boundary)}...`;
}

export default async function Page({
  params: { tags = [] },
}: ServerSideComponentProp<{ tags?: string[] }>) {
  const [hubState = "all", tagPrimary = "place", ...tagsParam] = tags;
  const hub = hubState === "index" ? "all" : hubState;
  const tagsBase = [hub, tagPrimary].filter((t) => !!t && t !== "all");
  await new Promise((r) => setTimeout(r, 0));

  const profile: Profile = await fetchProfile(hub);
  const hubTags = Object.keys(profile.hubTagMap) as TagName[];
  const hubTagsMap = getHubTagMap(hubTags);

  const activeTags = hubTagsMap[tagPrimary as "person" | "place"];

  const defaultActiveTags = activeTags?.filter(
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
          <DrillDownNav
            tags={activeTags}
            activeTags={tagsToUse}
            tagPrimary={tagPrimary as "person" | "place"}
            hub={hub}
          />
          {!!hub && hub !== "all" && (
            <div className="hidden lg:flex items-center border-0 rounded-sm text-muted-foreground text-sm">
              {/* <div className="relative w-[40px] h-[40px]">
                <Link href={`/profile/${hub}`} prefetch={false}>
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
              </div> */}
              <div className="px-3 py-0">
                <Button variant="default" asChild>
                  <Link href={`/profile/${hub}`} prefetch={false}>
                    {hub}&#39;s profile
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 className="flex items-center text-xl lg:text-4xl font-semibold tracking-tight mb-1">
        {false && hub && hub !== "all" ? `${hub} / ` : ""} Discover what&#39;s
        awesome about {tagDefinitionMap[tagPrimary as TagName].plural}{" "}
        {hub && hub !== "all" ? (
          <span className="pl-2">
            <Link className="" href={`/profile/${hub}`}>
              @{hub}
            </Link>
          </span>
        ) : (
          "."
        )}
      </h2>
      <p className="text-md lg:text-lg text-muted-foreground mb-12">
        Inclusion in the what&#39;s awesome catalog is by invitation only.
        Everyone can vote on what&#39;s awesome.
      </p>
      <div className="hidden flex items-center justify-end pb-0"></div>
      <TooltipProvider delayDuration={0}>
        {fetchedData.map(([profiles, count, _1, _2, label], tagIndex) => {
          return (
            <div key={tagIndex} className="">
              <h2 className="text-lg lg:text-2xl font-semibold tracking-tight mb-4">
                {label}
              </h2>
              <ScrollArea className="whitespace-nowrap rounded-md border bg-white mb-12">
                <div className="flex w-max space-x-4 p-4">
                  {profiles.map((artwork, index) => (
                    <figure
                      key={artwork.id}
                      className="relative shrink-0 w-[192px] rounded-sm overflow-hidden"
                    >
                      <div className="relative overflow-hidden rounded-md h-[192px] w-[192px] bg-gray-50">
                        <Tooltip>
                          <TooltipTrigger>
                            <Link
                              href={`/profile/${artwork.id}`}
                              prefetch={false}
                            >
                              <Image
                                src={artwork.pic}
                                alt={`Photo by ${artwork.name}`}
                                className="aspect-square h-fit w-[192px] object-cover object-top" // opacity-80 hover:opacity-100 saturate-150 hover:saturate-100 transition-all duration-500
                                width={150}
                                height={150}
                                priority={true}
                                placeholder="empty"
                              />
                              <div className="absolute w-full h-full bg-blue-500/30 hover:bg-blue-500/0 top-0 left-0 transition-all duration-500" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-lg">{artwork.name}</p>
                            <p>Click image below to view full profile</p>
                            <p className="text-muted-foreground">
                              hint: click the{" "}
                              <span className="inline-flex items-center rounded-sm border px-2 py-1">
                                <Image
                                  alt="whyawesome logo"
                                  width="12"
                                  height="12"
                                  src={config.logo.path}
                                  className="relative mr-2 font-normal"
                                />{" "}
                                name badge
                              </span>{" "}
                              to view what&#39;s most awesome
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <figcaption className="pt-2 text-sm text-muted-foreground w-[192px]">
                        <Link
                          href={`/admin/edit/${artwork.id}`}
                          prefetch={false}
                          className="text-foreground hidden"
                        >
                          {artwork.name.substring(0, 30)}
                        </Link>
                        <div className="mt-1 flex items-center justify-start">
                          {/* <Link className="" href={`/profile/${artwork.id}`}>
                          @{artwork.id}
                        </Link> */}
                          <div className="w-full absolute__ bottom-0 keft-0 border flex items-center space-x-1 pr-0 rounded-md bg-white text-secondary-foreground">
                            {/* <Separator
                            orientation="vertical"
                            className="h-[16px]"
                          /> */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-4.5 pl-0 pr-0 py-1 shadow-none text-sm w-full"
                                  size={"default"}
                                >
                                  <div
                                    className={
                                      artwork.name.length > 20
                                        ? "text-xs"
                                        : "text-sm"
                                    }
                                  >
                                    {!!artwork.shortname
                                      ? getTruncatedString(artwork.shortname)
                                      : getTruncatedString(artwork.name)}
                                    <Separator
                                      orientation="horizontal"
                                      className="my-0.5 opacity-0"
                                    />
                                    <span className="inline-flex mt-0 items-center text-xs text-muted-foreground">
                                      <Image
                                        alt="whyawesome logo"
                                        width="14"
                                        height="14"
                                        src={config.logo.path}
                                        className="relative mr-2 font-normal"
                                      />{" "}
                                      {artwork.oinks} votes
                                    </span>
                                  </div>
                                </Button>
                                {/* <Button
                                variant="secondary"
                                className="h-4.5 px-0 py-1 bg-secondary shadow-none text-xs"
                                size={"sm"}
                              >
                                <ChevronDownIcon className="h-6 w-6 text-secondary-foreground" />
                              </Button> */}
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="center"
                                side="top"
                                //alignOffset={-5}
                                className="w-[400px]"
                                forceMount
                              >
                                <DropdownMenuLabel>
                                  {artwork.name}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked>
                                  Future Ideas
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                  My Stack
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                  Inspiration
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <PlusIcon className="mr-2 h-4 w-4" /> Create
                                  List
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <HoverCard>
                            <HoverCardTrigger href={`/profile/${artwork.id}`}>
                              <Badge
                                className="hidden absolute rounded-sm bottom-[32px] right-[-16px] z-50 bg-white"
                                variant={"outline"}
                              >
                                <Image
                                  alt="whyawesome logo"
                                  width="16"
                                  height="16"
                                  src={config.logo.path}
                                  className="mr-1 relative left-[-6px]"
                                />
                                <span className="relative left-[-6px]">
                                  {artwork.oinks}
                                </span>
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
                                    src={config.logo.path}
                                    fill
                                  />
                                  <p className="hidden text-sm font-semibold mt-[74px]">
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
      </TooltipProvider>
    </>
  );
}
