import { SWRConfig } from "swr";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
  return (
    <SWRConfig value={{ suspense: true }}>
      <RouterProvider router={router} />
    </SWRConfig>
  );
}

export default App;
