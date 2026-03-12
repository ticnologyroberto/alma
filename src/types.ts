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

export interface Injury {
  id: string;
  name: string;
  comment: string;
  date: string;
}

export interface HealthData {
  blood_group: string;
  last_medical_review: string;
  weight: number;
  height: number;
  is_active: boolean;
  injuries: Injury[];
  tests: {
    speed_test_1: string;
    strength_test: string;
    cooper_test: string;
    navette_test: string;
    extra_test: string;
  };
}

export interface ExecutedDecision {
  id: string;
  date: string;
  playerIds: string[];
  playerNames: string[];
  impact: string;
  verdict: string;
  details: {
    totalValue: number;
    avgToxic: number;
    monthlySavings: number;
  };
}

export interface Child {
  name: string;
  age: number;
}

export interface SupportNote {
  id: string;
  date: string;
  professional_name: string;
  psychological_score: number;
  report: string;
  is_solved: boolean;
}

export interface PlayerCareData {
  wife_girlfriend: string;
  children: Child[];
  residence_country: string;
  observations: string[];
  notes: SupportNote[];
}

export interface PlayerData {
  player_id: string;
  identity: PlayerIdentity;
  financials: Financials;
  performance: Performance;
  ai_analysis: AIAnalysis;
  health: HealthData;
  care?: PlayerCareData;
}

export type ModuleId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'CHAT';

export interface Module {
  id: ModuleId;
  name: string;
  icon: string;
  description: string;
}
