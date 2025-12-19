
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptCard } from './components/PromptCard';
import { ProductForm } from './components/ProductForm';
import { HistorySidebar } from './components/HistorySidebar';
import { LandingPage } from './components/LandingPage';
import { generatePrompts } from './services/geminiService';
import { ProductData, PromptResponse, TargetModel, ProductType, VisualEmphasis, VoiceTone, HistoryItem, ModelGender, InteractionMode } from './types';
import { AlertOctagon, Trash2, Cpu, Sparkles, Check } from 'lucide-react';

const INITIAL_STATE: ProductData = {
  productName: '',
  features: '',
  price: '',
  hasPrice: false,
  targetModel: TargetModel.VEO3,
  productType: ProductType.PHYSICAL,
  interactionMode: InteractionMode.HANDS_FREE,
  environment: '',
  visualEmphasis: VisualEmphasis.LIFESTYLE,
  voiceTone: VoiceTone.ENTHUSIASTIC,
  extraContext: '',
  timeOfDay: 'Day',
  gender: ModelGender.WOMAN,
  wordCount: 25
};

const App: React.FC = () => {
  const [appStarted, setAppStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<PromptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductData>(INITIAL_STATE);
  const [toast, setToast] = useState<{msg: string, visible: boolean}>({ msg: '', visible: false });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('jhollabs_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = (data: ProductData, res: PromptResponse) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      productName: data.productName,
      strategy: res.strategies[0]
    };
    const updated = [newItem, ...history].slice(0, 50);
    setHistory(updated);
    localStorage.setItem('jhollabs_history', JSON.stringify(updated));
  };

  const showToast = (msg: string) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast({ msg: '', visible: false }), 3000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.features) {
      setError("ERRO: DADOS DO PRODUTO INSUFICIENTES");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await generatePrompts(formData);
      setResponse(res);
      saveToHistory(formData, res);
      showToast("ESTRÁTEGIA GERADA COM SUCESSO");
    } catch (err: any) {
      setError(err.message || "ERRO NA REDE NEURAL");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(INITIAL_STATE);
    setResponse(null);
    setError(null);
  };

  const handleNewProject = () => {
    setFormData(INITIAL_STATE);
    setResponse(null);
    setError(null);
    setHistoryOpen(false);
    showToast("NOVO PROJETO INICIADO");
  };

  const handleRestoreFromHistory = (item: HistoryItem) => {
    setResponse({ strategies: [item.strategy] });
    setHistoryOpen(false);
    showToast("LOG RESTAURADO");
  };

  const handleClearHistory = () => {
    if (confirm("Deseja apagar o histórico?")) {
      setHistory([]);
      localStorage.removeItem('jhollabs_history');
      showToast("HISTÓRICO LIMPO");
    }
  };

  if (!appStarted) {
    return <LandingPage onStart={() => setAppStarted(true)} />;
  }

  return (
    <div className="min-h-screen pt-20 pb-20 font-sans text-gray-300 relative animate-in fade-in zoom-in duration-700">
      <Header toggleHistory={() => setHistoryOpen(!historyOpen)} onNewProject={handleNewProject} />
      <HistorySidebar isOpen={historyOpen} history={history} onSelect={handleRestoreFromHistory} onClose={() => setHistoryOpen(false)} onClear={handleClearHistory} />
      <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-4 space-y-4">
          <ProductForm formData={formData} setFormData={setFormData} onSubmit={handleGenerate} isLoading={loading} />
          <button onClick={handleClear} className="w-full text-[10px] font-mono uppercase tracking-widest text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 py-4 border border-transparent hover:border-red-500/20 group">
            <Trash2 size={12} className="group-hover:rotate-12 transition-transform" /> LIMPAR_DADOS_PROJETO
          </button>
        </div>
        <div className="lg:col-span-8">
          {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-6 mb-8 font-mono text-sm shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse-fast">
              <div className="flex items-center gap-2 mb-1">
                <AlertOctagon size={16} />
                <span className="font-bold">ERRO_SISTEMA</span>
              </div>
              {error}
            </div>
          )}
          {!loading && !response && !error && (
            <div className="h-[600px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-none p-8 text-center bg-black/20 backdrop-blur-sm relative overflow-hidden group">
               <Cpu size={64} className="text-white/10 relative z-10 group-hover:text-acid-green/50 transition-colors duration-500" strokeWidth={1} />
               <h3 className="text-2xl font-display font-bold text-white mt-6 tracking-widest group-hover:tracking-[0.2em] transition-all duration-500">ENGINE_READY</h3>
               <p className="text-acid-green/50 font-mono text-xs mt-2 uppercase tracking-tighter">AGUARDANDO INPUTS...</p>
            </div>
          )}
          {loading && (
             <div className="space-y-6">
                <div className="hologram-card p-8 flex flex-col items-center justify-center text-center">
                   <Sparkles className="text-neon-cyan animate-spin mb-4" size={32} />
                   <p className="font-display font-bold text-xl text-white uppercase tracking-widest">Sincronizando Rede Neural...</p>
                   <p className="font-mono text-xs text-acid-green mt-2 animate-pulse uppercase">Aplicando Visual Lock & PT-BR Protocol</p>
                </div>
             </div>
          )}
          {response && response.strategies.map((strategy, idx) => (
            <PromptCard key={idx} strategy={strategy} productName={formData.productName} features={formData.features} onCopy={showToast} />
          ))}
        </div>
      </main>
      <div className={`fixed top-24 right-8 z-[60] transition-all duration-300 transform ${toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className="bg-acid-green text-black px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_#39FF14] border-l-4 border-white flex items-center gap-3">
          <Check size={16} />
          [{toast.msg}]
        </div>
      </div>
    </div>
  );
};

export default App;
