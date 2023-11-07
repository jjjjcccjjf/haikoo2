"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function ForgotPassword() {
  const { toast } = useToast();
  const params = useSearchParams();

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  console.log(params);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isPasswordsMatching = newPass === confirmPass;
    if (isPasswordsMatching) {
      return console.log(isPasswordsMatching);
    }

    toast({
      title: "Uh oh!",
      description:
        "There seems to be a mismatch in the New password and Confirm new password fields. Please double check.",
    });
  };

  return (
    <>
      <section className="flex h-screen w-screen items-center justify-center">
        <Card className="">
          <CardHeader>
            <CardTitle>Password Reset Form</CardTitle>
            <CardDescription>Please provide your new password</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="new_password" className="">
                    New password
                  </Label>
                  <Input
                    id="new_password"
                    placeholder="New password"
                    name="new_password"
                    type="password"
                    onChange={(e) => setNewPass(e.target.value)}
                    required={true}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="new_password" className="">
                    Confirm new password
                  </Label>
                  <Input
                    id="confirm_password"
                    placeholder="Confirm password"
                    name="confirm_password"
                    type="password"
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required={true}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Uh oh!</AlertTitle>
                    <AlertDescription></AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/">Nevermind, back to home</Link>
              </Button>
              <Button type="submit">Reset Password</Button>
            </CardFooter>
          </form>
        </Card>
      </section>
    </>
  );
}
