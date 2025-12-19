
import React, { useState } from 'react';
import { ProductData, ProductType, VisualEmphasis, VoiceTone, TargetModel, ModelGender, InteractionMode } from '../types';
import { generateActionSuggestion } from '../services/geminiService';
import { Box, Shirt, Smartphone, Coffee, Cpu, Aperture, Settings, Video, Sparkles, Film, Loader2, HandMetal, Smartphone as PhoneIcon, ShieldAlert, Languages, Type as TypeIcon } from 'lucide-react';

interface ProductFormProps {
  formData: ProductData;
  setFormData: React.Dispatch<React.SetStateAction<ProductData>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ formData, setFormData, onSubmit, isLoading }) => {
  const [isSuggesting, setIsSuggesting] = useState(false);

  const updateField = (field: keyof ProductData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSuggestAction = async () => {
    if (!formData.productName) return;
    setIsSuggesting(true);
    try {
      const suggestion = await generateActionSuggestion(formData.productName, formData.productType, formData.features);
      updateField('extraContext', suggestion);
    } catch (e) {
      console.error("Error generating suggestion", e);
    } finally {
      setIsSuggesting(false);
    }
  };

  const fillDemoData = () => {
    setFormData({
      productName: "Macacão Pantalona Luxury",
      features: "Macacão Pantalona Decote Transpassado. 96% Poliéster, 4% Elastano. Ajuste premium.",
      price: "159,90",
      hasPrice: true,
      targetModel: TargetModel.VEO3, 
      productType: ProductType.FASHION,
      interactionMode: InteractionMode.HANDS_FREE,
      environment: "Estúdio High-End", 
      visualEmphasis: VisualEmphasis.STUDIO,
      voiceTone: VoiceTone.ENTHUSIASTIC,
      extraContext: "Ella entra na cena sorrindo e faz uma pose elegante mostrando o caimento do tecido.",
      timeOfDay: 'Day',
      gender: ModelGender.WOMAN,
      wordCount: 25
    });
  };

  const labelClass = "block text-[10px] font-mono text-acid-green/60 uppercase tracking-widest mb-3 flex items-center gap-2 group-focus-within:text-acid-green transition-colors";
  const inputClass = "w-full input-cyber rounded-none px-5 py-4 text-sm focus:ring-1 focus:ring-acid-green/50 placeholder-gray-800 transition-all border-white/10";

  return (
    <div className="hologram-card p-0 rounded-none relative group flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-acid-green z-20"></div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-acid-green z-20"></div>

      <div className="flex border-b border-white/10">
        <button type="button" onClick={() => updateField('targetModel', TargetModel.VEO3)} className={`flex-1 py-6 text-[11px] font-display font-black uppercase transition-all flex flex-col md:flex-row items-center justify-center gap-3 ${formData.targetModel === TargetModel.VEO3 ? 'bg-acid-green text-black' : 'bg-black/60 text-gray-600 hover:text-white'}`}>
          <Video size={16} /> VEO3_OPERATOR
        </button>
        <button type="button" onClick={() => updateField('targetModel', TargetModel.FLOW)} className={`flex-1 py-6 text-[11px] font-display font-black uppercase transition-all flex flex-col md:flex-row items-center justify-center gap-3 ${formData.targetModel === TargetModel.FLOW ? 'bg-neon-cyan text-black' : 'bg-black/60 text-gray-600 hover:text-white'}`}>
          <Film size={16} /> FLOW_OPERATOR
        </button>
      </div>

      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <h2 className="text-2xl font-display font-black text-white tracking-widest flex items-center gap-3 italic">
            <Settings size={22} className="text-acid-green animate-spin-slow" /> DATA_ENTRY
          </h2>
          <button type="button" onClick={fillDemoData} className="text-[10px] font-black text-black bg-white px-4 py-1.5 font-mono uppercase tracking-widest hover:bg-acid-green transition-colors">
            AUTO_FILL
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-500/5 border border-red-500/20 p-3 flex items-center gap-3">
             <ShieldAlert className="text-red-500 shrink-0" size={16} />
             <span className="text-[9px] font-mono text-white/50 uppercase">ENCRYPTION: ACTIVE</span>
          </div>
          <div className="bg-neon-cyan/5 border border-neon-cyan/20 p-3 flex items-center gap-3">
             <Languages className="text-neon-cyan shrink-0" size={16} />
             <span className="text-[9px] font-mono text-white/50 uppercase">LOCALE: PT-BR</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          
          <div className="group">
            <label className={labelClass}>
              <TypeIcon size={14} className="text-acid-green" /> WORD_LIMIT: {formData.wordCount}
            </label>
            <div className="flex items-center gap-6 bg-black/60 p-5 border border-white/5 group-focus-within:border-acid-green/30 transition-all">
              <span className="text-[11px] font-mono text-gray-700">20</span>
              <input 
                type="range" 
                min="20" 
                max="35" 
                value={formData.wordCount}
                onChange={(e) => updateField('wordCount', parseInt(e.target.value))}
                className="flex-1 accent-acid-green h-[2px] bg-gray-900 rounded-none appearance-none cursor-pointer"
              />
              <span className="text-[11px] font-mono text-gray-700">35</span>
            </div>
          </div>

          <div className="group">
            <label className={labelClass}>:: CAPTURE_MODE (BIOMETRIC)</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={() => updateField('interactionMode', InteractionMode.HANDHELD)} 
                className={`flex items-center justify-center gap-3 py-4 border font-mono text-[10px] uppercase transition-all ${formData.interactionMode === InteractionMode.HANDHELD ? 'bg-white/10 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-black border-white/5 text-gray-600 hover:text-white'}`}
              >
                <PhoneIcon size={16} /> SELFIE_SYNC
              </button>
              <button 
                type="button" 
                onClick={() => updateField('interactionMode', InteractionMode.HANDS_FREE)} 
                className={`flex items-center justify-center gap-3 py-4 border font-mono text-[10px] uppercase transition-all ${formData.interactionMode === InteractionMode.HANDS_FREE ? 'bg-white/10 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-black border-white/5 text-gray-600 hover:text-white'}`}
              >
                <HandMetal size={16} /> TRIPOD_SYNC
              </button>
            </div>
          </div>

          <div className="group">
            <label className={labelClass}>:: TARGET_GENDER & SECTOR</label>
            <div className="flex gap-3 mb-3">
              <button type="button" onClick={() => updateField('gender', ModelGender.WOMAN)} className={`flex-1 h-12 border transition-all text-[11px] font-display font-bold uppercase ${formData.gender === ModelGender.WOMAN ? 'bg-neon-pink/10 border-neon-pink text-neon-pink shadow-[0_0_15px_rgba(255,0,153,0.1)]' : 'bg-black border-white/5 text-gray-600 hover:text-white'}`}>FEMALE</button>
              <button type="button" onClick={() => updateField('gender', ModelGender.MAN)} className={`flex-1 h-12 border transition-all text-[11px] font-display font-bold uppercase ${formData.gender === ModelGender.MAN ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'bg-black border-white/5 text-gray-600 hover:text-white'}`}>MALE</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[ { type: ProductType.PHYSICAL, icon: Box }, { type: ProductType.FASHION, icon: Shirt }, { type: ProductType.DIGITAL, icon: Smartphone }, { type: ProductType.FOOD, icon: Coffee } ].map((item) => (
                <button key={item.type} type="button" onClick={() => updateField('productType', item.type)} className={`h-12 flex items-center justify-center border transition-all ${formData.productType === item.type ? 'bg-white border-white text-black' : 'bg-black border-white/5 text-gray-600 hover:border-white/20'}`}><item.icon size={20} /></button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
              <div className="group relative">
                <input type="text" className={inputClass} placeholder="PRODUCT_IDENTIFIER" value={formData.productName} onChange={(e) => updateField('productName', e.target.value)} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                  <Aperture size={16} className="text-acid-green" />
                </div>
              </div>

              <textarea className={`${inputClass} min-h-[120px] resize-none`} placeholder="SPECIFICATIONS_PROTOCOL (TECIDO, MODELAGEM, DETALHES)" value={formData.features} onChange={(e) => updateField('features', e.target.value)} />
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="relative group">
                    <input type="text" className={inputClass} placeholder="UNIT_PRICE R$" value={formData.price} onChange={(e) => updateField('price', e.target.value)} />
                 </div>
                 <select value={formData.voiceTone} onChange={(e) => updateField('voiceTone', e.target.value as VoiceTone)} className={inputClass}>
                    {Object.values(VoiceTone).map((v) => <option key={v} value={v} className="bg-black">{v.toUpperCase()}</option>)}
                 </select>
              </div>

               <div className="group relative">
                <div className="flex items-center justify-between mb-3">
                  <label className={labelClass}>:: KINETIC_ACTION (PT-BR)</label>
                  <button type="button" onClick={handleSuggestAction} disabled={isSuggesting || !formData.productName} className={`text-[10px] font-bold border px-4 py-2 flex items-center gap-2 transition-all ${!formData.productName ? 'opacity-20 grayscale border-white/10 text-white' : 'border-acid-green text-acid-green hover:bg-acid-green hover:text-black shadow-[0_0_15px_rgba(57,255,20,0.2)] animate-pulse'}`}>
                    {isSuggesting ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} IA_REMIX
                  </button>
                </div>
                <textarea className={`${inputClass} min-h-[80px] resize-none`} placeholder="Descreva o movimento da Ella..." value={formData.extraContext} onChange={(e) => updateField('extraContext', e.target.value)} />
              </div>
          </div>

          {/* GOD MODE BUTTON */}
          <button type="submit" disabled={isLoading} className="w-full h-20 bg-acid-green text-black font-display font-black text-lg tracking-[0.4em] uppercase shadow-[0_0_40px_rgba(57,255,20,0.4)] hover:shadow-[0_0_60px_rgba(57,255,20,0.6)] hover:bg-white transition-all transform hover:-translate-y-1 relative group/god overflow-hidden">
               <div className="absolute inset-0 bg-white/20 translate-x-full group-hover/god:translate-x-[-200%] transition-transform duration-1000 ease-in-out"></div>
               {isLoading ? <Aperture className="animate-spin mx-auto" size={32} /> : (
                 <div className="flex items-center justify-center gap-4">
                    <Cpu size={24} /> 
                    <span>MODO_DEUS</span>
                 </div>
               )}
          </button>
        </form>
      </div>
    </div>
  );
};
