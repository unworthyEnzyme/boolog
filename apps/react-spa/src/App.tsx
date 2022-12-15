import { SWRConfig } from "swr";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Suspense } from "react";

function App() {
  return (
    <SWRConfig value={{ suspense: true }}>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </SWRConfig>
  );
}

export default App;
