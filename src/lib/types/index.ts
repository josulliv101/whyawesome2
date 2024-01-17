export interface ServerSideComponentProp<Params, SearchParams = undefined> {
  params: Params;
  searchParams: SearchParams;
}

export interface TagInfo {
  id: TagName;
  plural: string;
}

export type TagName = "person" | "place";

export interface Reason {
  reason: string;
  votes: number;
}

export interface Profile {
  id: string;
  name: string;
  pic: string;
  description?: string;
  reasons: Array<Reason>;
  oinks?: number;
}
