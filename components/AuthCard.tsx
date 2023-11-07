"use client";

import endan from "@/app/endan.jpg";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { DispatchWithoutAction, useEffect, useReducer, useState } from "react";
import { FaFacebookSquare, FaGoogle } from "react-icons/fa";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { TypographyP } from "./ui/typography";
// import { updateProfile } from "@/utils/actions";
// import supabase from "@/utils/supabase";
import { GenericResponseType, UserWithProfile } from "@/types";

import { useFormState, useFormStatus } from "react-dom";
import { signIn, signOut, signUp, updateProfile } from "@/lib/actions";

export default function AuthCard({ user }: { user: UserWithProfile | null }) {
  return (
    <Card>
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
          <Image
            src={endan}
            height={80}
            width={80}
            alt="..."
            className=" absolute -top-12 rounded-full border-2 border-orange-50"
          ></Image>
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
      <div className="relative">
        <Input
          type="text"
          className="max-full bg-transparent pl-7 outline-none"
          name="username"
          required
          placeholder="awesome_user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <span className="pointer-events-none absolute left-3 top-2 text-muted-foreground">
          @
        </span>
      </div>
      <Textarea
        className="mt-6 resize-none"
        placeholder="Edit your status here"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        name="status"
      />
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
    <form className="relative flex flex-col gap-4" action={formAction}>
      <div className="flex gap-4">
        <Button
          variant={"outline"}
          size={"lg"}
          type="button"
          className="basis-1/2"
        >
          <FaGoogle size={20}></FaGoogle>
        </Button>
        <Button
          variant={"outline"}
          size={"lg"}
          type="button"
          className="basis-1/2"
        >
          <FaFacebookSquare size={20}></FaFacebookSquare>
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
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

      <Button
        variant={"link"}
        size={"lg"}
        type="button"
        className="font-normal text-muted-foreground"
      >
        Reset your password
      </Button>
    </form>
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
