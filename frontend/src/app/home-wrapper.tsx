import { Suspense } from "react";
import HomeClient from "./page-client";

export default function HomeWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient />
    </Suspense>
  );
}
