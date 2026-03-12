export interface PlayerIdentity {
  name: string;
  position: string;
  age: number;
  club_origin: string;
  photo_url?: string;
}

export interface Financials {
  base_market_value: number;
  real_cost_accumulated: number;
  monthly_salary: number;
  contract_start?: string;
  contract_expiry: string;
  agent_fees: number;
  toxic_index_tau: number;
}

export interface Performance {
  minutes_played_pct: number;
  adaptability_index: number;
  injury_risk_score: number;
}

export interface AIAnalysis {
  fair_value_prediction: number;
  exit_strategy: string;
  recommendation: string;
}

export interface PlayerData {
  player_id: string;
  identity: PlayerIdentity;
  financials: Financials;
  performance: Performance;
  ai_analysis: AIAnalysis;
}

export type ModuleId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'CHAT';

export interface Module {
  id: ModuleId;
  name: string;
  icon: string;
  description: string;
}
