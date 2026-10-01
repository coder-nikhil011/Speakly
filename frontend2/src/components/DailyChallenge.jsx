import React ,{ useState } from "react";

function DailyChallenge() {
  const [answer, setAnswer] = useState("");

  return (
    <div className="min-h-screen bg-[#F8FAF9] px-6 py-12">

      <div className="mx-auto max-w-3xl">

        <p className="text-sm font-bold text-[#65B891]">
          DAILY CHALLENGE
        </p>

        <h1 className="mt-3 text-4xl font-extrabold">
          Complete the sentence
        </h1>

        <div className="mt-10 rounded-3xl bg-white p-8">

          <p className="text-xl font-semibold">
            I _____ speak English more confidently.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">

            {["want to", "yesterday", "speaking"].map((item) => (
              <button
                key={item}
                onClick={() => setAnswer(item)}
                className={`rounded-xl border p-4 font-bold ${
                  answer === item
                    ? "border-black bg-black text-white"
                    : "border-slate-200"
                }`}
              >
                {item}
              </button>
            ))}

          </div>

          {answer && (
            <p className="mt-6 text-sm font-semibold">
              {answer === "want to"
                ? "Correct! 🎉"
                : "Not quite. Try again."}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default DailyChallenge;