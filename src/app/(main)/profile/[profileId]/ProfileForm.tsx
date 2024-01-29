"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Profile, ServerSideComponentProp } from "@/lib/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  ProfileFormValues,
  profileFormSchema,
} from "../../admin/new/ProfileForm";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getHubColor } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/AuthContext";
import { updateReasons } from "@/lib/firebase";

const items = [
  {
    id: "recents",
    label: "Recents",
  },
  {
    id: "home",
    label: "Home",
  },
  {
    id: "applications",
    label: "Applications",
  },
  {
    id: "desktop",
    label: "Desktop",
  },
  {
    id: "downloads",
    label: "Downloads",
  },
  {
    id: "documents",
    label: "Documents",
  },
] as const;

const FormSchema = z.object({
  reasons: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export default function ProfileForm({
  profile,
  onSubmit,
}: {
  profile: Profile;
  onSubmit: any;
}) {
  const user = useAuthContext();
  console.log("profile", onSubmit, profile, user);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reasons: Object.keys(profile.currentUserVotes?.voteMap || {}),
    },
  });

  async function onSubmitFoobar(data: z.infer<typeof FormSchema>) {
    if (!user) {
      return toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            Please login to vote on whats awesome.
          </code>
        </pre>
      );
    }
    await onSubmit(profile.id, user.uid, data.reasons);
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>
    );
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitFoobar)}
          className="space-y-8 mt-12"
        >
          <FormField
            control={form.control}
            name="reasons"
            render={() => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {(
                  profile.reasons as Array<{
                    id: string;
                    votes: number;
                    reason: string;
                  }>
                ).map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="reasons"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="bg-gray-50 border min-h-44 px-4 py-8 flex flex-row items-start hover:bg-gray-100 space-x-5 space-y-0"
                        >
                          <FormControl className="relative top-1 left-1">
                            <Switch
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-normal text-lg pt-0 relative -top-1">
                            {item.reason}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
