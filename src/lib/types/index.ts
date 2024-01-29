export interface ServerSideComponentProp<Params, SearchParams = undefined> {
  params: Params;
  searchParams: SearchParams;
}

export const tagCity = {
  boston: true,
  chicago: true,
  "new-york-city": true,
};

export const tagSport = {
  baseball: true,
  basketball: true,
  football: true,
  soccer: true,
  golf: true,
  tennis: true,
  boxing: true,
} as const;

export const tagPlace = {
  museum: true,
  college: true,
  bar: true,
  restaurant: true,
} as const;

export const tagPerson = {
  comedian: true,
  musician: true,
  sports: tagSport,
  actor: true,
  academics: true,
  scientist: true,
} as const;

export const tagMovie = {
  drama: true,
  comedy: true,
  documentary: true,
  thriller: true,
  suspense: true,
  action: true,
  adventure: true,
  horror: true,
  musical: true,
  animation: true,
} as const;

export const tagMisc = {
  movie: tagMovie,
  team: true,
} as const;

export const tagProfile = {
  person: tagPerson,
  place: tagPlace,
  misc: tagMisc,
} as const;

export type TagCity = keyof typeof tagCity;
export type TagMovie = keyof typeof tagMovie;
export type TagSport = keyof typeof tagSport;
export type TagPerson = keyof typeof tagPerson;
export type TagProfile = keyof typeof tagProfile;
export type TagPlace = keyof typeof tagPlace;
export type TagMisc = keyof typeof tagMisc;

// export type TagName =
//   | TagCity
//   | TagMovie
//   | TagSport
//   | TagPerson
//   | TagProfile
//   | TagPlace
//   | TagMisc;

export interface TagInfo {
  plural?: string;
}

// export type TagDefinition<T extends TagName> = Record<T, TagInfo<T>>;

// export type TagDefinitions<T extends TagName> = Record<T, TagDefinition<T>>;

// export const tagDefinitions = {
//   person: {
//     plural: "people",
//   },
//   place: {
//     plural: "places",
//   },
//   misc: {
//     plural: "misc",
//   },
//   movie: {
//     plural: "movies",
//   },
//   team: {
//     plural: "teams",
//   },
//   musician: {
//     plural: "musicians",
//   },
//   sports: {
//     plural: "sports",
//   },
//   comedian: {
//     plural: "comedians",
//   },
//   actor: {
//     plural: "actors",
//   },
//   academic: {
//     plural: "academic",
//   },
//   drama: {
//     plural: "dramas",
//   },
//   comedy: {
//     plural: "comedies",
//   },
//   thriller: {
//     plural: "thrillers",
//   },
//   action: {
//     plural: "",
//   },
//   documentary: {
//     plural: "documentaries",
//   },
//   adventure: {
//     plural: "",
//   },
//   romance: {
//     plural: "",
//   },
//   suspense: {
//     plural: "",
//   },
//   museum: {
//     plural: "museums",
//   },
//   college: {
//     plural: "colleges",
//   },
//   bar: {
//     plural: "bars",
//   },
//   library: {
//     plural: "libraries",
//   },
//   restaurant: {
//     plural: "restaurants",
//   },
// } as const;

export const tagDefinitionList = [
  {
    id: "person",
    plural: "people",
    private: true,
    subTags: ["actor", "comedian", "musician", "sports", "academic", "science"],
  },
  {
    id: "place",
    plural: "places",
    private: true,
    subTags: [
      "nature",
      "museum",
      "bar",
      "restaurant",
      "library",
      "college",
      "movie",
    ],
  },
  { id: "misc", plural: "misc", subTags: ["team"] },
  {
    id: "movie",
    plural: "movies",
    subTags: [
      "drama",
      "comedy",
      "thriller",
      "action",
      "adventure",
      "documentary",
      "animation",
      "romance",
    ],
  },
  { id: "team", plural: "teams" },
  { id: "musician", plural: "musicians" },
  {
    id: "sports",
    plural: "sports",
    subTags: ["basketball", "football", "soccer", "golf", "baseball", "tennis"],
  },
  { id: "comedian", plural: "comedians" },
  { id: "science", plural: "science" },
  { id: "actor", plural: "actors" },
  { id: "academic", plural: "academic" },
  { id: "drama", plural: "dramas" },
  { id: "comedy", plural: "comedies" },
  { id: "thriller", plural: "thrillers" },
  { id: "action", plural: "" },
  { id: "documentary", plural: "documentaries" },
  { id: "adventure", plural: "" },
  { id: "romance", plural: "" },
  { id: "suspense", plural: "" },
  { id: "museum", plural: "museums" },
  { id: "nature" },
  { id: "college", plural: "colleges" },
  { id: "bar", plural: "bars" },
  { id: "library", plural: "libraries" },
  { id: "restaurant", plural: "restaurants" },

  { id: "boston" },
  { id: "chicago" },
  { id: "new-york-city" },
] as const;

export type TagName = (typeof tagDefinitionList)[number]["id"];

export type TagDefinition = {
  id: TagName;
  plural?: string;
  private?: boolean;
  subTags?: Array<TagName>;
};

export const tagDefinitionMap: Record<TagName, TagDefinition> =
  tagDefinitionList.length &&
  tagDefinitionList.reduce((acc, def) => {
    return {
      ...acc,
      [def.id]: def,
    };
  }, {} as Record<TagName, TagDefinition>);

export function getPrimaryTagForTag(tag: TagName): "person" | "place" | null {
  if (tag === "person" || tag === "place") {
    return tag;
  }
  if (tagDefinitionMap.person.subTags?.includes(tag)) {
    return "person";
  }
  if (tagDefinitionMap.place.subTags?.includes(tag)) {
    return "place";
  }
  return null;
}

export function getHubTagMap(
  tags: Array<TagName>
): Record<"person" | "place", Array<Partial<TagName>>> {
  return tags.reduce(
    (acc: Record<"person" | "place", Array<Partial<TagName>>>, tag) => {
      const primaryTag = getPrimaryTagForTag(tag);
      if (!!primaryTag && tag) {
        return {
          ...acc,
          [primaryTag]: acc[primaryTag].concat(tag),
        };
      }
      return acc;
    },
    { person: [], place: [] }
  );
}

export const hubTagMap = {
  college: true,
  comedian: true,
  museum: true,
  musician: true,
  nature: true,
  sports: true,
  movie: false,
};

export type APIResponse<T = object> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface Reason {
  id?: string;
  reason: string;
  votes: number;
}

export interface Profile {
  id: string;
  name: string;
  shortname?: string;
  pic: string;
  description?: string;
  reasons: Array<Reason>;
  oinks?: number;
  tags: Array<{ label: string; value: string }>;
  hubTagMap: Record<TagName, boolean>;
  currentUserVotes: {
    voteMap: Record<string, boolean>;
  };
}

export interface FilterOption {
  tag: string;
  active: boolean;
}
