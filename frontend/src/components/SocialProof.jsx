import React from "react";
function SocialProof() {
  return (
    <section className="bg-[#F5F6F7] px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="text-center">

          <h2 className="text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">
            Students, parents, and teachers love us.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500">
            Speakly is designed to make English practice simple,
            comfortable, and useful.
          </p>

        </div>


        <div className="mt-14 grid gap-5 md:grid-cols-3">

          {[
            {
              text: "I finally understand how to use the words I learn.",
              role: "Student",
            },
            {
              text: "The practice feels simple instead of overwhelming.",
              role: "Student",
            },
            {
              text: "It gives students a clear way to practice outside class.",
              role: "Teacher",
            },
          ].map((review, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-7"
            >

              <div className="text-xl tracking-widest text-[#65B891]">
                ★★★★★
              </div>

              <p className="mt-5 leading-7 text-[#111111]">
                "{review.text}"
              </p>

              <p className="mt-6 text-sm font-bold text-slate-400">
                {review.role}
              </p>

            </div>
          ))}

        </div>


        <div className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm font-semibold text-slate-400">
          <span>LEARN</span>
          <span>PRACTICE</span>
          <span>REMEMBER</span>
          <span>SPEAK</span>
          <span>IMPROVE</span>
        </div>

      </div>
    </section>
  );
}

export default SocialProof;