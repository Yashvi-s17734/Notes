// app/page.tsx (SERVER COMPONENT — no hooks)
import { Suspense } from "react";
import HomeClient from "./page-client";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient />
    </Suspense>
  );
}
