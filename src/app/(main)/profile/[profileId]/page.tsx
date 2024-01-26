import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchProfile } from "@/lib/firebase";
import { Profile, ServerSideComponentProp } from "@/lib/types";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import ProfileForm from "./ProfileForm";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default async function Page({
  params: { profileId },
}: ServerSideComponentProp<{ profileId?: string }>) {
  if (!profileId) {
    return notFound();
  }
  const profile: Profile = await fetchProfile(profileId);

  console.log("profile", profile);
  return (
    <div className="flex flex-col items-center lg:flex-row lg:items-start space-x-0 lg:space-x-12">
      <div className="relative flex flex-col items-center justify-center space-y-4 min-w-[240px]">
        <Image
          className="rounded-sm object-cover min-h-[300px] min-w-[240px]"
          alt={profile.name}
          src={profile.pic}
          // fill
          width="220"
          height="220"
        />
        <div className="flex flex-wrap gap-3">
          {profile.tags
            .sort((a: { label: string }, b: { label: string }) =>
              a.label.localeCompare(b.label)
            )
            .filter((tag) => tag.value !== "person" && tag.value !== "place")
            .map((tag) => (
              <Badge key={tag.value} variant={"secondary"}>
                {tag.value}
              </Badge>
            ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mt-6 lg:mt-0">{profile.name}</h3>
        <p className="text-sm text-muted-foreground">{profile.description}</p>
        <div className="my-10" />
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
