import { SiVercel } from "react-icons/si";
import { NavLink } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between bg-slate-900 pt-4 px-4">
      <NavLink to="/" relative="route">
        <SiVercel size={32} className="text-slate-100" />
      </NavLink>
      <div className="flex gap-4 items-center">
        <NavLink
          to="/login"
          relative="route"
          className="text-slate-100 hover:bg-sky-400 bg-pink-400 py-1 px-2 rounded-md"
        >
          Login
        </NavLink>
        <NavLink
          to="/signup"
          relative="route"
          className="text-slate-100 hover:underline underline-offset-4"
        >
          Signup
        </NavLink>
      </div>
    </nav>
  );
}
