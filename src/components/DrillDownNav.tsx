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
  hub?: string;
  tagPrimary: TagName;
}

export function DrillDownNav({ className, tagPrimary }: DrillDownNav) {
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
      {tagPrimaryDefinition?.subTags?.map(
        (tag) => null // <Badge variant="secondary">{tag}</Badge>
      )}
      <FacetedFilter
        column={table.getColumn("status")}
        title="Categories"
        options={tagPrimaryDefinition?.subTags?.map((tag) => ({
          value: tag,
          label: tag,
        }))}
      />
    </>
  );
}
