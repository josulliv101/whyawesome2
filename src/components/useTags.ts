import { config } from "@/lib/config";
import { FilterOption } from "@/lib/types";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export function useTags(): [string, string, boolean] {
  const pathname = usePathname();
  const [cookies, setCookie] = useCookies(["primary-tag"]);
  const [latestTags, setLatestTags] = useState<[string, "person" | "place"]>([
    config.rootHub,
    cookies["primary-tag"] || config.defaultPrimaryTag,
  ]);
  console.log("cookies", cookies["primary-tag"], latestTags);
  const { tags: [hub, primaryTag] = [] } = useParams();

  useEffect(() => {
    const latest = [hub || latestTags[0], primaryTag || latestTags[1]];
    setLatestTags(latest as [string, "person" | "place"]);
    if (primaryTag) {
      setCookie("primary-tag", primaryTag, { path: "/" });
    }
  }, [hub, primaryTag]);
  const isTagsPage = !!hub || pathname === "/";
  console.log("isTagsPage", isTagsPage, hub);
  return [...latestTags, isTagsPage];
}
