"use client";

import { useEffect, useState } from "react";

const loadingMessages: string[] = [
  "Some things are worth waiting for, this is one of them",
  "Hold on a sec, we're getting there",
  "It's a big CMS so it might take a while",
  "Just a moment, we're almost there",
  "We're working on it, please wait",
  "How about a joke while we wait? Just kidding, we're almost there",
  "Patience is a virtue, we're almost there :)",
  "I promise it's worth the wait",
  "All good things come to those who wait",
  "I know it's taking a while, but we're almost there",
];

export default function Loading() {
  const [activeMessageIndex, setActiveMessageIndex] = useState(
    Math.floor(Math.random() * loadingMessages.length)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMessageIndex((prev) => {
        if (prev === loadingMessages.length - 1) {
          return 0;
        } else {
          return prev + 1;
        }
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid place-items-center fixed top-0 left-0 w-full h-full bg-white">
      <div className="space-y-7">
        <svg
          fill="#000000"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          width="125px"
          height="125px"
          viewBox="0 0 92.00 92.00"
          enableBackground="new 0 0 92 92"
          stroke="#000000"
          strokeWidth="0.00092"
          className="mx-auto animate-pulse"
        >
          <g strokeWidth="0"></g>
          <g strokeLinecap="round" strokeLinejoin="round"></g>
          <g>
            <path d="M79.8,25.2C79.1,24.5,78.1,24,77,24H67v-1.8C67,10.5,57.4,1,46.2,1h-0.4C34.6,1,25,10.5,25,22.2V24H15 c-2.2,0-4,1.9-4,4.2V87c0,2.2,1.8,4,4,4h62c2.2,0,4-1.8,4-4l0-58.9C81,27.1,80.6,26,79.8,25.2z M33,22.2C33,14.9,39,9,45.8,9h0.4 C53,9,59,14.9,59,22.2V24H33V22.2z M73,83H19V32h6v6.9c0,2.2,1.8,4,4,4s4-1.8,4-4V32h26v6.9c0,2.2,1.8,4,4,4s4-1.8,4-4V32h6L73,83z"></path>
          </g>
        </svg>
        <p className="text-center font-medium text-sm">
          {loadingMessages[activeMessageIndex]}
        </p>
      </div>
    </div>
  );
}
