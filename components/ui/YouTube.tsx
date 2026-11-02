"use client";

import Image from "next/image";
import { useState } from "react";

/** Accepts a YouTube id or any youtube.com / youtu.be link. */
function videoId(input: string) {
  const m = input.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1]! : input;
}

/**
 * "Lite" YouTube embed: shows the video's thumbnail with a play button and only loads
 * YouTube's player (from the privacy-friendly youtube-nocookie domain) when clicked.
 * Keeps the page fast and avoids YouTube cookies until someone actually plays it.
 */
export function YouTube({ id, title }: { id: string; title: string }) {
  const vid = videoId(id);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden bg-black">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play video: ${title}`}>
          <Image
            src={`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 768px) 70vw, 100vw"
            className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="bg-paper px-4 py-2 text-nav uppercase text-red group-hover:bg-red group-hover:text-paper">
              ▶ Play
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
