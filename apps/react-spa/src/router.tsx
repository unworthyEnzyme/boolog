import { createBrowserRouter, Navigate } from "react-router-dom";
import { Login } from "./components/Login";
import { Protected } from "./components/Protected";
import { Signup } from "./components/Signup";
import { ErrorBoundary } from "react-error-boundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary fallback={<Navigate to="/login" />}>
        <Protected>
          <div>hello world</div>
        </Protected>
      </ErrorBoundary>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);
