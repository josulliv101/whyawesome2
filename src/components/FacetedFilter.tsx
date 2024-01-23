import * as React from "react";
import {
  CheckIcon,
  PlusCircledIcon,
  MixerHorizontalIcon,
  MixerVerticalIcon,
} from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { TagName } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  activeTags: TagName[];
  hub: string;
  tagPrimary: "person" | "place";
  // onChange: (tags: TagName[]) => void;
}

export function FacetedFilter<TData, TValue>({
  activeTags,
  column,
  title,
  options,
  hub,
  tagPrimary,
}: // onChange,
DataTableFacetedFilterProps<TData, TValue>) {
  const [activeTagPendingCommit, onChange] = useState(activeTags);
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = { size: activeTags.length, has: () => true }; //new Set(column?.getFilterValue() as string[]);
  const router = useRouter();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 border">
          <MixerVerticalIcon className="mr-2 h-4 w-4" />
          {/* {title} */}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-6" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 4 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal bg-transparent hover:bg-transparent"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  (options || [])
                    .filter(({ value }) =>
                      activeTags.includes(value as TagName)
                    )
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => {
                const isSelected = activeTagPendingCommit.includes(
                  option.value as TagName
                );
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      // router.push("/");

                      if (isSelected) {
                        onChange(
                          activeTagPendingCommit.filter(
                            (tag) => tag !== option.value
                          )
                        );
                      } else {
                        onChange(
                          activeTagPendingCommit.concat(option.value as TagName)
                        );
                      }
                      // const filterValues = Array.from(selectedValues);
                      // column?.setFilterValue(
                      //   filterValues.length ? filterValues : undefined
                      // );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      const url = `/${hub}/${tagPrimary}/${activeTagPendingCommit.join(
                        "/"
                      )}`;
                      router.push(url);
                    }}
                    className="justify-center text-center"
                  >
                    Apply
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
