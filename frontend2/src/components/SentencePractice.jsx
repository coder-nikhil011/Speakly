import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getContentLibrary } from "../services/contentService";

function SentencePractice() {
  const [library, setLibrary] = useState({ sentences: [], phrases: [], modalVerbs: [] });
  const [tab, setTab] = useState("sentences");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getContentLibrary().then(setLibrary).catch(() => {});
  }, []);

  const sentenceItems = library.sentences || [];
  const phraseItems = library.phrases || [];
  const modalItems = library.modalVerbs || [];

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <Link to="/student" className="text-sm font-bold text-slate-500">← Dashboard</Link>
        <div className="mt-8">
          <p className="text-xs font-bold tracking-[0.2em] text-[#65B891]">SOURCE LIBRARY</p>
          <h1 className="mt-3 text-4xl font-extrabold">Words, sentences & phrases</h1>
          <p className="mt-2 text-slate-500">Content loaded directly from your Word PDF library.</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {[['sentences','Sentences'],['phrases','Phrases'],['modalVerbs','Modal verbs']].map(([key,label]) => (
            <button key={key} onClick={() => { setTab(key); setSelected(null); }} className={`rounded-xl px-5 py-3 text-sm font-bold ${tab === key ? 'bg-black text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>{label}</button>
          ))}
        </div>

        {tab === 'sentences' && (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {sentenceItems.map((item) => <button key={item.no} onClick={() => setSelected(item)} className="rounded-2xl border border-slate-200 bg-white p-5 text-left hover:border-black"><span className="text-xs font-bold text-slate-400">#{item.no}</span><p className="mt-2 font-semibold">{item.text}</p></button>)}
          </div>
        )}

        {tab === 'phrases' && (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {phraseItems.map((item) => <button key={item.no} onClick={() => setSelected(item)} className="rounded-2xl border border-slate-200 bg-white p-5 text-left hover:border-black"><span className="text-xs font-bold text-slate-400">#{item.no}</span><p className="mt-2 font-semibold">{item.phrase}</p>{item.hindiHint && <p className="mt-1 text-sm text-slate-500">{item.hindiHint}</p>}</button>)}
          </div>
        )}

        {tab === 'modalVerbs' && (
          <div className="mt-6 space-y-3">
            {modalItems.map((item) => <div key={item.modal} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-3"><strong className="text-lg">{item.modal}</strong><span className="text-sm text-slate-500">{item.hindiMeaning}</span></div><p className="mt-3 text-sm text-slate-600">{item.use}</p><p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm font-medium">{item.example}</p></div>)}
          </div>
        )}

        {selected && tab !== 'modalVerbs' && <div className="mt-6 rounded-3xl bg-black p-6 text-white"><p className="text-sm text-slate-300">Selected item</p><p className="mt-2 text-xl font-bold">{selected.text || selected.phrase}</p>{selected.hindiHint && <p className="mt-2 text-slate-300">{selected.hindiHint}</p>}</div>}
      </div>
    </div>
  );
}

export default SentencePractice;
