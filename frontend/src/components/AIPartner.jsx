import React from "react";
function AIPartner() {
  return (
    <section className="overflow-hidden bg-white px-6 py-24" id="speaking">
      <div className="mx-auto max-w-7xl">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}
          <div>

            <p className="mb-4 text-sm font-bold tracking-[0.2em] text-blue-600">
              SPEAKING PRACTICE
            </p>

            <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Practice speaking
              <span className="block text-blue-600">
                without feeling nervous.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Talk with your AI friend in a comfortable conversation.
              Practice the words you've learned and build confidence
              before using them in real life.
            </p>

            {/* Points */}
            <div className="mt-8 space-y-4">

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Choose your AI friend
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose a voice that makes you feel comfortable.
                  </p>
                </div>
              </div>


              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Talk naturally
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Start with a simple conversation instead of a test.
                  </p>
                </div>
              </div>


              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Practice what you learned
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Use your learned words in real conversations.
                  </p>
                </div>
              </div>

            </div>

          </div>


          {/* RIGHT - VIDEO CALL UI */}
          <div className="relative">

            {/* Main call window */}
            <div className="overflow-hidden rounded-[2rem] bg-slate-950 p-3 shadow-2xl">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4">

                <div className="flex items-center gap-3">

                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                      S
                    </div>

                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-400" />
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      Speakly AI
                    </p>

                    <p className="text-xs text-slate-400">
                      Online
                    </p>
                  </div>

                </div>

                <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                  08:24
                </div>

              </div>


              {/* Video area */}
              <div className="relative flex min-h-[360px] items-end overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">

                {/* AI avatar */}
                <div className="absolute inset-0 flex items-center justify-center">

                  <div className="flex h-48 w-48 items-center justify-center rounded-full bg-slate-600 text-6xl font-extrabold text-white shadow-2xl animate-pulse">
                    S
                  </div>

                </div>


                {/* AI name */}
                <div className="absolute left-5 top-5 rounded-full bg-black/30 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  Speakly AI
                </div>


                {/* Student preview */}
                <div className="absolute bottom-5 right-5 flex h-28 w-40 items-center justify-center rounded-2xl border border-white/20 bg-slate-800 shadow-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-600 text-sm font-bold text-white">
                    You
                  </div>
                </div>

              </div>


              {/* Conversation */}
              <div className="px-3 py-4">

                <div className="rounded-2xl bg-white/10 p-4">

                  <p className="text-xs font-semibold text-blue-300">
                    SPEAKLY AI
                  </p>

                  <p className="mt-1 text-sm leading-6 text-white">
                    Hey! How was your day?
                  </p>

                </div>

              </div>


              {/* Controls */}
              <div className="flex items-center justify-center gap-3 pb-3">

                <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                  🎤
                </button>

                <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                  📹
                </button>

                <button className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white">
                  ☎
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default AIPartner;