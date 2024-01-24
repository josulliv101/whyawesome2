import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Profile } from "@/lib/types";
import { addProfile, fetchProfile } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import { ProfileForm } from "../../new/ProfileForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function Page({
  params: { profile },
}: {
  params: { profile: string };
}) {
  const data = await fetchProfile(profile);

  async function onSubmit({ tags, ...rest }: any) {
    "use server";
    const profile: Profile = {
      ...rest,
      // description: bio,
      // name: displayName,
      tagMap: tags,
    };
    console.log("addProfile", profile);
    await addProfile(profile);

    revalidatePath(`/admin/edit/${profile}`);
  }
  return (
    <div className="w-full min-w-96 max-w-lg mx-auto space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="account">details</TabsTrigger>
          <TabsTrigger value="password">what&#39;s awesome</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <ProfileForm addProfile={onSubmit} profile={data} />
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&#39;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
