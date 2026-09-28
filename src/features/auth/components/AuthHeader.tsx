import { MapPinIcon } from '../../../components/icons/CorporateIcons';

export function AuthHeader() {
  return (
    <header className="flex justify-between items-center px-6 sm:px-8 py-4 bg-white border-b border-slate-200/80 shadow-2xs">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">UniCare Enterprise Health</h1>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Hospital-Escola UNINASSAU</p>
      </div>
      <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
        <a href="#" className="hover:text-slate-900 transition-colors">Portal de Conformidade</a>
        <a href="#" className="hover:text-slate-900 transition-colors">Normativas CFP & CFO</a>
        <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
          <MapPinIcon className="w-3.5 h-3.5 text-slate-500" />
          <span>Campus Aracaju</span>
        </div>
      </div>
    </header>
  );
}