"use client";

import { useSearchParams } from "next/navigation";
import HomeRealContent from "./HomeRealContent";

export default function NotesWithPagination() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");

  return <HomeRealContent currentPage={currentPage} />;
}