"use client";

import anime from "animejs/lib/anime.es.js";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useReducer, useRef, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserWithProfile } from "@/types";

type Action =
  | { type: "SET_LIKES"; value: number }
  | { type: "INCREMENT_LIKES" };

export function HaikuLikesButton({
  haikuId,
  likesTotal,
  user,
}: {
  haikuId: number;
  likesTotal: number;
  user: UserWithProfile | null;
}) {
  const initialState = likesTotal;

  function likesReducer(state: typeof initialState, action: Action) {
    switch (action.type) {
      case "SET_LIKES":
        return action.value;
      case "INCREMENT_LIKES":
        return state + 1;
      default:
        return state;
    }
  }

  const disabled = user ? false : true;

  const [clicked, triggerClick] = useReducer(() => true, false);
  const [likes, dispatch] = useReducer(likesReducer, initialState);
  const [newLikesTotal, setNewLikesTotal] = useState(likesTotal)

  const likeRef = useRef<HTMLButtonElement>(null);
  const likesTotalRef = useRef<HTMLButtonElement>(null);
  const supabase = createClientComponentClient();
  const debouncedLikes = useDebounce(likes, 5000);

  const animateLiked = async () => {
    if (likeRef.current && likesTotalRef.current) {
      anime({
        targets: likeRef.current,
        scale: 1.35,
        direction: "alternate",
        duration: 35,
        easing: "linear",
      });

      triggerClick();
      dispatch({ type: "INCREMENT_LIKES" });
    }
  };

  useEffect(() => {
    const incrementLikes = async () => {
      const { data, error } = await supabase.rpc("increment_likes", {
        haiku_id: haikuId,
        likes_to_add: debouncedLikes - newLikesTotal,
      });
      console.log(data, error);
      
      return data;
    };

    const updateLikes = async () => {
      if (newLikesTotal < debouncedLikes) {
        const newLikesTotal = await incrementLikes();
        setNewLikesTotal(newLikesTotal)
      }
    }

    updateLikes()
  }, [debouncedLikes, newLikesTotal, supabase, haikuId, likesTotal]);

  return (
    <>
      <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
        <button
          onClick={animateLiked}
          ref={likeRef}
          disabled={disabled}
          aria-disabled={disabled}
        >
          {clicked ? (
            <AiFillHeart size={24} fill={"hsla(24.6 95% 53.1%)"} />
          ) : (
            <AiOutlineHeart size={24} />
          )}
        </button>
        <span ref={likesTotalRef}>{likes > 0 ? likes : ""}</span>
      </div>
    </>
  );
}
