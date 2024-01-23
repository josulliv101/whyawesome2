"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { TagName, tagDefinitionMap } from "@/lib/types";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import ComboboxPopover from "./ComboPopover";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { FacetedFilter } from "./FacetedFilter";
import { useReactTable } from "@tanstack/react-table";
import { useState } from "react";

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
];

interface DrillDownNav extends React.HTMLAttributes<HTMLDivElement> {
  hub: string;
  tagPrimary: "person" | "place";
  tags: TagName[];
  activeTags: TagName[];
}

export function DrillDownNav({
  className,
  tags,
  activeTags,
  hub,
  tagPrimary,
}: DrillDownNav) {
  const [activeTagPendingCommit, setActiveTags] = useState(activeTags);
  const segment = useSelectedLayoutSegment() || "";
  const tagPrimaryDefinition = tagDefinitionMap[tagPrimary as TagName];
  const table = useReactTable({
    data: [],
    columns: [],
    state: {},
    enableRowSelection: true,
    onRowSelectionChange: () => null,
    onSortingChange: () => null,
    onColumnFiltersChange: () => null,
    onColumnVisibilityChange: () => null,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <FacetedFilter
        column={table.getColumn("status")}
        title="Categories"
        activeTags={activeTags}
        options={tags.map((tag) => ({
          value: tag,
          label: tag,
        }))}
        // onChange={setActiveTags}
        tagPrimary={tagPrimary}
        hub={hub}
      />
    </>
  );
}
