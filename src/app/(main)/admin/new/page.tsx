import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./ProfileForm";

export default function Page() {
  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />

      <ProfileForm />
    </div>
  );
}
