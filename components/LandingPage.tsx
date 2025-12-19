import React, { useState, useEffect } from 'react';
import { Power, Terminal } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [text, setText] = useState('');
  const fullText = "> CARREGANDO KERNEL ACHADINHOS...\n> OTIMIZANDO REDE NEURAL CRIATIVA...\n> INICIANDO ALGORITMOS DE CRIAÇÃO...\n> SISTEMA PRONTO.";
  const [step, setStep] = useState(0); // 0: typing, 1: logo, 2: button

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(timer);
        setTimeout(() => setStep(1), 500); // Reveal Logo
        setTimeout(() => setStep(2), 1200); // Reveal Button
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    setStep(3); // Exit animation state
    setTimeout(onStart, 800); // Wait for animation before unmounting
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 transition-all duration-1000 ${step === 3 ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 bg-black/90 backdrop-blur-sm'}`}>
      
      <div className="max-w-4xl w-full text-center relative z-10 flex flex-col items-center">
        
        {/* Terminal Boot Log */}
        <div className={`w-full max-w-md bg-black/50 border border-white/10 p-4 rounded mb-12 h-32 font-mono text-acid-green text-xs md:text-sm text-left shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-opacity duration-500 ${step > 0 ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
            <Terminal size={12} />
            <span className="text-white/50">ACHADINHOS_BOOT.SYS</span>
          </div>
          <div className="whitespace-pre-line leading-relaxed opacity-80">
            {text}
            <span className="animate-pulse">_</span>
          </div>
        </div>

        {/* Logo Reveal */}
        <div className={`transition-all duration-1000 transform ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
           <div className="relative inline-block group mb-6">
              <h1 className="text-5xl md:text-[6rem] font-display font-black text-white tracking-tighter leading-none select-none drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                ACHADINHOS<br />
                <span className="text-acid-green relative inline-block">
                  DA ELLEN
                  <span className="absolute inset-0 text-white opacity-20 animate-pulse blur-[1px]">DA ELLEN</span>
                </span>
              </h1>
              
              {/* Decorative Lines */}
              <div className="absolute -left-8 top-1/2 w-4 h-[2px] bg-acid-green"></div>
              <div className="absolute -right-8 top-1/2 w-4 h-[2px] bg-acid-green"></div>
           </div>
           
           <p className="text-gray-400 font-sans tracking-[0.5em] text-sm md:text-xl uppercase flex items-center justify-center gap-3 animate-in fade-in duration-1000 slide-in-from-bottom-4">
             ENGENHARIA DE PROMPTS IA // <span className="text-neon-pink font-bold">MODO DEUS</span>
           </p>
        </div>

        {/* Initialize Button */}
        <div className={`mt-20 transition-all duration-1000 delay-200 transform ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <button 
            onClick={handleStart}
            className="relative px-16 py-6 group bg-transparent overflow-hidden"
          >
            {/* Cyber Borders */}
            <div className="absolute inset-0 border border-white/20 group-hover:border-acid-green/50 transition-colors duration-500"></div>
            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white group-hover:border-acid-green transition-colors shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-white group-hover:border-acid-green transition-colors shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-white group-hover:border-acid-green transition-colors shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white group-hover:border-acid-green transition-colors shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
            
            {/* Background Sweep */}
            <div className="absolute inset-0 bg-acid-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out"></div>

            <div className="relative z-10 flex items-center gap-4">
              <span className="font-display font-bold text-xl tracking-widest text-white group-hover:text-black transition-colors duration-300">
                ACESSAR_SISTEMA
              </span>
              <Power size={24} className="text-acid-green group-hover:text-black transition-colors duration-300" />
            </div>
          </button>
        </div>

      </div>
      
      {/* Footer Version */}
      <div className="absolute bottom-8 text-white/10 font-mono text-[10px] tracking-widest">
         ACHADINHOS LABS v2.1 // PRONTO PARA DEPLOY
      </div>
    </div>
  );
};