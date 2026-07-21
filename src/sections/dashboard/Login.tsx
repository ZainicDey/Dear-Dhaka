"use client";

import { useState } from "react";
import Image from "next/image";
import LogoImage from "@/assets/images/Heromiddle.png";
import { loginAdmin } from "@/actions/auth";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await loginAdmin(username, password);

      if (result.success) {
        onLogin();
      } else {
        setError(result.error || "Invalid username or password");
        setIsLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
      <div className="w-full max-w-[380px]">
        {/* Logo / Brand */}
        <div className="text-center mb-10 flex flex-col items-center">
          <Image
            src={LogoImage}
            alt="Dear Dhaka"
            width={180}
            height={60}
            className="object-contain"
          />
          <div className="-mt-5 mb-6 flex items-center justify-center relative z-10">
            <span className="bg-gradient-to-r from-[#fcb215]/20 to-[#c14627]/10 text-[#765434] text-[11px] font-extrabold uppercase tracking-[0.25em] py-1.5 px-4 rounded-full border border-[#765434]/10 shadow-sm backdrop-blur-sm">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[24px] p-7 shadow-sm"
        >
          <h2 className="text-[20px] font-bold text-[#301010] mb-6">Sign in</h2>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-xl px-4 py-3 mb-5 animate-[shake_0.3s_ease-in-out]">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-[#301010] mb-1.5 ml-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full bg-[#f4f3ed] rounded-xl py-3.5 px-4 text-[14px] outline-none placeholder:text-gray-400 text-[#301010] transition-all duration-200 focus:ring-2 focus:ring-[#fcb215]/50"
              autoComplete="username"
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-[#301010] mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-[#f4f3ed] rounded-xl py-3.5 px-4 text-[14px] outline-none placeholder:text-gray-400 text-[#301010] transition-all duration-200 focus:ring-2 focus:ring-[#fcb215]/50"
              autoComplete="current-password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full bg-[#fcb215] hover:bg-[#e5a010] rounded-xl py-3.5 font-bold text-[#301010] text-[15px] shadow-sm cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[12px] text-[#765434]/60 mt-6">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
