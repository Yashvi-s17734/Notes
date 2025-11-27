"use client";

import { useSearchParams } from "next/navigation";
import HomeUI from "./HomeUI";

export default function HomeClient() {
  const params = useSearchParams();
  const currentPage = Number(params.get("page") || "1");

  return <HomeUI currentPage={currentPage} />;
}
