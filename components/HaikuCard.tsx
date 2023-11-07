import React from "react";
import anonymouse from "@/app/anonymouse.png";
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai";

import { HaikuWithDetails } from "@/types";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

export default function HaikuCard({
  contents,
}: {
  contents: HaikuWithDetails;
}) {
  return (
    <li className=" text-sm leading-6 ">
      <figure className="dark:highlight-white/5 relative flex flex-col rounded-lg bg-card p-6 text-card-foreground shadow-sm border">
        <figcaption className="flex items-center space-x-4">
          <Image
            src={anonymouse}
            alt=""
            className="h-14 w-14 flex-none rounded-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="max-w-[175px] flex-auto lg:max-w-[150px] xl:max-w-[275px]">
            <p className="text-base font-semibold text-card-foreground">
              {contents.profile?.username
                ? `@${contents.profile?.username}`
                : "anonymouse"}
            </p>
            <p className="mt-0.5 truncate text-muted-foreground">
              {contents.profile?.status}
            </p>
          </div>
        </figcaption>
        <blockquote className="mt-4 w-full text-card-foreground">
          <pre className="font-sans">{contents.body}</pre>
        </blockquote>
        {contents.hashtags.length > 0 && (
          <div className="mt-3 flex min-h-[24px] w-full gap-1 text-muted-foreground ">
            {contents.hashtags.map((item) => (
              <span key={item.id}>{item.hashtag}</span>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center">
          <button className="">
            <AiOutlineHeart size={24} />
          </button>
        </div>
      </figure>
    </li>
  );
}

export function HaikuCardSkeleton({
  variant = "default",
}: {
  variant?: "default" | "nohashtags";
}) {
  const hashtagsClasses = cn("mt-6 flex min-h-[24px] w-full gap-2", {
    hidden: variant === "nohashtags",
  });
  return (
    <li>
      <figure className="relative flex flex-col rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <figcaption className="flex items-center space-x-4">
          <Skeleton className="h-14 w-14 flex-none rounded-full object-cover" />
          <div className="flex-auto">
            <Skeleton className="h-2 w-1/3" />
            <Skeleton className="mt-4 h-2 w-3/4" />
          </div>
        </figcaption>
        <blockquote className="mt-6 w-full">
          <Skeleton className="h-2 w-1/3" />
          <Skeleton className="mt-4 h-2 w-2/3" />
          <Skeleton className="mt-4 h-2 w-1/2" />
        </blockquote>
        <div className={hashtagsClasses}>
          <Skeleton className="h-2 w-[50px]" />
          <Skeleton className="h-2 w-[50px]" />
          <Skeleton className="h-2 w-[50px]" />
        </div>
      </figure>
    </li>
  );
}
