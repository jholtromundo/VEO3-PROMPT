
export enum TargetModel {
  FLOW = 'Flow',
  VEO3 = 'Veo3',
  FLOW_FASHION = 'Flow Fashion'
}

export enum ProductType {
  PHYSICAL = 'Físico', 
  FASHION = 'Moda',
  DIGITAL = 'Digital',
  FOOD = 'Alimento'
}

export enum InteractionMode {
  HANDHELD = 'Celular na Mão',
  HANDS_FREE = 'Mãos Livres (Tripé)'
}

export enum VisualEmphasis {
  LIFESTYLE = 'Lifestyle (Natural)',
  CINEMATIC = 'Cinemático (High-End)',
  STUDIO = 'Estúdio (Minimalista)',
  DYNAMIC = 'Dinâmico (Transições)'
}

export enum VoiceTone {
  ENTHUSIASTIC = 'Entusiasta & Amigo(a)',
  SOPHISTICATED = 'Sofisticado(a) & Calmo(a)',
  URGENT = 'Achadinho Imperdível',
  NARRATIVE = 'Storytelling',
  HUMOROUS = 'Bem Humorado / Engraçado',
  EXPERT = 'Especialista / Educativo',
  ASMR = 'ASMR / Relaxante',
  DIRECT = 'Direto ao Ponto / Minimalista',
  LUXURY = 'VIP / Exclusivo',
  GENZ = 'Gírias TikTok / GenZ'
}

export enum ModelGender {
  WOMAN = 'Mulher',
  MAN = 'Homem'
}

export interface ProductData {
  productName: string;
  features: string;
  price: string;
  hasPrice: boolean;
  targetModel: TargetModel;
  productType: ProductType;
  interactionMode: InteractionMode;
  environment: string;
  visualEmphasis: VisualEmphasis;
  voiceTone: VoiceTone;
  gender: ModelGender;
  extraContext: string; 
  timeOfDay: 'Day' | 'Night';
  wordCount: number;
}

export interface PromptSegment {
  index: number;
  duration_guide: string; 
  full_prompt: string; 
  dialogue_snippet: string; 
}

export interface GeneratedStrategy {
  title: string;
  marketing_angle: string;
  total_duration: string;
  segments: PromptSegment[]; 
  tiktok_caption: string; 
  tiktok_hashtags: string[]; 
  timestamp?: number; 
}

export interface PromptResponse {
  strategies: GeneratedStrategy[];
}

export interface HistoryItem {
  id: string;
  date: string;
  productName: string;
  strategy: GeneratedStrategy;
}
