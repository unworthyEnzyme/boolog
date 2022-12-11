import useSwr from "swr";

export function Protected({ children }: { children: JSX.Element }) {
  useSwr("http://localhost:3000/api/auth/me", async (url) => {
    const res = await fetch(url);
    if (res.status === 401) throw new Error("Not Authorized");
    return await res.json();
  });
  return children;
}
