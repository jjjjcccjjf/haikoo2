import Image from "next/image";
import logo from "@/app/logo.png";
import TopHashtags from "@/components/TopHashtags";

export default function Home() {
  return (
    <>
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
          {/* <CreateHaikuCard user={userWithProfile} /> */}
        </div>
        <div className="hidden min-h-full w-1/4 p-4 md:block">
          {/* <AuthCard user={userWithProfile}></AuthCard> */}
        </div>
      </section>
      {/* <HaikuCardsSection serverHaikus={data ?? []} /> */}
    </>
  );
}
