"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    // The verification is handled by better-auth automatically
    // Just show success message
    setStatus("success");
    setMessage("Email verified successfully! You can now log in.");
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8 text-center">
          {status === "loading" && (
            <>
              <FiLoader className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                Verifying Your Email
              </h1>
              <p className="text-secondary-600">Please wait...</p>
            </>
          )}

          {status === "success" && (
            <>
              <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                Email Verified!
              </h1>
              <p className="text-secondary-600 mb-6">{message}</p>
              <Link href="/login" className="btn-primary inline-block px-8 py-3">
                Go to Login
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                Verification Failed
              </h1>
              <p className="text-secondary-600 mb-6">{message}</p>
              <Link href="/login" className="btn-primary inline-block px-8 py-3">
                Go to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
