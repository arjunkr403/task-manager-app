import React from "react"

export default function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 transition-colors duration-500 px-4">

            {/* Auth Card (light-only) */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 animate-fadeIn">
                <div className="flex flex-col items-center gap-4">
                    <h1 className="font-extrabold tracking-tight text-4xl text-gray-800">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-gray-500 text-center text-sm">
                            {subtitle}
                        </p>
                    )}
                    {children}
                </div>
            </div>
        </div>
    )
}
