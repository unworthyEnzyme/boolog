import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import classnames from "classnames";

type FormValues = {
  username: string;
  password: string;
};

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    await res.json();
    if (res.ok) navigate("/", { replace: true, relative: "route" });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-1 bg-slate-800 px-5 rounded-lg pt-20 pb-12"
      >
        <label htmlFor="username" className="text-slate-100 text-sm opacity-75">
          Username
        </label>
        <input
          type="text"
          id="username"
          {...register("username", { required: true })}
          className={classnames(
            "bg-slate-900 rounded-lg py-1 px-2 text-slate-100",
            {
              "ring-red-400 ring-1": errors.username,
            }
          )}
        />
        <label htmlFor="password" className="text-slate-100 text-sm opacity-75">
          Password
        </label>
        <input
          type="password"
          id="password"
          {...register("password", { required: true })}
          className={classnames(
            "bg-slate-900 rounded-lg py-1 px-2 text-slate-100",
            {
              "ring-red-400 ring-1": errors.password,
            }
          )}
        />
        <button
          type="submit"
          className="text-slate-100 px-4 py-1 bg-pink-400 hover:bg-opacity-90 rounded-lg text-center mt-2 text-sm"
        >
          Login
        </button>
        <Link
          to="/signup"
          relative="route"
          className="text-xs text-sky-400 mt-2 opacity-90 hover:opacity-100"
        >
          Don't have an account?
        </Link>
      </form>
    </div>
  );
}
