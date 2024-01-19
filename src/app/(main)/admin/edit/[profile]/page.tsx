import { Separator } from "@/components/ui/separator";

import { Profile } from "@/lib/types";
import { addProfile, fetchProfile } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import { ProfileForm } from "../../new/ProfileForm";

export default async function Page({
  params: { profile },
}: {
  params: { profile: string };
}) {
  const data = await fetchProfile(profile);

  async function onSubmit({ bio, tags, displayName, ...rest }: any) {
    "use server";
    const profile: Profile = {
      ...rest,
      description: bio,
      name: displayName,
      tagMap: tags,
    };
    console.log("addProfile", profile);
    await addProfile(profile);

    revalidatePath(`/admin/edit/${profile}`);
  }
  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />

      <ProfileForm addProfile={onSubmit} profile={data} />
    </div>
  );
}
