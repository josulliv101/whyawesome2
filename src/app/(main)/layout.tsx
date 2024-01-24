import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ServerSideComponentProp } from "@/lib/types";
import { PropsWithChildren } from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Logo } from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";

const defaultLayout = [265, 440, 655];

// const hubs = {
//   cities: [
//     { id: "boston", label: "Boston" },
//     { id: "chicago", label: "Chicago" },
//     { id: "new-york-city", label: "New York CIty" },
//   ],
//   colleges: [
//     { id: "tufts-university", label: "Tufts University" },
//     { id: "university-of-chicago", label: "University of Chicago" },
//     { id: "columbia-university", label: "Columbia University" },
//   ],
// };

export default function TagsLayout({
  children,
  params: { tags = [] },
}: PropsWithChildren<{ params: { tags?: string[] } }>) {
  const [hub = "all", tagPrimary = "person", ...tagsParam] = tags;

  console.log("LAYOUT", tags);
  return (
    <div className="">
      <div className="sticky top-0 left-0 z-50 h-[42px] bg-white flex justify-between items-center w-full border-b px-6">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-1.5">
            {/* <Logo /> */}
            <Image
              alt="whyawesome logo"
              width="24"
              height="24"
              src="/earth2.jpg"
            />
            <Separator orientation="vertical" className="border-gray-600" />
            <span className="font-semibold text-sm relative top-[0px] border-l-0 pl-0">
              what&#39;s awesome
            </span>
          </Link>

          {false && hub && (
            <>
              <span className="">/</span>
              <Link href={`/${hub}/${tagPrimary}`}>
                {" "}
                {hub} / {tagPrimary}
              </Link>
            </>
          )}
        </div>
        <Menubar className="block lg:hidden border-0">
          <MenubarMenu>
            <MenubarTrigger>Explore</MenubarTrigger>
            <MenubarContent>
              <Command className="min-w-md ">
                {/* <CommandInput placeholder="Type a command or search..." /> */}
                <CommandList>
                  {/* <CommandEmpty>No results found.</CommandEmpty> */}
                  <CommandGroup heading="Cities">
                    <CommandItem>
                      <Link className="w-full" href={`/boston`}>
                        Boston
                      </Link>
                    </CommandItem>
                    <CommandItem>
                      <Link className="w-full" href={`/chicago`}>
                        Chicago
                      </Link>
                    </CommandItem>
                    <CommandItem>
                      <Link className="w-full" href={`/new-york-city`}>
                        New York City
                      </Link>
                    </CommandItem>
                  </CommandGroup>
                  {/* <CommandSeparator />
                  <CommandGroup heading="Settings">
                    <CommandItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                      <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                      <CommandShortcut>⌘B</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                      <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                  </CommandGroup> */}
                </CommandList>
              </Command>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <main className="flex min-h-screen items-start justify-stretch">
        <Sidebar className="lg:w-2/12" hub={hub} tagPrimary={tagPrimary} />

        <div className="w-full lg:w-10/12 px-4 py-4 lg:px-12 lg:py-8 ">
          <div className="">{children}</div>
        </div>
      </main>
    </div>
  );
}
