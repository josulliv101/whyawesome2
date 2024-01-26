"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getHubColor } from "@/lib/utils";

export default function ProfileForm({ profile }: { profile: Profile }) {
  console.log("profile", profile);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profile as any, // TODO fix typing
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    console.log("data", data);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="reasons"
            render={() => (
              <FormItem className="space-y-8">
                {/* <div className="mb-4">
                  <FormLabel className="text-base">Sidebar</FormLabel>
                  <FormDescription>
                    Select the items you want to display in the sidebar.
                  </FormDescription>
                </div> */}
                {profile.reasons.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="reasons"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="relative flex flex-col lg:flex-row items-start space-x-4 lg:space-x-10 space-y-0 border-b pb-8"
                        >
                          <div className="mb-6 lg:mb-0 flex items-center border rounded-full px-4 py-2 space-x-3">
                            <Image
                              alt="whyawesome logo"
                              width="32"
                              height="32"
                              src="/cute-mushroom.png"
                              className="shrink grayscale"
                            />
                            <p className="text-sm font-semibold">
                              {item.votes} mushrooms
                            </p>
                          </div>
                          {/* <Badge className="" variant={"outline"}>
                            {item.votes} votes
                          </Badge> */}
                          {/* <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl> */}
                          <div className="relative space-y-0.5 shrink-0 flex-1">
                            <FormLabel className="text-base">
                              {item.reason}
                            </FormLabel>
                            <div className="flex items-center justify-start">
                              <div className="flex items-center space-x-2 text-sm">
                                <p className="text-muted-foreground">
                                  contributed by
                                </p>
                                <div className="flex items-center space-x-2 bg-gray-100 py-0 px-1 rounded-sm text-white">
                                  <Avatar className="w-8 h-8 border border-gray-300 rounded-full overflow-hidden bg-gray-50">
                                    <AvatarImage
                                      src="/hyena-head.png"
                                      alt="@boston"
                                    />
                                    <AvatarFallback
                                      className={`${getHubColor(
                                        "boston" as
                                          | "chicago"
                                          | "boston"
                                          | "new-york-city"
                                      )} text-white rounded-full`}
                                    >
                                      {"boston"
                                        .split("-")
                                        .map((token) => token[0])}
                                    </AvatarFallback>
                                  </Avatar>
                                  <p className="text-muted-foreground pr-1">
                                    ai-bot-maggie
                                  </p>
                                </div>
                                <p className="text-muted-foreground">
                                  on 01/21/24
                                </p>
                              </div>
                            </div>
                          </div>{" "}
                          <div className="absolute lg:static top-4 right-0">
                            <FormControl>
                              <Switch
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 
          {profile.reasons.map((reason) => {
            return (
              <FormField
                control={form.control}
                name="reasons"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-x-10">
                    <Image
                      alt="whyawesome logo"
                      width="36"
                      height="36"
                      src="/cute-mushroom.png"
                      className="shrink"
                    />
                    <div className="space-y-0.5 shrink-0 flex-1">
                      <FormLabel className="text-base">
                        Communication emails
                      </FormLabel>
                      <FormDescription>
                        Receive emails about your account activity.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            );
          })} */}
        </form>
      </Form>
    </>
  );
}
