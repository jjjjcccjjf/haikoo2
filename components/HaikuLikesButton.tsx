"use client";

import anime from "animejs/lib/anime.es.js";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useReducer, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function HaikuLikesButton({
  haikuId,
  likesTotal,
}: {
  haikuId: number;
  likesTotal: number;
}) {
  const [clicked, triggerClick] = useReducer(() => true, false);
  const [likes, incrementLikes] = useReducer((prev) => prev + 1, likesTotal);

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
      incrementLikes();
    }
  };

  useEffect(() => {
    const incrementLikes = async () => {
      const { data, error } = await supabase
      .rpc('increment_likes', {
        haiku_id: haikuId, 
        likes_to_add: debouncedLikes
      })
      return data
    };
    if(likesTotal < debouncedLikes) {
      incrementLikes();
      // console.log(likesTotal, likes, debouncedLikes);
    }
  }, [debouncedLikes]);

  return (
    <>
      <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
        <button onClick={animateLiked} ref={likeRef} 
          disabled={true}
          aria-disabled={true}
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
