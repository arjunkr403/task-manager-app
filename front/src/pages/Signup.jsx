import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { Link, useNavigate } from "react-router-dom"
import AuthLayout from "../components/AuthLayout"
import api from "../services/api"

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err,setErr]=useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    async function handleSignup(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const res=await api.post('/auth/signup',{username,email,password},{
                withCredentials:true //attach cookies
            });
            if(res?.data?.token) {
                sessionStorage.setItem('token',res.data.token);
            }
            nav('/boards');
        } catch (err) {
            console.error(err);
            setErr(err?.response?.data?.message || "signup failed");
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <AuthLayout title="TaskBoard" subtitle="Sign up to start managing your boards.">
            <form onSubmit={handleSignup} className="flex flex-col gap-5 w-full mt-4">
                {/* Username */}
                <div className="relative">
                    <input
                        id="username-signup"
                        type="text"
                        placeholder=""
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="peer w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:placeholder-transparent transition placeholder-gray-400"
                    />
                    <label htmlFor="username-signup" className="absolute left-3 transition-all duration-150 pointer-events-none text-gray-500 top-0 -translate-y-6 opacity-0 text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:opacity-100 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-8 peer-focus:opacity-100 peer-focus:text-base peer-focus:font-semibold peer-focus:text-blue-500 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-8 peer-not-placeholder-shown:opacity-100 peer-not-placeholder-shown:text-lg peer-not-placeholder-shown:font-semibold">Username</label>
                </div>

                {/* Email */}
                <div className="relative mt-2">
                    <input
                        id="email-signup"
                        type="email"
                        placeholder=""
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="peer w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:placeholder-transparent transition placeholder-gray-400"
                    />
                    <label htmlFor="email-signup" className="absolute left-3 transition-all duration-150 pointer-events-none text-gray-500 top-0 -translate-y-6 opacity-0 text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:opacity-100 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-8 peer-focus:opacity-100 peer-focus:text-base peer-focus:font-semibold peer-focus:text-blue-500 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-8 peer-not-placeholder-shown:opacity-100 peer-not-placeholder-shown:text-lg peer-not-placeholder-shown:font-semibold">Email</label>
                </div>

                {/* Password */}
                <div className="relative mt-2">
                    <input
                        id="password-signup"
                        type={showPassword ? "text" : "password"}
                        placeholder=""
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="peer w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:placeholder-transparent transition placeholder-gray-400"
                    />
                    <label htmlFor="password-signup" className="absolute left-3 transition-all duration-150 pointer-events-none text-gray-500 top-0 -translate-y-6 opacity-0 text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:opacity-100 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-8 peer-focus:opacity-100 peer-focus:text-base peer-focus:font-semibold peer-focus:text-blue-500 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-8 peer-not-placeholder-shown:opacity-100 peer-not-placeholder-shown:text-lg peer-not-placeholder-shown:font-semibold">Password</label>
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

                {/* Signup Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="relative mt-3 overflow-hidden cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transition-all group disabled:opacity-60"
                >   
                    <span className="relative z-10">{loading ? 'Signing up...' : 'Sign Up'}</span>
                    <span className="absolute inset-0 bg-green-400 opacity-0 group-active:opacity-30 transition duration-300"></span>
                </button>
            </form>
            {err && <p className="text-red-500 mt-4 text-sm">{err}</p>}
            <p className="text-sm text-gray-600 mt-4 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline font-medium">
                    Login
                </Link>
            </p>
        </AuthLayout>
    )
}
