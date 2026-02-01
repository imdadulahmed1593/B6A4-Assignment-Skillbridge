"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // TODO: Replace with actual auth state
  const isLoggedIn = false;
  const user = null;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            SkillBridge
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/tutors"
              className="text-secondary-600 hover:text-primary-600 transition-colors"
            >
              Find Tutors
            </Link>
            <Link
              href="/categories"
              className="text-secondary-600 hover:text-primary-600 transition-colors"
            >
              Categories
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <button className="btn-primary">Logout</button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/tutors"
                className="text-secondary-600 hover:text-primary-600 transition-colors"
              >
                Find Tutors
              </Link>
              <Link
                href="/categories"
                className="text-secondary-600 hover:text-primary-600 transition-colors"
              >
                Categories
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button className="btn-primary w-full">Logout</button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
