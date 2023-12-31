"use client";

import anonymouse from "@/app/anonymouse.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GenericResponseType, UserWithProfile } from "@/types";
import Image from "next/image";
import { DispatchWithoutAction, useEffect, useReducer, useState } from "react";
import { FaFacebookSquare, FaGoogle } from "react-icons/fa";
import { BiMailSend } from "react-icons/bi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { TypographyP } from "./ui/typography";

import {
  resetPassword,
  signIn,
  signOut,
  signUp,
  updateProfile,
} from "@/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AuthCard({ user }: { user: UserWithProfile | null }) {
  return (
    <Card className="h-104">
      <CardHeader>
        <CardTitle>{user ? "Welcome back" : "Welcome to Haikoo"}</CardTitle>
        {!user && (
          <CardDescription>
            Create an account or post anonymously
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {user ? <UserCard user={user} /> : <LoginForm />}
      </CardContent>
      {user && (
        <CardFooter className="flex justify-end">
          <LogoutForm />
        </CardFooter>
      )}
    </Card>
  );
}

function UserCard({ user }: { user: UserWithProfile }) {
  const [isEditMode, toggleEditMode] = useReducer((prev) => !prev, false);

  return (
    <>
      <div>
        <div className="h-20 bg-[url('/plus.svg')]"></div>
        <div className="relative">
          <div className="overflow-hidden  absolute -top-12 rounded-full border-2 border-orange-50 w-20 h-20">
            <Image
              src={user.profile.avatar_url ?? anonymouse}
              // height={80}
              // width={80}
              alt="..."
              fill={true}
              className=" object-cover"
            ></Image>
          </div>
          <Button
            className="absolute right-0 font-normal text-muted-foreground"
            variant={"link"}
            onClick={toggleEditMode}
            size={"sm"}
          >
            Edit profile
          </Button>
        </div>
      </div>
      <div className="mt-14 flex items-center justify-between">
        {isEditMode ? (
          <UpdateProfileForm user={user} toggleEditMode={toggleEditMode} />
        ) : (
          <Profile user={user} />
        )}
      </div>
    </>
  );
}

// TODO: Fix this server action
function UpdateProfileForm({
  user,
  toggleEditMode,
}: {
  user: UserWithProfile;
  toggleEditMode: DispatchWithoutAction;
}) {
  const [state, formAction] = useFormState(updateProfile, {
    status: null,
    message: null,
  } as GenericResponseType);
  const [username, setUsername] = useState(user.profile?.username ?? "");
  const [status, setStatus] = useState(user.profile?.status ?? "");

  useEffect(() => {
    if (state.status) {
      toggleEditMode();
    }
  }, [state, toggleEditMode]);

  return (
    // <form className="flex w-full flex-col">
    <form className="flex w-full flex-col" action={formAction}>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="avatar" className="text-muted-foreground">
          Update Avatar
        </Label>
        <Input
          id="avatar"
          type="file"
          className="file:text-muted-foreground"
          name="avatar"
          accept="image/*"
        />
      </div>
      <div className="relative mt-6">
        <Label htmlFor="username" className="text-muted-foreground">
          Update Username
        </Label>

        <Input
          type="text"
          id="username"
          className="max-full bg-transparent pl-7 outline-none"
          name="username"
          required
          placeholder="awesome_user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <span className="pointer-events-none absolute left-3 top-8 text-muted-foreground">
          @
        </span>
      </div>
      <div className="mt-6 ">
        <Label htmlFor="status" className="text-muted-foreground">
          Update Status
        </Label>

        <Textarea
          className="resize-none"
          placeholder="Edit your status here"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          name="status"
          id="status"
        />
      </div>
      <UpdateProfileSubmit />
    </form>
  );
}

function UpdateProfileSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="mt-6"
      size={"lg"}
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      Save Changes
    </Button>
  );
}

function Profile({ user }: { user: UserWithProfile }) {
  return (
    <div className="flex flex-col">
      <TypographyP className="font-bold">@{user.profile?.username}</TypographyP>
      <TypographyP>
        {user.profile?.status ?? (
          <span className="text-sm italic text-muted-foreground">
            No status yet
          </span>
        )}
      </TypographyP>
    </div>
  );
}

function LoginForm() {
  const [state, formAction] = useFormState(signUp, null);

  return (
    <>
      <form className="relative flex flex-col gap-4" action={formAction}>
        <div className="flex gap-4">
          <Button
            variant={"outline"}
            size={"lg"}
            type="button"
            className="basis-1/2"
            onClick={async () => {
              const supabase = createClientComponentClient();
              const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  queryParams: {
                    access_type: "offline",
                    prompt: "consent",
                  },
                  redirectTo: `http://localhost:3000/auth/callback`,
                },
              });
            }}
          >
            <FaGoogle size={20}></FaGoogle>
          </Button>
          <Button
            variant={"outline"}
            size={"lg"}
            type="button"
            className="basis-1/2"
            onClick={async () => {
              const supabase = createClientComponentClient();
              const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "facebook",
                options: {
                  redirectTo: `http://localhost:3000/auth/callback`,
                },
              });
            }}
          >
            <FaFacebookSquare size={20}></FaFacebookSquare>
          </Button>
        </div>
        {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div> */}
        <label htmlFor="auth_email" className="sr-only">
          Email
        </label>
        <Input
          type="text"
          name="email"
          id="auth_email"
          placeholder="you@example.com"
          required
        />
        <label htmlFor="auth_password" className="sr-only">
          Password
        </label>

        <Input
          type="password"
          name="password"
          placeholder="••••••••"
          id="auth_password"
          required
        />
        <div className="flex gap-4">{state && state.message}</div>
        <div className="flex gap-4">
          <SignInButton />
          <SignUpButton />
        </div>
      </form>
      <div className="flex items-center justify-center mt-3">
        <ResetPasswordForm />
      </div>
    </>
  );
}

function ResetPasswordForm() {
  const [state, formAction] = useFormState(resetPassword, {
    message: null,
    status: null,
  } as GenericResponseType);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="font-normal text-muted-foreground">
          Reset your password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            A magic link will be sent to automagically log you in. You can then
            change your password afterwards.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Your Email
              </Label>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                name="email"
                required
                className="col-span-3"
              />
            </div>
            {state.status !== null && (
              <Alert
                variant={state.status === true ? "default" : "destructive"}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <ResetButton></ResetButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function __ResetPasswordForm() {
  const [state, formAction] = useFormState(resetPassword, {
    message: null,
    status: null,
  } as GenericResponseType);

  return (
    <>
      <form action={formAction} className="">
        <Accordion type="single" collapsible className="w-full mt-3">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="justify-center items-center text-sm font-normal text-muted-foreground">
              Reset your password
            </AccordionTrigger>
            <AccordionContent className="p-1">
              <div className="flex gap-2">
                <Label htmlFor="email" className="sr-only">
                  Your email
                </Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="example@email.com"
                  type="email"
                />
                <ResetButton />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
      {state.status !== null && (
        <Alert variant={state.status === true ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </>
  );
}

function ResetButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} aria-disabled={pending}>
      Reset password
    </Button>
  );
}

function SignUpButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      variant={"default"}
      type="submit"
      size={"lg"}
      className="basis-1/2"
      aria-disabled={pending}
      disabled={pending}
      //   formAction={formAction}
    >
      Sign Up
    </Button>
  );
}

function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      variant={"default"}
      type="submit"
      size={"lg"}
      className="basis-1/2"
      aria-disabled={pending}
      disabled={pending}
      formAction={signIn}
    >
      Sign In
    </Button>
  );
}

// REDO this part to support useFormStatus
function LogoutForm() {
  return (
    <form action={signOut} className="">
      <Button
        type="submit"
        className="font-normal text-muted-foreground"
        variant={"link"}
        size={"sm"}
      >
        Logout
      </Button>
    </form>
  );
}
