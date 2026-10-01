import { Link } from "react-router-dom";
import React from "react";
function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAF9] px-6">

      <div className="text-center">

        <p className="text-7xl font-extrabold">
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold">
          Page not found
        </h1>

        <p className="mt-3 text-slate-500">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-7 inline-block rounded-xl bg-black px-6 py-3 font-bold text-white"
        >
          Back home
        </Link>

      </div>

    </div>
  );
}

export default NotFound;