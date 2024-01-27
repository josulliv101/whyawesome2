"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";

export default function LoginAlert({ name }: { name: string }) {
  const user = useAuthContext();
  if (!!user) {
    return null;
  }
  return (
    <div className="my-10">
      <Alert variant={"default"}>
        <Info className="h-4 w-4" />
        <AlertTitle>
          Please <Link href="/login">login</Link> to vote on whats awesome.
        </AlertTitle>
        <AlertDescription>
          <div>
            Select statements up to 2 statements below that best represents
            whats awesome about {name}.
          </div>
          <div className="flex justify-end pt-4">
            <Button
              className="w-full lg:w-max"
              size="sm"
              variant="secondary"
              asChild
            >
              <Link href="/login">login</Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
