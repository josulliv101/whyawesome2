import { TagInfo, TagName } from "./types";

export const tagDefinitions: Record<TagName, TagInfo> = {
  person: { id: "person", plural: "people" },
  place: { id: "place", plural: "places" },
};
