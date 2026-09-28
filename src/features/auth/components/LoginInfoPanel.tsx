import { BuildingOfficeIcon, ShieldCheckIcon } from '../../../components/icons/CorporateIcons';

export function LoginInfoPanel() {
  return (
    <div className="hidden lg:flex w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-slate-950"></div>

      <div className="relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 text-[11px] font-semibold text-blue-200 mb-8 border border-white/10 uppercase tracking-wider">
          <BuildingOfficeIcon className="w-3.5 h-3.5" />
          <span>Hospital-Escola UNINASSAU</span>
        </span>
        <h2 className="text-3xl font-bold leading-snug mb-4 text-white tracking-tight">
          Governança clínica, formação de excelência e proteção de dados.
        </h2>
        <p className="text-slate-300 text-xs leading-relaxed max-w-md">
          Plataforma corporativa integrada para custódia de prontuários eletrônicos, planos de tratamento odontológicos e evolução psicológica supervisionada sob conformidade com a LGPD e resoluções CFP/CFO.
        </p>

        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Resolução CFP nº 06/2019 (Síntese Clínica Estruturada)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Protocolos CFO para Clínicas Odontológicas e Duplas</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>LGPD Art. 11: Rastreabilidade criptográfica imutável</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 mt-8">
        <div>
          <p className="text-xs font-bold text-white tracking-wide">Campus Aracaju • Clínicas Integradas</p>
          <p className="text-[10px] text-slate-400 font-mono">Infraestrutura em Nuvem Auditada</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Ambiente Operacional</span>
        </div>
      </div>
    </div>
  );
}