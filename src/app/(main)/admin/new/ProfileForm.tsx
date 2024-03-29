"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import MultipleSelector, { Option } from "@/components/MultipleSelector";
import { TagName, tagDefinitionList } from "@/lib/types";
import { addProfile } from "@/lib/firebase";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const OPTIONS: Option[] = tagDefinitionList.map((tag) => ({
  label: tag.id as TagName,
  value: tag.id as TagName,
}));

tagDefinitionList;

export const profileFormSchema = z.object({
  profileId: z
    .string()
    .min(3, {
      message: "Profile Id must be at least 3 characters.",
    })
    .max(60, {
      message: "Username must not be longer than 30 characters.",
    }),
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(60, {
      message: "Name must not be longer than 30 characters.",
    }),
  description: z.string().max(500).min(4),
  pic: z.string().max(200).min(0),
  tags: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .transform((val, ctx) => {
      console.log("transform", val, ctx);
      const map = {} as Record<TagName, boolean> | Record<TagName, never>;

      !!val.length &&
        val.forEach((option) => (map[option.value as TagName] = true));
      return map;
    }),
  oinks: z.coerce.number().min(0).multipleOf(1),
  reasons: z.array(
    z.object({
      id: z.string().optional(),
      reason: z.string(),
      votes: z.number(),
    })
  ),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  profileId: "",
  description: "",
  oinks: 0,
  tags: [] as any, // Record<TagName, boolean>,
  reasons: [],
};

export function ProfileForm({ addProfile, profile }: any) {
  const [suggestions, setSuggestions] = useState([]);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: !!profile ? profile : defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "reasons",
    control: form.control,
    keyName: "reason",
  });

  const { replace } = useFieldArray({
    name: "tags" as never, // TODO fix typing
    control: form.control,
    keyName: "value",
  });

  async function onSubmit(data: ProfileFormValues) {
    await addProfile(data);
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>
    );
  }

  const handleSuggestions = async (open: boolean) => {
    console.log("handleSuggestions", open);
    if (open) {
      const results = await fetch(
        "/api/suggest?name=" + (profile?.name || form.getValues().name)
      ).then((resp) => resp.json());
      // setSuggestions()
      console.log("results", results);
      if (results.success) {
        setSuggestions(results.data);
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="profileId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Id</FormLabel>
                <FormControl>
                  <Input placeholder="profile id" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter a unique profile id. This can be changed in the
                  future.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Larry Bird" {...field} />
                </FormControl>
                <FormDescription>
                  This is the public display name of the profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="oinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Oinks</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormDescription>
                  This is the public display name of the profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <Input placeholder="/my-profile-pic.jpg" {...field} />
                </FormControl>
                <FormDescription>
                  This is the url of the picture that is displayed with profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>

                <FormControl>
                  <MultipleSelector
                    onChange={(tags) => {
                      console.log(tags);
                      replace(tags);
                    }}
                    defaultOptions={OPTIONS}
                    value={field.value as any}
                    placeholder="Add tags..."
                    creatable
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                  />
                </FormControl>
                <FormDescription>
                  Please select the appropriate tags.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can <span>@mention</span> other users and organizations to
                  link to them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id || index}
                name={`reasons.${index}.reason`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      what&#39;s awesome?
                    </FormLabel>
                    <FormDescription className={cn(index !== 0 && "sr-only")}>
                      Add what&#39;s awesome.
                    </FormDescription>
                    <FormControl>
                      <div className="flex w-full items-center space-x-2">
                        <Input {...field} className="" />
                        <Button
                          id={String(index)}
                          onClick={(ev) => {
                            ev.preventDefault();
                            remove(Number(ev.currentTarget.id));
                            console.log("args", ev.currentTarget.id);
                          }}
                        >
                          delete
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ reason: "", votes: 0 })}
              >
                Add
              </Button>
              <Dialog onOpenChange={handleSuggestions}>
                <DialogTrigger asChild>
                  <Button variant="outline">Generate Suggestions</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Generate Suggestions</DialogTitle>
                    <DialogDescription>
                      Select the suggestions you want to save.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="">
                    {suggestions.map((suggestion, i) => {
                      return (
                        <div key={i}>
                          #{i}{" "}
                          <Button
                            onClick={() =>
                              append({ reason: suggestion, votes: 0 })
                            }
                            variant={"secondary"}
                          >
                            {suggestion}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Button type="submit">Update profile</Button>
        </form>
      </Form>
    </>
  );
}
