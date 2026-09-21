import logo from "../assets/navbar_logo.png";
import { Link } from "react-router-dom";
import React from "react";

function Navbar() {
  return (
    <nav className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link to="#top" className="flex items-center">
          <img
            src={logo}
            alt="Speakly"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#how"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
          >
            How it works
          </a>

          <a
            href="#learn"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
          >
            What you learn
          </a>

          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
          >
            Features
          </a>

          <a
            href="#student"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
          >
            For Students
          </a>
          <a
            href="#teacher"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
          >
            For Teachers
          </a>

          <a
            href="#pricing"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-600"
          >
            Pricing
          </a>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden px-4 py-2 text-sm font-semibold text-slate-700 sm:block">
            Log in
          </Link>

          <Link to="/signup" className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-600">
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;