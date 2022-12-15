import { Navigate } from "react-router-dom";
import useSwr from "swr";

export function Protected({ children }: { children: JSX.Element }) {
  const { error } = useSwr("http://localhost:3000/api/auth/me", async (url) => {
    const res = await fetch(url, { credentials: "include" });
    if (res.status === 401) throw new Error("Not Authorized");
    return await res.json();
  });
  if (error) return <Navigate to="/login" replace />;
  return children;
}
