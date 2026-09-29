import { ShieldCheckIcon } from '../../../components/icons/CorporateIcons';

export function LoginInfoPanel() {
  return (
    <div className="hidden lg:flex w-1/2 bg-[#001D33] text-white p-12 flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#002B49] via-[#001D33] to-[#080E14]"></div>

      <div className="relative z-10">
        {/* Banner com Brasão Oficial UNINASSAU */}
        <div className="flex items-center gap-3.5 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 mb-8 max-w-fit shadow-lg">
          <div className="p-1.5 bg-white rounded-xl shadow-xs">
            <img
              src="/uninassau-crest.png"
              alt="Brasão Oficial UNINASSAU"
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="pr-3">
            <div className="text-[13px] font-black tracking-wider text-white font-sans">
              UNINASSAU
            </div>
            <div className="text-[10px] text-[#FFD100] font-semibold tracking-wider uppercase font-mono">
              Centro Universitário Maurício de Nassau
            </div>
          </div>
        </div>

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