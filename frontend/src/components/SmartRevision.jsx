import { Link } from "react-router-dom";
import React from "react";
import logo from "../assets/navbar_logo.png";

function SmartRevision() {
  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10">

      <div className="mx-auto max-w-4xl">

        <Link
          to="/student"
          className="text-3xl font-extrabold"
        >
        <img
          src={logo}
          alt="Speakly"
          className="h-14 w-auto object-contain"
        />
        </Link>

        <div className="mt-12 text-center">

          <p className="text-sm font-bold tracking-wider text-[#65B891]">
            SMART REVISION
          </p>

          <h1 className="mt-3 text-4xl font-extrabold">
            Let's remember what you've learned.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Speakly brings back words at the right time and
            helps you use them again.
          </p>

          <Link
            to="/revision-session"
            className="mt-8 inline-block rounded-xl bg-black px-7 py-4 font-bold text-white"
          >
            Start revision →
          </Link>

        </div>

      </div>

    </div>
  );
}

export default SmartRevision;