"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function AuthCodeError() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-sm flex gap-4 flex-col">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Uh oh!</AlertTitle>
          <AlertDescription>
            {message ?? "Unknown error occured"}
          </AlertDescription>
        </Alert>
        <Button variant={"outline"} asChild>
          <Link href="/" className="flex gap-2 items-center justify-center">
            <ChevronLeft size={12} />
            <span>Take me back to home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
