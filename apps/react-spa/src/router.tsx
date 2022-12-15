import { createBrowserRouter, Navigate } from "react-router-dom";
import { Login } from "./components/Login";
import { Protected } from "./components/Protected";
import { Signup } from "./components/Signup";
import { HomePage } from "./components/HomePage";
import { ErrorBoundary } from "react-error-boundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary
        fallbackRender={({ error }) => {
          if (error.message === "Not Authorized") {
            return <Navigate to="/login" relative="route"></Navigate>;
          }
          return <div>{error.message}</div>;
        }}
      >
        <Protected>
          <HomePage />
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
