import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function TopHashtags() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Hashtags</CardTitle>
        <CardDescription className="truncate">
          The top #hashtags of all time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-flow-row grid-cols-2 gap-4 py-4 ">
          <Link
            href="/"
            className="truncate text-primary underline-offset-4 hover:underline "
          >
            #mood
          </Link>
          <Link
            href="/"
            className="truncate text-primary underline-offset-4 hover:underline "
          >
            #contemporarixepliasadkljkasd
          </Link>
          <Link
            href="/"
            className="truncate text-primary underline-offset-4 hover:underline "
          >
            #washingmachine
          </Link>
          <Link
            href="/"
            className="truncate text-primary underline-offset-4 hover:underline "
          >
            #contemporarixepliasadkljkasd
          </Link>
          <Link
            href="/"
            className="truncate text-primary underline-offset-4 hover:underline "
          >
            #contemporarixepliasadkljkasd
          </Link>
          <Link
            href="/"
            className="truncate text-primary underline-offset-4 hover:underline "
          >
            #contemporarixepliasadkljkasd
          </Link>
          <Link
            href="/"
            className="truncate text-primary underline-offset-4 hover:underline "
          >
            #contemporarixepliasadkljkasd
          </Link>
          <Link
            href="/"
            className="truncate text-primary underline-offset-4 hover:underline "
          >
            #contemporarixepliasadkljkasd
          </Link>
          <Link
            href="/"
            className="truncate text-primary underline-offset-4 hover:underline "
          >
            #contemporarixepliasadkljkasd
          </Link>
          <Link
            href="/"
            className="truncate text-primary underline-offset-4 hover:underline "
          >
            #contemporarixepliasadkljkasd
          </Link>
          <Link
            href="/"
            className="truncate text-primary underline-offset-4 hover:underline "
          >
            #contemporarixepliasadkljkasd
          </Link>
          <Link
            href="/"
            className="truncate text-primary underline-offset-4 hover:underline "
          >
            #contemporarixepliasadkljkasd
          </Link>
          <Link
            href="/"
            className="truncate text-primary underline-offset-4 hover:underline "
          >
            #contemporarixepliasadkljkasd
          </Link>
          <Link
            href="/"
            className="truncate text-primary underline-offset-4 hover:underline "
          >
            #contemporarixepliasadkljkasd
          </Link>
        </div>
      </CardContent>
      {/* <CardFooter>
          <div className="grid grid-flow-row justify-items-center gap-8 py-4">
            <Button variant={"link"} className=" text-2xl" asChild>
              <Link href="/">#anonymous</Link>
            </Button>
          </div>
        </CardFooter> */}
    </Card>
  );
}
