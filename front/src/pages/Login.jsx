import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import AuthLayout from "../components/AuthLayout"
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/boards";
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // backend expects { identifier, password }
      const res = await api.post('/signin', { identifier: id, password }, { withCredentials: true });
      if (res?.data?.token) {
        sessionStorage.setItem('token', res.data.token);
      }
      nav(from, { replace: true });

    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Login Failed");
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="TaskBoard" subtitle="Welcome back! Please login to your account.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full mt-4">
        {/* Username */}
        <div className="relative">
          <input
            id="username-login"
            type="text"
            placeholder=""
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            className="peer w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:placeholder-transparent transition placeholder-gray-400"
          />
          <label htmlFor="username-login" className="absolute left-3 transition-all duration-150 pointer-events-none text-gray-500 top-0 -translate-y-6 opacity-0 text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:opacity-100 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-8 peer-focus:opacity-100 peer-focus:text-base peer-focus:font-semibold peer-focus:text-blue-500 peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:-translate-y-8 peer-not-placeholder-shown:opacity-100 peer-not-placeholder-shown:text-base peer-not-placeholder-shown:font-semibold">Username or Email</label>
        </div>

        {/* Password */}
        <div className="relative mt-1">
          <input
            id="password-login"
            type={showPassword ? "text" : "password"}
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="peer w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:placeholder-transparent transition placeholder-gray-400"
          />
          <label htmlFor="password-login" className="absolute left-3 transition-all duration-150 pointer-events-none text-gray-500 top-0 -translate-y-6 opacity-0 text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:opacity-100 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:-translate-y-8 peer-focus:opacity-100 peer-focus:text-base peer-focus:font-semibold peer-focus:text-blue-500 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:-translate-y-8 peer-not-placeholder-shown:opacity-100 peer-not-placeholder-shown:text-base peer-not-placeholder-shown:font-semibold">Password</label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="relative overflow-hidden cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transition-all group disabled:opacity-60"
        >
          <span className="relative z-10">{loading ? "Logging In ..." : "Login"}</span>
          <span className="absolute inset-0 bg-blue-400 opacity-0 group-active:opacity-30 transition duration-300"></span>
        </button>
      </form>
      {err && <p className="text-red-500 text-sm mt-4">{err}</p>}
      <p className="text-sm text-gray-600 mt-4 text-center">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="text-blue-500 hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
