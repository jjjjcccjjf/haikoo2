"use client";

import { HaikuWithDetails } from "@/types";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useMemo, useReducer, useState } from "react";
import HaikuCard, { HaikuCardSkeleton } from "./HaikuCard";
import { toast } from "./ui/use-toast";
export const revalidate = 0;
interface State {
  list1: HaikuWithDetails[];
  list2: HaikuWithDetails[];
  list3: HaikuWithDetails[];
}

const initialState: State = {
  list1: [],
  list2: [],
  list3: [],
};
type Action = { field: string; value: HaikuWithDetails[] };

function reducer(state: typeof initialState, action: Action) {
  return { ...state, [action.field]: action.value };
}

export default function RealtimeHaikuCardsSection({
  serverHaikus,
}: {
  serverHaikus: HaikuWithDetails[];
}) {
  const [haikus, setHaikus] = useState(serverHaikus);
  const [haikuLists, dispatch] = useReducer(reducer, initialState);
  // TODO: Debate whether to handle resize events or simply just get the window size on mount
  const windowSize = useWindowSize();
  const sizeMemo = useMemo(() => windowSize, [windowSize]);

  //   const handleRealtime = async (payload: any) => {
  //     const { data, error } = await supabase
  //       .from("haikus")
  //       .select(
  //         `*,
  //       hashtags(*),
  //       profile: profiles(*)`,
  //       )
  //       .eq("id", payload.new.id)
  //       .single();

  //     if (error) {
  //       return toast({
  //         title: "Uh oh!",
  //         description: `It looks like posts cannot be retrieved this time. Please try again later. Error code: ${error.code}`,
  //       });
  //     }

  //     setHaikus((prevHaikus) => [data as HaikuWithDetails, ...prevHaikus]);
  //   };

  //   useEffect(() => {
  //     const channel = supabase
  //       .channel("realtime haikus")
  //       .on(
  //         "postgres_changes",
  //         {
  //           event: "INSERT",
  //           schema: "public",
  //           table: "haikus",
  //         },
  //         handleRealtime,
  //       )
  //       .subscribe();

  //     return () => {
  //       supabase.removeChannel(channel);
  //     };
  //   }, [supabase, haikus, handleRealtime]);

  useEffect(() => {
    const sliceData = () => {
      let divideBy = 1;
      const LARGE_SCREEN = 1024;
      const MEDIUM_SCREEN = 768;
      const SMALL_SCREEN = 0;

      if (sizeMemo && sizeMemo.width !== null) {
        if (sizeMemo.width >= LARGE_SCREEN) {
          divideBy = 3;
        } else if (sizeMemo.width >= MEDIUM_SCREEN) {
          divideBy = 2;
        } else if (sizeMemo.width >= SMALL_SCREEN) {
          divideBy = 1;
        }
      }

      // we populate each list here depending on the screen size
      // for small screens, only populate one long continuous list
      // for med screens, populate two long lists, and so on
      const list1Data = haikus.slice(0, haikus.length / divideBy);
      const list2Data = haikus.slice(
        haikus.length / divideBy,
        (2 * haikus.length) / divideBy
      );
      const list3Data = haikus.slice((2 * haikus.length) / divideBy);

      dispatch({ field: "list1", value: list1Data });
      dispatch({ field: "list2", value: list2Data });
      dispatch({ field: "list3", value: list3Data });
    };

    sliceData();
  }, [haikus, sizeMemo]);

  return (
    <section className="NO:max-h-[33rem] container grid grid-cols-1 gap-6 overflow-hidden px-4 py-8 sm:grid-cols-2 md:px-12 md:py-8 lg:grid-cols-3 lg:gap-8">
      {haikuLists.list1.length > 0 ? (
        <>
          <ul className="space-y-8">
            {haikuLists.list1.map((item) => {
              return <HaikuCard contents={item} key={item.id} />;
            })}
          </ul>
          <ul className="hidden space-y-8 divide-y divide-accent sm:block md:divide-none">
            {haikuLists.list2.map((item) => {
              return <HaikuCard contents={item} key={item.id} />;
            })}
          </ul>
          <ul className="hidden space-y-8 divide-y divide-accent md:divide-none lg:block">
            {haikuLists.list3.map((item) => {
              return <HaikuCard contents={item} key={item.id} />;
            })}
          </ul>
        </>
      ) : (
        <HaikuCardsSkeleton />
      )}
    </section>
  );
}

export function HaikuCardsSkeleton() {
  return (
    <>
      <ul className="space-y-8">
        <HaikuCardSkeleton />
        <HaikuCardSkeleton variant="nohashtags" />
        <HaikuCardSkeleton />
      </ul>
      <ul className="hidden space-y-8 sm:block">
        <HaikuCardSkeleton variant="nohashtags" />
        <HaikuCardSkeleton />
        <HaikuCardSkeleton variant="nohashtags" />
      </ul>
      <ul className="hidden space-y-8 lg:block">
        <HaikuCardSkeleton />
        <HaikuCardSkeleton variant="nohashtags" />
        <HaikuCardSkeleton />
      </ul>
    </>
  );
}
