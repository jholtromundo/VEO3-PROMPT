
import React, { useState, useEffect } from 'react';
import { GeneratedStrategy } from '../types';
import { generateExtraPrompt } from '../services/geminiService';
import { Check, Terminal, ShieldCheck, Pencil, Save, Copy, Sparkles, Send, Loader2, PlayCircle, Eye, Focus, Move, Target, Smartphone } from 'lucide-react';

interface PromptCardProps {
  strategy: GeneratedStrategy;
  productName: string;
  features: string;
  onCopy: (msg: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ strategy, productName, features, onCopy }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [localSegments, setLocalSegments] = useState(strategy?.segments || []);
  const [extraInput, setExtraInput] = useState('');
  const [extraResult, setExtraResult] = useState('');
  const [loadingExtra, setLoadingExtra] = useState(false);

  useEffect(() => {
    if (strategy?.segments) setLocalSegments(strategy.segments);
  }, [strategy]);

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    onCopy("BLOCO COPIADO");
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    const allText = localSegments.map(s => `BLOCO ${s.index + 1}:\n${s.full_prompt}`).join('\n\n');
    await navigator.clipboard.writeText(allText);
    onCopy("ESTRATÉGIA COMPLETA COPIADA");
  };

  const formatSyntax = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const match = line.match(/^\[(.*?)\]:(.*)/);
      if (match) {
        const tag = match[1];
        const content = match[2];
        
        let tagColor = "text-acid-green";
        if (tag.includes("NOTICE")) tagColor = "text-red-500";
        if (tag.includes("CHARACTER")) tagColor = "text-neon-cyan";
        if (tag.includes("PRODUCT")) tagColor = "text-neon-purple";
        if (tag.includes("SCENE")) tagColor = "text-yellow-400";
        if (tag.includes("DIALOGUE")) tagColor = "text-neon-pink";

        return (
          <div key={i} className="py-1 border-b border-white/5 last:border-0 group/line">
            <span className={`${tagColor} font-bold font-display text-[10px] tracking-tight uppercase mr-2`}>[{tag}]:</span>
            <span className="text-white/90 text-xs leading-relaxed">{content}</span>
          </div>
        );
      }
      return line.trim() ? <div key={i} className="text-gray-500 text-[10px] py-0.5">{line}</div> : null;
    });
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* HUD HEADER */}
      <div className="relative border-t-2 border-acid-green bg-black/60 backdrop-blur-xl p-6 shadow-[0_-5px_30px_rgba(57,255,20,0.1)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <div className="flex gap-2 mb-2">
                 <span className="text-[9px] font-mono bg-acid-green/10 text-acid-green border border-acid-green/20 px-2 py-0.5 uppercase tracking-widest flex items-center gap-1">
                   <ShieldCheck size={10} /> {strategy?.marketing_angle || 'Comercial'}
                 </span>
                 <span className="text-[9px] font-mono bg-white/5 text-white/40 border border-white/10 px-2 py-0.5 uppercase">
                   @achadinhos_da_ellen
                 </span>
              </div>
              <h2 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase">
                {strategy?.title || 'ESTRATEGIA_VEO3'}
              </h2>
           </div>
           <button onClick={handleCopyAll} className="bg-acid-green text-black font-display font-bold text-[10px] px-6 py-3 hover:bg-white transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] uppercase tracking-widest">
             Copiar Tudo (Sincronizado)
           </button>
        </div>
      </div>

      {/* SEGMENTS */}
      <div className="grid grid-cols-1 gap-8 relative">
        <div className="absolute left-10 top-0 bottom-0 w-[1px] bg-white/5 hidden md:block"></div>
        
        {localSegments.map((segment, idx) => (
          <div key={idx} className="relative md:pl-20 group">
            <div className="absolute left-0 top-0 w-12 h-12 hidden md:flex items-center justify-center bg-black border border-white/10 rounded-sm text-[10px] font-bold text-acid-green group-hover:border-acid-green transition-colors">
              0{idx + 1}
            </div>

            <div className="hologram-card overflow-hidden border-white/5 hover:border-acid-green/30 transition-all">
               <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex justify-between items-center">
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Data_Block_v3</span>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingIndex(editingIndex === idx ? null : idx)} className="text-gray-500 hover:text-white transition-colors">
                      {editingIndex === idx ? <Save size={14} /> : <Pencil size={14} />}
                    </button>
                    <button onClick={() => handleCopy(segment.full_prompt, idx)} className={`flex items-center gap-2 px-3 py-1 font-mono text-[9px] uppercase border transition-all ${copiedIndex === idx ? 'bg-acid-green border-acid-green text-black' : 'border-white/10 text-acid-green hover:bg-white/5'}`}>
                      {copiedIndex === idx ? <Check size={12} /> : <Terminal size={12} />} {copiedIndex === idx ? 'OK' : 'Copiar'}
                    </button>
                  </div>
               </div>

               <div className="p-6 bg-black/40 font-mono">
                  {editingIndex === idx ? (
                    <textarea 
                      value={segment.full_prompt}
                      onChange={(e) => {
                        const upd = [...localSegments];
                        upd[idx].full_prompt = e.target.value;
                        setLocalSegments(upd);
                      }}
                      className="w-full h-64 bg-black text-white p-4 border border-acid-green/30 focus:outline-none font-mono text-xs"
                    />
                  ) : (
                    <div className="space-y-0.5">
                       {formatSyntax(segment.full_prompt)}
                    </div>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER KITS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="hologram-card p-6 border-neon-cyan/20">
           <h4 className="text-white font-display font-bold text-sm mb-4 flex items-center gap-2">
             <Smartphone size={16} className="text-neon-cyan" /> LEGENDA TIKTOK
           </h4>
           <div className="bg-black/40 p-4 border border-white/5 text-xs text-white/70 italic relative group">
              {strategy?.tiktok_caption || 'Confira esse achadinho! 💎'}
              <button onClick={() => onCopy("LEGENDA COPIADA")} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy size={12} />
              </button>
           </div>
        </div>

        <div className="hologram-card p-6 border-neon-pink/20">
           <h4 className="text-white font-display font-bold text-sm mb-4 flex items-center gap-2">
             <Sparkles size={16} className="text-neon-pink" /> REMIXADOR NEURAL
           </h4>
           <div className="flex gap-2">
              <input 
                type="text" 
                value={extraInput}
                onChange={(e) => setExtraInput(e.target.value)}
                placeholder="Ex: Mude o clima para noite..."
                className="flex-1 bg-black border border-white/10 px-3 py-2 text-[10px] text-white focus:border-neon-pink focus:outline-none font-mono"
              />
              <button 
                onClick={async () => {
                  setLoadingExtra(true);
                  try {
                    const res = await generateExtraPrompt(productName, features, extraInput);
                    setExtraResult(res);
                  } finally { setLoadingExtra(false); }
                }}
                disabled={loadingExtra || !extraInput.trim()}
                className="bg-neon-pink text-black px-4 py-2 hover:bg-white transition-all disabled:opacity-50"
              >
                {loadingExtra ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
           </div>
           {extraResult && (
             <div className="mt-4 p-3 bg-black border border-neon-pink/30 text-[10px] font-mono text-gray-400 max-h-32 overflow-y-auto">
               {extraResult}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
