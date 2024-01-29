import { cookies } from "next/headers";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { config } from "@/lib/config";
import { Button } from "./ui/button";

export default function PrimaryTagSelection({
  hub = config.rootHub,
  tagPrimary,
}: {
  tagPrimary?: "person" | "place";
  hub: string;
}) {
  async function markAsSeen(formData: any) {
    "use server";
    const val = formData.get("foobar");
    console.log("data", val);
    cookies().set("viewedWelcomeMessage", val);
  }

  const viewedWelcomeMessage = cookies().get("viewedWelcomeMessage") || {
    value: "person",
  };
  console.log("viewedWelcomeMessage", viewedWelcomeMessage);
  return (
    <form action={markAsSeen}>
      <input name="foobar" defaultValue={viewedWelcomeMessage.value} />
      {/* <Tabs value={viewedWelcomeMessage.value} className="h-full space-y-6 ">
        <div className="space-between flex items-center">
          <TabsList>
            <TabsTrigger value="person">
              <Link href={`/${hub}/person`} className="relative">
                People
              </Link>
            </TabsTrigger>
            <TabsTrigger value="place">
              <Link href={`/${hub}/place`} className="relative">
                Places
              </Link>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs> */}
      <Button type="submit">change</Button>
      <div>results: {JSON.stringify(viewedWelcomeMessage)}</div>
    </form>
  );
}
