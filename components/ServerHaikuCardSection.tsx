import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import HaikuCard from "./HaikuCard";
import { TypographyP } from "./ui/typography";
import { UserWithProfile } from "@/types";

export default async function ServerHaikuCardSection({user} : {user: UserWithProfile | null}) {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from("haikus")
    .select(
      `*,
    hashtags(*),
    profile: profiles(*)`
    )
    .order("id", { ascending: false });

  const divideBy = 3;
  const haikus = data ?? [];

  const list1Data = haikus.slice(0, haikus.length / divideBy);
  const list2Data = haikus.slice(
    haikus.length / divideBy,
    (2 * haikus.length) / divideBy
  );
  const list3Data = haikus.slice((2 * haikus.length) / divideBy);

  const haikuLists = {
    list1: list1Data,
    list2: list2Data,
    list3: list3Data,
  };

  return (
    <section className="NO:max-h-[33rem] container grid grid-cols-1 gap-8 overflow-hidden px-4 py-8 sm:grid-cols-2 md:px-12 md:py-8 lg:grid-cols-3">
      {haikuLists.list1.length +
        haikuLists.list2.length +
        haikuLists.list3.length >
      0 ? (
        <>
          <ul className="space-y-8">
            {haikuLists.list1.map((item) => {
              return <HaikuCard contents={item} key={item.id} user={user} />;
            })}
          </ul>
          <ul className="space-y-8 ">
            {haikuLists.list2.map((item) => {
              return <HaikuCard contents={item} key={item.id} user={user} />;
            })}
          </ul>
          <ul className="space-y-8 ">
            {haikuLists.list3.map((item) => {
              return <HaikuCard contents={item} key={item.id} user={user} />;
            })}
          </ul>
        </>
      ) : (
        <TypographyP className="text-muted-foreground">
          No items yet
        </TypographyP>
      )}
    </section>
  );
}
