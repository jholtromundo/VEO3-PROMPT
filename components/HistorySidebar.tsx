import React from 'react';
import { HistoryItem } from '../types';
import { Clock, ArrowRight, Trash2, Database } from 'lucide-react';

interface HistorySidebarProps {
  isOpen: boolean;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClose: () => void;
  onClear: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, history, onSelect, onClose, onClear }) => {
  return (
    <div 
      className={`fixed inset-y-0 right-0 w-80 bg-black/95 border-l border-acid-green/30 backdrop-blur-xl z-50 transform transition-transform duration-300 ease-out shadow-[0_0_50px_rgba(0,0,0,0.8)] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2 text-acid-green">
            <Database size={18} />
            <h2 className="font-display font-bold tracking-wider">LOGS DO SISTEMA</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <ArrowRight size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center text-gray-600 mt-10 font-mono text-xs">
              // NENHUM_DADO_ENCONTRADO
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="group border border-white/5 hover:border-acid-green/50 bg-white/5 hover:bg-white/10 p-3 cursor-pointer transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-0.5 h-full bg-acid-green opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h4 className="font-display font-bold text-sm text-white truncate">{item.productName}</h4>
                <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-gray-400">
                  <span className="group-hover:text-acid-green transition-colors">{item.strategy.marketing_angle}</span>
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onClear}
            className="w-full py-3 flex items-center justify-center gap-2 text-red-500 font-mono text-xs hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
          >
            <Trash2 size={14} /> PURGAR DADOS
          </button>
        </div>
      </div>
    </div>
  );
};