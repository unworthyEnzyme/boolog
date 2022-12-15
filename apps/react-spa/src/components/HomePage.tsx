import { Suspense } from "react";
import { BlogFeed } from "./BlogFeed";

export function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogFeed />
    </Suspense>
  );
}
