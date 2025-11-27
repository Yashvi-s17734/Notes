"use client";

import dynamic from "next/dynamic";

// Lazy-load real source so SSR never touches hooks
const HomeReal = dynamic(() => import("./page-realsource"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function HomeClient() {
  return <HomeReal />;
}
