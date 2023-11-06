import Image from "next/image";
import logo from "@/app/logo.png";
import TopHashtags from "@/components/TopHashtags";
import AuthCard from "@/components/AuthCard";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { UserWithProfile } from "@/types";
import CreateHaikuCard from "@/components/CreateHaikuCard";

// export const revalidate = 0;

// export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  const user = session?.user;

  const { data, error } = await supabase
    .from("haikus")
    .select(
      `*,
      hashtags(*),
      profile: profiles(*)`
    )
    .order("id", { ascending: false });

  return (
    <>
      <pre>{JSON.stringify(data)}</pre>
      <section className="container flex border-b border-secondary md:p-8 md:pb-4 p-4">
        <div className="hidden min-h-full w-1/4 p-4 md:block">
          <TopHashtags />
        </div>
        <div className="flex h-full w-full flex-col items-center divide-y divide-secondary md:w-2/4">
          <div className="relative my-4 h-14 w-14">
            <Image alt="..." src={logo} height={56} width={56} />
          </div>
          <div className="flex h-16 w-full divide-x divide-secondary bg-background text-foreground">
            <button className="grow divide-x">For you</button>
            <button className="grow divide-x">Recent</button>
          </div>
          <CreateHaikuCard user={user as UserWithProfile} />
        </div>
        <div className="hidden min-h-full w-1/4 p-4 md:block">
          <AuthCard user={user as UserWithProfile}></AuthCard>
        </div>
      </section>
      {/* <HaikuCardsSection serverHaikus={data ?? []} /> */}
    </>
  );
}
