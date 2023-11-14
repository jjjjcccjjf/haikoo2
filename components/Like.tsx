"use client";

import anime from "animejs/lib/anime.es.js";
import { AiOutlineHeart } from "react-icons/ai";

import { useRef } from "react";

export function Like({ haikuId }: { haikuId: string }) {
  const likeRef = useRef<HTMLButtonElement>(null);

  const animateLiked = () => {
    if (likeRef.current) {
      anime({
        targets: likeRef.current,
        scale: 1.1,
        direction: 'alternate',
        duration: 50,
        easing: 'linear'
      })
    }
  };

  return (
    <>
      <button className="" onClick={animateLiked} ref={likeRef}>
        <AiOutlineHeart size={24} />
      </button>
    </>
  );
}
