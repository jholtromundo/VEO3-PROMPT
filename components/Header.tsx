
import React, { useState, useEffect } from 'react';
import { Zap, History, RotateCcw, Cpu, Activity } from 'lucide-react';

interface HeaderProps {
  toggleHistory: () => void;
  onNewProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleHistory, onNewProject }) => {
  const [time, setTime] = useState<string>('');
  const [load, setLoad] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setLoad(Math.floor(Math.random() * 15) + 85); // Simulated high load
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 border-b border-acid-green/20 backdrop-blur-2xl">
      <div className="max-w-full mx-auto px-6 h-20 flex items-center justify-between relative">
        
        {/* Left HUD: Glitch Logo */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-1.5 h-10 bg-acid-green animate-pulse shadow-[0_0_20px_#39FF14] group-hover:h-12 transition-all"></div>
            <div className="absolute top-0 left-0 w-1.5 h-10 bg-neon-pink opacity-0 group-hover:opacity-100 group-hover:translate-x-1 animate-glitch"></div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-black text-white tracking-widest leading-none relative">
              ACHADINHOS<span className="text-acid-green">DA ELLEN</span>
              <span className="absolute -bottom-4 left-0 text-[8px] font-mono text-white/20 tracking-[0.5em] uppercase">Creative_Engine_v2.5</span>
            </h1>
          </div>
        </div>
        
        {/* Terminal Status Bar (Neural Load) */}
        <div className="hidden lg:flex items-center gap-10 bg-white/5 border border-white/10 px-6 py-2 rounded-sm">
           <div className="flex flex-col">
              <span className="text-[8px] font-mono text-acid-green uppercase">Neural_Load</span>
              <div className="flex items-center gap-2">
                 <div className="w-24 h-1 bg-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-acid-green animate-pulse" style={{ width: `${load}%` }}></div>
                 </div>
                 <span className="text-[10px] font-mono text-white">{load}%</span>
              </div>
           </div>
           <div className="flex flex-col border-l border-white/10 pl-10">
              <span className="text-[8px] font-mono text-neon-cyan uppercase">Sync_Speed</span>
              <div className="flex items-center gap-2">
                 <Activity size={10} className="text-neon-cyan" />
                 <span className="text-[10px] font-mono text-white">4.2 TB/s</span>
              </div>
           </div>
        </div>

        {/* Right HUD: Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-4">
             <div className="text-[9px] text-neon-pink font-mono tracking-widest uppercase">Operator_Auth</div>
             <div className="text-xs font-bold text-white uppercase font-display">
               ADMIN_ELLEN_SYS
             </div>
          </div>

          <button 
            onClick={onNewProject}
            className="w-12 h-12 border border-white/10 hover:border-neon-cyan text-gray-500 hover:text-neon-cyan flex items-center justify-center transition-all bg-black hover:bg-neon-cyan/5 group"
            title="RESET_PROJECT"
          >
            <RotateCcw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
          </button>

          <button 
            onClick={toggleHistory}
            className="w-12 h-12 border border-white/10 hover:border-acid-green text-gray-500 hover:text-acid-green flex items-center justify-center transition-all bg-black hover:bg-acid-green/5 group"
            title="ACCESS_LOGS"
          >
            <History size={20} className="group-hover:scale-110 transition-transform" />
          </button>

          <div className="w-12 h-12 border border-acid-green/40 flex items-center justify-center bg-acid-green/5 relative overflow-hidden group shadow-[0_0_20px_rgba(57,255,20,0.1)]">
            <div className="absolute inset-0 bg-acid-green/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            <Zap size={22} className="text-acid-green relative z-10 animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
};
