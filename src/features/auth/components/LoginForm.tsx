import { useState } from 'react';
import { AuthHeader } from './AuthHeader';
import { AuthFooter } from './AuthFooter';
import { LoginFields } from './LoginFields';
import { LoginInfoPanel } from './LoginInfoPanel';

export type ActiveDomain = 'psicologia' | 'odontologia' | 'institucional' | 'credenciais';

export function LoginForm() {
  const [activeDomain, setActiveDomain] = useState<ActiveDomain>('psicologia');

  const getBackgroundAtmosphere = () => {
    switch (activeDomain) {
      case 'psicologia':
        return 'bg-gradient-to-br from-blue-950/10 via-slate-100 to-indigo-950/15';
      case 'odontologia':
        return 'bg-gradient-to-br from-rose-950/10 via-slate-100 to-rose-900/15';
      case 'institucional':
        return 'bg-gradient-to-br from-[#002B49]/15 via-slate-100 to-amber-900/10';
      case 'credenciais':
      default:
        return 'bg-gradient-to-br from-slate-200/80 via-slate-100 to-slate-200/60';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans text-slate-900 transition-all duration-700 relative overflow-hidden ${getBackgroundAtmosphere()}`}>
      {/* Luzes de ambiência dinâmicas no fundo */}
      <div
        className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 transition-all duration-700 pointer-events-none ${
          activeDomain === 'psicologia'
            ? 'bg-blue-600'
            : activeDomain === 'odontologia'
            ? 'bg-rose-600'
            : activeDomain === 'institucional'
            ? 'bg-[#FFD100]'
            : 'bg-slate-400'
        }`}
      />
      <div
        className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-700 pointer-events-none ${
          activeDomain === 'psicologia'
            ? 'bg-indigo-600'
            : activeDomain === 'odontologia'
            ? 'bg-red-800'
            : activeDomain === 'institucional'
            ? 'bg-[#002B49]'
            : 'bg-slate-500'
        }`}
      />

      <AuthHeader />

      <main className="flex-grow flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl shadow-slate-900/10 flex flex-col lg:flex-row overflow-hidden min-h-[640px] border border-slate-200/80 transition-all duration-500">
          <LoginFields activeDomain={activeDomain} onDomainChange={setActiveDomain} />
          <LoginInfoPanel activeDomain={activeDomain} />
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}