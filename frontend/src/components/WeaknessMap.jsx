import React from "react";
function WeaknessMap() {
  const areas = [
    {
      name: "Word Usage",
      progress: "78%",
      width: "78%",
      background: "bg-[#DFF5E8]",
    },
    {
      name: "Vocabulary",
      progress: "64%",
      width: "64%",
      background: "bg-[#E5F2FF]",
    },
    {
      name: "Grammar",
      progress: "46%",
      width: "46%",
      background: "bg-slate-200",
    },
    {
      name: "Speaking",
      progress: "38%",
      width: "38%",
      background: "bg-slate-200",
    },
  ];

  return (
    <section id="progress" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Dashboard */}
          <div className="order-2 rounded-[2rem] border border-slate-200 bg-[#F5F6F7] p-6 shadow-lg lg:order-1">

            <div className="rounded-3xl bg-white p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold tracking-widest text-slate-400">
                    YOUR PROGRESS
                  </p>

                  <h3 className="mt-1 text-2xl font-extrabold text-[#111111]">
                    Learning map
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DFF5E8] text-sm font-bold text-[#111111]">
                  62%
                </div>

              </div>


              <div className="mt-8 space-y-6">

                {areas.map((area) => (
                  <div key={area.name}>

                    <div className="mb-2 flex justify-between">
                      <span className="text-sm font-semibold text-[#111111]">
                        {area.name}
                      </span>

                      <span className="text-sm text-slate-400">
                        {area.progress}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${area.background}`}
                        style={{ width: area.width }}
                      />
                    </div>

                  </div>
                ))}

              </div>


              <div className="mt-8 rounded-2xl bg-[#E5F2FF] p-5">

                <p className="text-xs font-bold tracking-widest text-slate-500">
                  FOCUS NEXT
                </p>

                <p className="mt-2 font-bold text-[#111111]">
                  Speaking confidence
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  A little more speaking practice can help you improve.
                </p>

              </div>

            </div>

          </div>


          {/* Text */}
          <div className="order-1 lg:order-2">

            <p className="text-sm font-bold tracking-[0.2em] text-[#65B891]">
              KNOW YOUR WEAKNESS
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-[#111111] sm:text-5xl">
              Know where you're weak.
              <span className="block">Know what to practice.</span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Speakly looks at your practice and helps you understand
              which areas need more attention.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 p-5">

              <p className="text-sm font-bold text-[#111111]">
                Instead of saying:
              </p>

              <p className="mt-2 text-slate-500">
                "My English is weak."
              </p>

              <div className="my-4 h-px bg-slate-100" />

              <p className="text-sm font-bold text-[#111111]">
                Speakly can show:
              </p>

              <p className="mt-2 text-slate-500">
                "You need more practice with speaking."
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default WeaknessMap;