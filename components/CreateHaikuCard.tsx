"use client";

import { Textarea } from "@/components/ui/textarea";
import { postHaiku } from "@/lib/actions";
import { GenericResponseType } from "@/types";
import { User } from "@supabase/supabase-js";
import React, { startTransition, useReducer, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { BsPatchQuestion } from "react-icons/bs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Action =
  | { type: "UPDATE_FIELD"; field: string; value: string }
  | { type: "RESET_STATE" };

const initialState = {
  hashtags: "",
  body: "",
};

function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET_STATE":
      return { ...initialState };
    default:
      return state;
  }
}

export default function CreateHaikuCard({ user }: { user: User | null }) {
  const initialFormState = {
    status: null,
    message: null,
  };

  const [formData, dispatch] = useReducer(reducer, initialState);
  const [pending, setPending] = useState(false);
  const [state, formAction] = useFormState(
    postHaiku,
    initialFormState as GenericResponseType
  );
  const formRef = useRef<HTMLFormElement>(null);

  const updateErrorMessage = (
    element: HTMLFormElement,
    errorMessage: string | null
  ) => {
    // Set the 'data-after' attribute to the new error message
    element.dataset.after = errorMessage ?? "";
  };

  const handleFieldChange = (field: string, value: string) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  };

  const handleReset = () => {
    dispatch({ type: "RESET_STATE" });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    const formData = new FormData(event.currentTarget);

    const body = String(formData.get("body"));

    const isHaiku = (await import("@/lib/clientUtils")).isHaiku;
    const res = await isHaiku(body);

    if (res.status === false) {
      if (formRef.current) {
        updateErrorMessage(formRef.current, res.message);
        setPending(false);
      }
    } else {
      if (formRef.current) {
        handleReset();
        updateErrorMessage(formRef.current, "");

        startTransition(() => {
          // programmatically invoke the server action here
          formAction(formData);
          setPending(false);
        });
      }
    }
  };

  return (
    <form
      className="relative flex w-full flex-col lg:p-5 pt-8 pb-4 text-foreground after:absolute after:right-12 after:top-28 after:text-destructive after:content-[attr(data-after)] "
      onSubmit={handleFormSubmit}
      ref={formRef}
      data-after=""
    >
      <Textarea
        className="min-h-[128px] w-full resize-none bg-background p-5 placeholder:text-muted-foreground focus-visible:outline-0 focus-visible:outline-accent"
        name="body"
        placeholder="Create your first Haiku"
        value={formData.body}
        onChange={(e) => handleFieldChange("body", e.target.value)}
        required
      />
      <span className="absolute right-12 top-28 text-destructive">
        {state.status === false && state?.message}
      </span>
      <div className="mt-4 flex flex-col">
        <div>
          <Input
            type="text"
            name="hashtags"
            value={formData.hashtags}
            onChange={(e) => {
              handleFieldChange("hashtags", e.target.value);
            }}
            className=" w-full bg-transparent px-5 py-2 xl:w-1/2"
            pattern="^#(?:\w+)(?:\s*#(?:\w+))*$"
            title="#hashtags #must #be #like #this"
            placeholder="#hashtags #go #hither"
            autoComplete="off"
          ></Input>
        </div>
        <div className="mt-4 flex justify-between ">
          <div className="flex">
            <button
              className="group flex h-11 items-center gap-2 rounded-md px-4 py-3 text-secondary-foreground hover:bg-secondary"
              type="button"
            >
              <BsPatchQuestion
                size={24}
                className="fill-muted-foreground group-hover:fill-secondary-foreground"
              />
              <span className="hidden text-sm group-hover:block">
                Your Haiku must follow the 5-7-5 syllabic structure.
              </span>
            </button>
          </div>
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={pending}
              aria-disabled={pending}
              variant={"default"}
              size={"lg"}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
