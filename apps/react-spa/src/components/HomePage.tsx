import { Suspense } from "react";
import { BlogFeed } from "./BlogFeed";

export function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="bg-slate-900 min-h-screen">
        <BlogFeed />
      </main>
    </Suspense>
  );
}
