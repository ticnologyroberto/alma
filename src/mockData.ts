import { PlayerData } from './types';

export const mockPlayers: PlayerData[] = [
  {
    player_id: "UUID_Olimpia_001",
    identity: {
      name: "Derlis González",
      position: "Delantero Centro",
      age: 29,
      club_origin: "Olimpia"
    },
    financials: {
      base_market_value: 3500000,
      real_cost_accumulated: 4200000,
      monthly_salary: 45000,
      contract_expiry: "2025-12-31",
      agent_fees: 250000,
      toxic_index_tau: 1.2
    },
    performance: {
      minutes_played_pct: 0.75,
      adaptability_index: 9.2,
      injury_risk_score: 0.15
    },
    ai_analysis: {
      fair_value_prediction: 3800000,
      exit_strategy: "Retener",
      recommendation: "Jugador clave. Renovar contrato antes de junio para evitar fuga de activos."
    }
  },
  {
    player_id: "UUID_Olimpia_002",
    identity: {
      name: "Facundo Bruera",
      position: "Delantero",
      age: 25,
      club_origin: "Olimpia"
    },
    financials: {
      base_market_value: 1200000,
      real_cost_accumulated: 2500000,
      monthly_salary: 20000,
      contract_expiry: "2026-06-30",
      agent_fees: 100000,
      toxic_index_tau: 2.1
    },
    performance: {
      minutes_played_pct: 0.35,
      adaptability_index: 6.5,
      injury_risk_score: 0.45
    },
    ai_analysis: {
      fair_value_prediction: 950000,
      exit_strategy: "Venta parcial",
      recommendation: "Activo tóxico detectado. El costo acumulado supera el rendimiento proyectado. Buscar préstamo o venta en mercado de invierno."
    }
  },
  {
    player_id: "UUID_Olimpia_003",
    identity: {
      name: "Mateo Gamarra",
      position: "Defensa Central",
      age: 23,
      club_origin: "Olimpia"
    },
    financials: {
      base_market_value: 2000000,
      real_cost_accumulated: 800000,
      monthly_salary: 15000,
      contract_expiry: "2027-12-31",
      agent_fees: 50000,
      toxic_index_tau: 0.4
    },
    performance: {
      minutes_played_pct: 0.95,
      adaptability_index: 9.8,
      injury_risk_score: 0.05
    },
    ai_analysis: {
      fair_value_prediction: 4500000,
      exit_strategy: "Retener / Venta Premium",
      recommendation: "Efecto Vitrina detectado. Su valor ha crecido un 400% en 12 meses. No vender por menos de $5M."
    }
  },
  {
    player_id: "UUID_Olimpia_004",
    identity: { name: "Gastón Olveira", position: "Portero", age: 30, club_origin: "Olimpia" },
    financials: { base_market_value: 1500000, real_cost_accumulated: 1200000, monthly_salary: 25000, contract_expiry: "2024-12-31", agent_fees: 80000, toxic_index_tau: 0.2 },
    performance: { minutes_played_pct: 0.90, adaptability_index: 8.5, injury_risk_score: 0.10 },
    ai_analysis: { fair_value_prediction: 1800000, exit_strategy: "Retener", recommendation: "Seguridad bajo palos. Indispensable." }
  },
  {
    player_id: "UUID_Olimpia_005",
    identity: { name: "Richard Ortiz", position: "Mediocampista", age: 33, club_origin: "Olimpia" },
    financials: { base_market_value: 800000, real_cost_accumulated: 5000000, monthly_salary: 35000, contract_expiry: "2024-12-31", agent_fees: 0, toxic_index_tau: 0.5 },
    performance: { minutes_played_pct: 0.80, adaptability_index: 9.9, injury_risk_score: 0.25 },
    ai_analysis: { fair_value_prediction: 600000, exit_strategy: "Retiro Programado", recommendation: "Líder histórico. Preparar transición a staff técnico." }
  },
  {
    player_id: "UUID_Olimpia_006",
    identity: { name: "Fernando Cardozo", position: "Extremo Derecho", age: 22, club_origin: "Olimpia" },
    financials: { base_market_value: 2500000, real_cost_accumulated: 1000000, monthly_salary: 18000, contract_expiry: "2026-12-31", agent_fees: 120000, toxic_index_tau: 0.3 },
    performance: { minutes_played_pct: 0.85, adaptability_index: 8.8, injury_risk_score: 0.08 },
    ai_analysis: { fair_value_prediction: 3500000, exit_strategy: "Retener / Venta Futura", recommendation: "Potencial de reventa alto. Mantener exposición internacional." }
  },
  {
    player_id: "UUID_Olimpia_007",
    identity: { name: "Iván Torres", position: "Lateral Izquierdo", age: 32, club_origin: "Olimpia" },
    financials: { base_market_value: 500000, real_cost_accumulated: 3000000, monthly_salary: 22000, contract_expiry: "2025-06-30", agent_fees: 40000, toxic_index_tau: 1.5 },
    performance: { minutes_played_pct: 0.60, adaptability_index: 7.5, injury_risk_score: 0.30 },
    ai_analysis: { fair_value_prediction: 400000, exit_strategy: "Venta / Préstamo", recommendation: "Ciclo cumplido. Buscar recambio joven." }
  },
  {
    player_id: "UUID_Olimpia_008",
    identity: { name: "Hugo Fernández", position: "Mediocampista Ofensivo", age: 26, club_origin: "Olimpia" },
    financials: { base_market_value: 1000000, real_cost_accumulated: 1500000, monthly_salary: 15000, contract_expiry: "2025-12-31", agent_fees: 60000, toxic_index_tau: 0.8 },
    performance: { minutes_played_pct: 0.55, adaptability_index: 7.2, injury_risk_score: 0.20 },
    ai_analysis: { fair_value_prediction: 1100000, exit_strategy: "Retener", recommendation: "Jugador de rotación valioso." }
  },
  {
    player_id: "UUID_Olimpia_009",
    identity: { name: "Marcos Gómez", position: "Mediocentro", age: 22, club_origin: "Olimpia" },
    financials: { base_market_value: 1800000, real_cost_accumulated: 500000, monthly_salary: 12000, contract_expiry: "2027-06-30", agent_fees: 90000, toxic_index_tau: 0.1 },
    performance: { minutes_played_pct: 0.70, adaptability_index: 9.5, injury_risk_score: 0.05 },
    ai_analysis: { fair_value_prediction: 2800000, exit_strategy: "Retener", recommendation: "El motor del futuro. Blindar contrato." }
  },
  {
    player_id: "UUID_Olimpia_010",
    identity: { name: "Víctor Salazar", position: "Lateral Derecho", age: 30, club_origin: "Olimpia" },
    financials: { base_market_value: 700000, real_cost_accumulated: 1800000, monthly_salary: 20000, contract_expiry: "2024-12-31", agent_fees: 50000, toxic_index_tau: 1.1 },
    performance: { minutes_played_pct: 0.50, adaptability_index: 6.8, injury_risk_score: 0.35 },
    ai_analysis: { fair_value_prediction: 600000, exit_strategy: "No renovar", recommendation: "Rendimiento decreciente." }
  },
  {
    player_id: "UUID_Olimpia_011",
    identity: { name: "Jhohan Romaña", position: "Defensa Central", age: 25, club_origin: "Olimpia" },
    financials: { base_market_value: 1200000, real_cost_accumulated: 1000000, monthly_salary: 18000, contract_expiry: "2026-12-31", agent_fees: 70000, toxic_index_tau: 0.6 },
    performance: { minutes_played_pct: 0.80, adaptability_index: 8.2, injury_risk_score: 0.12 },
    ai_analysis: { fair_value_prediction: 1500000, exit_strategy: "Retener", recommendation: "Fuerza física necesaria en la zaga." }
  },
  {
    player_id: "UUID_Olimpia_012",
    identity: { name: "Brian Montenegro", position: "Delantero", age: 30, club_origin: "Olimpia" },
    financials: { base_market_value: 900000, real_cost_accumulated: 2200000, monthly_salary: 22000, contract_expiry: "2025-06-30", agent_fees: 45000, toxic_index_tau: 1.3 },
    performance: { minutes_played_pct: 0.40, adaptability_index: 7.0, injury_risk_score: 0.40 },
    ai_analysis: { fair_value_prediction: 750000, exit_strategy: "Venta", recommendation: "Saturación en puesto de ataque." }
  },
  {
    player_id: "UUID_Olimpia_013",
    identity: { name: "Alejandro Silva", position: "Mediocampista", age: 34, club_origin: "Olimpia" },
    financials: { base_market_value: 600000, real_cost_accumulated: 4500000, monthly_salary: 30000, contract_expiry: "2024-12-31", agent_fees: 0, toxic_index_tau: 0.9 },
    performance: { minutes_played_pct: 0.65, adaptability_index: 9.0, injury_risk_score: 0.28 },
    ai_analysis: { fair_value_prediction: 500000, exit_strategy: "Fin de contrato", recommendation: "Experiencia valiosa pero costo alto." }
  },
  {
    player_id: "UUID_Olimpia_014",
    identity: { name: "Junior Barreto", position: "Defensa Central", age: 25, club_origin: "Olimpia" },
    financials: { base_market_value: 1000000, real_cost_accumulated: 1200000, monthly_salary: 14000, contract_expiry: "2027-12-31", agent_fees: 65000, toxic_index_tau: 0.5 },
    performance: { minutes_played_pct: 0.70, adaptability_index: 7.8, injury_risk_score: 0.15 },
    ai_analysis: { fair_value_prediction: 1300000, exit_strategy: "Retener", recommendation: "Proyección sólida." }
  },
  {
    player_id: "UUID_Olimpia_015",
    identity: { name: "Facundo Zabala", position: "Lateral Izquierdo", age: 24, club_origin: "Olimpia" },
    financials: { base_market_value: 1400000, real_cost_accumulated: 900000, monthly_salary: 16000, contract_expiry: "2026-06-30", agent_fees: 85000, toxic_index_tau: 0.4 },
    performance: { minutes_played_pct: 0.75, adaptability_index: 8.4, injury_risk_score: 0.18 },
    ai_analysis: { fair_value_prediction: 1900000, exit_strategy: "Retener", recommendation: "Lateral con llegada. Activo en crecimiento." }
  },
  {
    player_id: "UUID_Olimpia_016",
    identity: { name: "Ramón Martínez", position: "Mediocentro", age: 27, club_origin: "Olimpia" },
    financials: { base_market_value: 1100000, real_cost_accumulated: 1300000, monthly_salary: 17000, contract_expiry: "2025-12-31", agent_fees: 55000, toxic_index_tau: 0.7 },
    performance: { minutes_played_pct: 0.60, adaptability_index: 7.9, injury_risk_score: 0.22 },
    ai_analysis: { fair_value_prediction: 1200000, exit_strategy: "Retener", recommendation: "Equilibrio en el medio." }
  },
  {
    player_id: "UUID_Olimpia_017",
    identity: { name: "Sebastián Quintana", position: "Mediocampista", age: 20, club_origin: "Olimpia" },
    financials: { base_market_value: 800000, real_cost_accumulated: 200000, monthly_salary: 8000, contract_expiry: "2028-12-31", agent_fees: 30000, toxic_index_tau: 0.1 },
    performance: { minutes_played_pct: 0.30, adaptability_index: 8.0, injury_risk_score: 0.05 },
    ai_analysis: { fair_value_prediction: 1500000, exit_strategy: "Préstamo / Desarrollo", recommendation: "Gran talento joven. Necesita minutos." }
  },
  {
    player_id: "UUID_Olimpia_018",
    identity: { name: "Saúl Salcedo", position: "Defensa Central", age: 26, club_origin: "Olimpia" },
    financials: { base_market_value: 1600000, real_cost_accumulated: 2500000, monthly_salary: 22000, contract_expiry: "2026-12-31", agent_fees: 110000, toxic_index_tau: 0.8 },
    performance: { minutes_played_pct: 0.50, adaptability_index: 8.1, injury_risk_score: 0.45 },
    ai_analysis: { fair_value_prediction: 1400000, exit_strategy: "Recuperar / Retener", recommendation: "Volviendo de lesión larga. Paciencia." }
  },
  {
    player_id: "UUID_Olimpia_019",
    identity: { name: "Allan Wlk", position: "Delantero", age: 20, club_origin: "Olimpia" },
    financials: { base_market_value: 700000, real_cost_accumulated: 150000, monthly_salary: 7000, contract_expiry: "2028-06-30", agent_fees: 25000, toxic_index_tau: 0.1 },
    performance: { minutes_played_pct: 0.20, adaptability_index: 8.5, injury_risk_score: 0.08 },
    ai_analysis: { fair_value_prediction: 1200000, exit_strategy: "Retener", recommendation: "Promesa de la cantera." }
  },
  {
    player_id: "UUID_Olimpia_020",
    identity: { name: "Manuel Romero", position: "Extremo Izquierdo", age: 22, club_origin: "Olimpia" },
    financials: { base_market_value: 900000, real_cost_accumulated: 300000, monthly_salary: 9000, contract_expiry: "2027-12-31", agent_fees: 40000, toxic_index_tau: 0.2 },
    performance: { minutes_played_pct: 0.45, adaptability_index: 8.3, injury_risk_score: 0.12 },
    ai_analysis: { fair_value_prediction: 1400000, exit_strategy: "Retener", recommendation: "Velocidad y desborde." }
  }
];
