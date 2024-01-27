import { notFound } from "next/navigation";
import admin from "firebase-admin";
import Image from "next/image";
import { fetchProfile, getCurrentUser, updateReasons } from "@/lib/firebase";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleUserRound, Info, Terminal } from "lucide-react";
import Link from "next/link";
import LoginAlert from "./LoginAlert";

export default async function Page({
  params: { profileId },
}: ServerSideComponentProp<{ profileId?: string }>) {
  const user = await getCurrentUser();

  async function onSubmit(profileId: string, uid: string, reasons: string[]) {
    "use server";
    return await updateReasons(profileId, uid, reasons);
  }

  if (!profileId) {
    return notFound();
  }
  const profile: Profile = await fetchProfile(profileId, user?.uid);

  console.log("profile", profile, user?.uid);
  return (
    <div className="flex flex-col items-center md:flex-row md:items-start space-x-0 md:space-x-12">
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
        <h3 className="text-lg font-medium mt-6 md:mt-0">{profile.name}</h3>
        <p className="text-sm text-muted-foreground">{profile.description}</p>
        <LoginAlert name={profile.name} />
        <ProfileForm profile={profile} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
