import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./ProfileForm";
import { Profile } from "@/lib/types";
import { addProfile } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

export default function Page() {
  async function add({ tags, ...rest }: any) {
    "use server";
    const profile: Profile = {
      ...rest,
      // description: bio,
      // name: displayName,
      tagMap: tags,
    };
    console.log("addProfile", profile);
    await addProfile(profile);

    // revalidatePath("/");
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

      <ProfileForm addProfile={add} />
    </div>
  );
}
