"use client";

import { config } from "@/lib/config";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

export default function SmartLink({
  children,
  className,
  hub,
  ...props
}: PropsWithChildren<{ hub: string; className?: string }>) {
  const { tags: [_, primaryTag] = [] } = useParams();
  const [tag, setTag] = useState(primaryTag || config.defaultPrimaryTag);

  console.log("SmartLink render", tag);

  useEffect(() => {
    if (primaryTag) {
      setTag(primaryTag);
    }
  }, [primaryTag]);
  return (
    <Link
      className={className}
      href={`/${hub}/${primaryTag || tag}`}
      {...props}
    >
      {children} / {tag}
    </Link>
  );
}
