export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-5 text-slate-400 text-xs text-center mt-8">
      <p className="font-bold font-sans text-slate-700 uppercase tracking-wider text-[10px]">© 2026 SAM.gov Entity Explorer</p>
      <p className="text-[9px] text-slate-400 font-mono mt-1 max-w-xl mx-auto px-4">
        Disclaimer: This exploratory interface connects to public federal registries. All API queries are mapped isomorphically.
      </p>
    </footer>
  );
}
