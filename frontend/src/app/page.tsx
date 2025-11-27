// app/page.tsx
import { Suspense } from "react";
import PageClient from "./page-client";

// This forces the page to be dynamic (no static prerendering)
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading notes...</div>}>
      <PageClient />
    </Suspense>
  );
}