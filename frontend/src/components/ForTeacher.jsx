import React from "react";
function ForTeacher() {
  return (
    <section id="teacher" className="bg-[#F5F6F7] px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* Dashboard Preview */}
          <div className="order-2 rounded-[2rem] bg-[#111111] p-4 shadow-2xl lg:order-1">

            <div className="rounded-3xl bg-white p-6">

              <div className="flex items-center justify-between border-b border-slate-100 pb-5">

                <div>
                  <p className="text-xs font-bold tracking-widest text-[#65B891]">
                    TEACHER DASHBOARD
                  </p>

                  <h3 className="mt-1 text-2xl font-extrabold text-[#111111]">
                    Your students
                  </h3>
                </div>

                <div className="rounded-full bg-[#E5F2FF] px-3 py-1 text-xs font-bold">
                  24 students
                </div>

              </div>


              <div className="mt-7 space-y-4">

                <div className="rounded-2xl bg-[#F5F6F7] p-5">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="font-bold text-[#111111]">
                        Student progress
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Weekly improvement
                      </p>
                    </div>

                    <span className="font-bold text-[#65B891]">
                      +18%
                    </span>

                  </div>

                  <div className="mt-5 h-2 rounded-full bg-slate-200">
                    <div className="h-full w-[72%] rounded-full bg-[#65B891]" />
                  </div>

                </div>


                <div className="rounded-2xl border border-slate-100 p-5">

                  <div className="flex justify-between">
                    <span className="font-bold text-[#111111]">
                      Vocabulary
                    </span>

                    <span className="text-sm text-slate-400">
                      82%
                    </span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div className="h-full w-[82%] rounded-full bg-[#E5F2FF]" />
                  </div>

                </div>


                <div className="rounded-2xl border border-slate-100 p-5">

                  <div className="flex justify-between">
                    <span className="font-bold text-[#111111]">
                      Speaking
                    </span>

                    <span className="text-sm text-slate-400">
                      61%
                    </span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div className="h-full w-[61%] rounded-full bg-[#DFF5E8]" />
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* Content */}
          <div className="order-1 lg:order-2">

            <p className="text-sm font-bold tracking-[0.2em] text-[#65B891]">
              FOR TEACHERS
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-[#111111] sm:text-5xl">
              Help your students
              <span className="block">practice beyond the classroom.</span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Give students a simple way to practice words,
              sentences, and speaking while you understand
              where they need more help.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-[#111111]">
                  Track progress
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  See how students are improving.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-[#111111]">
                  Find weaknesses
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Understand where students need practice.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-[#111111]">
                  Give practice
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Help students focus on useful English.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-[#111111]">
                  Save time
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Let Speakly handle repetitive practice.
                </p>
              </div>

            </div>

            <button className="mt-8 rounded-xl bg-[#111111] px-7 py-4 font-bold text-white">
              I'm a Teacher →
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

export default ForTeacher;