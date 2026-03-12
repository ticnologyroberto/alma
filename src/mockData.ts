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
    },
    health: {
      blood_group: "O+",
      last_medical_review: "2024-01-15 - Sin novedades",
      weight: 75,
      height: 178,
      is_active: true,
      injuries: [],
      tests: {
        speed_test_1: "10.5s",
        strength_test: "85kg",
        cooper_test: "3200m",
        navette_test: "12.5",
        extra_test: "N/A"
      }
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
    },
    health: {
      blood_group: "A-",
      last_medical_review: "2024-02-10 - Molestia en rodilla",
      weight: 82,
      height: 185,
      is_active: false,
      injuries: [
        { id: "1", name: "Esguince de tobillo", comment: "Recuperación en curso", date: "2024-02-20" }
      ],
      tests: {
        speed_test_1: "11.2s",
        strength_test: "90kg",
        cooper_test: "2800m",
        navette_test: "10.5",
        extra_test: "N/A"
      }
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
    },
    health: {
      blood_group: "B+",
      last_medical_review: "2024-03-01 - Excelente estado",
      weight: 80,
      height: 182,
      is_active: true,
      injuries: [],
      tests: {
        speed_test_1: "10.8s",
        strength_test: "95kg",
        cooper_test: "3100m",
        navette_test: "11.8",
        extra_test: "N/A"
      }
    }
  },
  {
    player_id: "UUID_Olimpia_004",
    identity: { name: "Gastón Olveira", position: "Portero", age: 30, club_origin: "Olimpia" },
    financials: { base_market_value: 1500000, real_cost_accumulated: 1200000, monthly_salary: 25000, contract_expiry: "2024-12-31", agent_fees: 80000, toxic_index_tau: 0.2 },
    performance: { minutes_played_pct: 0.90, adaptability_index: 8.5, injury_risk_score: 0.10 },
    ai_analysis: { fair_value_prediction: 1800000, exit_strategy: "Retener", recommendation: "Seguridad bajo palos. Indispensable." },
    health: { blood_group: "O+", last_medical_review: "2024-01-20", weight: 85, height: 191, is_active: true, injuries: [], tests: { speed_test_1: "12.0s", strength_test: "80kg", cooper_test: "2900m", navette_test: "9.5", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_005",
    identity: { name: "Richard Ortiz", position: "Mediocampista", age: 33, club_origin: "Olimpia" },
    financials: { base_market_value: 800000, real_cost_accumulated: 5000000, monthly_salary: 35000, contract_expiry: "2024-12-31", agent_fees: 0, toxic_index_tau: 0.5 },
    performance: { minutes_played_pct: 0.80, adaptability_index: 9.9, injury_risk_score: 0.25 },
    ai_analysis: { fair_value_prediction: 600000, exit_strategy: "Retiro Programado", recommendation: "Líder histórico. Preparar transición a staff técnico." },
    health: { blood_group: "A+", last_medical_review: "2024-02-15", weight: 78, height: 175, is_active: true, injuries: [], tests: { speed_test_1: "11.5s", strength_test: "88kg", cooper_test: "3000m", navette_test: "11.0", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_006",
    identity: { name: "Fernando Cardozo", position: "Extremo Derecho", age: 22, club_origin: "Olimpia" },
    financials: { base_market_value: 2500000, real_cost_accumulated: 1000000, monthly_salary: 18000, contract_expiry: "2026-12-31", agent_fees: 120000, toxic_index_tau: 0.3 },
    performance: { minutes_played_pct: 0.85, adaptability_index: 8.8, injury_risk_score: 0.08 },
    ai_analysis: { fair_value_prediction: 3500000, exit_strategy: "Retener / Venta Futura", recommendation: "Potencial de reventa alto. Mantener exposición internacional." },
    health: { blood_group: "O-", last_medical_review: "2024-03-05", weight: 72, height: 173, is_active: true, injuries: [], tests: { speed_test_1: "10.2s", strength_test: "75kg", cooper_test: "3300m", navette_test: "13.0", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_007",
    identity: { name: "Iván Torres", position: "Lateral Izquierdo", age: 32, club_origin: "Olimpia" },
    financials: { base_market_value: 500000, real_cost_accumulated: 3000000, monthly_salary: 22000, contract_expiry: "2025-06-30", agent_fees: 40000, toxic_index_tau: 1.5 },
    performance: { minutes_played_pct: 0.60, adaptability_index: 7.5, injury_risk_score: 0.30 },
    ai_analysis: { fair_value_prediction: 400000, exit_strategy: "Venta / Préstamo", recommendation: "Ciclo cumplido. Buscar recambio joven." },
    health: { blood_group: "B-", last_medical_review: "2024-02-28", weight: 76, height: 179, is_active: true, injuries: [], tests: { speed_test_1: "11.0s", strength_test: "82kg", cooper_test: "3100m", navette_test: "11.5", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_008",
    identity: { name: "Hugo Fernández", position: "Mediocampista Ofensivo", age: 26, club_origin: "Olimpia" },
    financials: { base_market_value: 1000000, real_cost_accumulated: 1500000, monthly_salary: 15000, contract_expiry: "2025-12-31", agent_fees: 60000, toxic_index_tau: 0.8 },
    performance: { minutes_played_pct: 0.55, adaptability_index: 7.2, injury_risk_score: 0.20 },
    ai_analysis: { fair_value_prediction: 1100000, exit_strategy: "Retener", recommendation: "Jugador de rotación valioso." },
    health: { blood_group: "O+", last_medical_review: "2024-01-30", weight: 74, height: 176, is_active: true, injuries: [], tests: { speed_test_1: "10.9s", strength_test: "78kg", cooper_test: "3050m", navette_test: "11.2", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_009",
    identity: { name: "Marcos Gómez", position: "Mediocentro", age: 22, club_origin: "Olimpia" },
    financials: { base_market_value: 1800000, real_cost_accumulated: 500000, monthly_salary: 12000, contract_expiry: "2027-06-30", agent_fees: 90000, toxic_index_tau: 0.1 },
    performance: { minutes_played_pct: 0.70, adaptability_index: 9.5, injury_risk_score: 0.05 },
    ai_analysis: { fair_value_prediction: 2800000, exit_strategy: "Retener", recommendation: "El motor del futuro. Blindar contrato." },
    health: { blood_group: "A-", last_medical_review: "2024-03-10", weight: 70, height: 174, is_active: true, injuries: [], tests: { speed_test_1: "11.1s", strength_test: "80kg", cooper_test: "3250m", navette_test: "12.8", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_010",
    identity: { name: "Víctor Salazar", position: "Lateral Derecho", age: 30, club_origin: "Olimpia" },
    financials: { base_market_value: 700000, real_cost_accumulated: 1800000, monthly_salary: 20000, contract_expiry: "2024-12-31", agent_fees: 50000, toxic_index_tau: 1.1 },
    performance: { minutes_played_pct: 0.50, adaptability_index: 6.8, injury_risk_score: 0.35 },
    ai_analysis: { fair_value_prediction: 600000, exit_strategy: "No renovar", recommendation: "Rendimiento decreciente." },
    health: { blood_group: "B+", last_medical_review: "2024-02-05", weight: 77, height: 177, is_active: true, injuries: [], tests: { speed_test_1: "11.3s", strength_test: "84kg", cooper_test: "2950m", navette_test: "10.8", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_011",
    identity: { name: "Jhohan Romaña", position: "Defensa Central", age: 25, club_origin: "Olimpia" },
    financials: { base_market_value: 1200000, real_cost_accumulated: 1000000, monthly_salary: 18000, contract_expiry: "2026-12-31", agent_fees: 70000, toxic_index_tau: 0.6 },
    performance: { minutes_played_pct: 0.80, adaptability_index: 8.2, injury_risk_score: 0.12 },
    ai_analysis: { fair_value_prediction: 1500000, exit_strategy: "Retener", recommendation: "Fuerza física necesaria en la zaga." },
    health: { blood_group: "O+", last_medical_review: "2024-03-12", weight: 88, height: 186, is_active: true, injuries: [], tests: { speed_test_1: "11.8s", strength_test: "105kg", cooper_test: "2850m", navette_test: "10.2", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_012",
    identity: { name: "Brian Montenegro", position: "Delantero", age: 30, club_origin: "Olimpia" },
    financials: { base_market_value: 900000, real_cost_accumulated: 2200000, monthly_salary: 22000, contract_expiry: "2025-06-30", agent_fees: 45000, toxic_index_tau: 1.3 },
    performance: { minutes_played_pct: 0.40, adaptability_index: 7.0, injury_risk_score: 0.40 },
    ai_analysis: { fair_value_prediction: 750000, exit_strategy: "Venta", recommendation: "Saturación en puesto de ataque." },
    health: { blood_group: "A+", last_medical_review: "2024-01-25", weight: 81, height: 180, is_active: true, injuries: [], tests: { speed_test_1: "11.4s", strength_test: "86kg", cooper_test: "2900m", navette_test: "10.5", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_013",
    identity: { name: "Alejandro Silva", position: "Mediocampista", age: 34, club_origin: "Olimpia" },
    financials: { base_market_value: 600000, real_cost_accumulated: 4500000, monthly_salary: 30000, contract_expiry: "2024-12-31", agent_fees: 0, toxic_index_tau: 0.9 },
    performance: { minutes_played_pct: 0.65, adaptability_index: 9.0, injury_risk_score: 0.28 },
    ai_analysis: { fair_value_prediction: 500000, exit_strategy: "Fin de contrato", recommendation: "Experiencia valiosa pero costo alto." },
    health: { blood_group: "O-", last_medical_review: "2024-02-10", weight: 73, height: 178, is_active: true, injuries: [], tests: { speed_test_1: "11.6s", strength_test: "76kg", cooper_test: "3000m", navette_test: "11.0", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_014",
    identity: { name: "Junior Barreto", position: "Defensa Central", age: 25, club_origin: "Olimpia" },
    financials: { base_market_value: 1000000, real_cost_accumulated: 1200000, monthly_salary: 14000, contract_expiry: "2027-12-31", agent_fees: 65000, toxic_index_tau: 0.5 },
    performance: { minutes_played_pct: 0.70, adaptability_index: 7.8, injury_risk_score: 0.15 },
    ai_analysis: { fair_value_prediction: 1300000, exit_strategy: "Retener", recommendation: "Proyección sólida." },
    health: { blood_group: "B-", last_medical_review: "2024-03-01", weight: 83, height: 184, is_active: true, injuries: [], tests: { speed_test_1: "11.7s", strength_test: "92kg", cooper_test: "3050m", navette_test: "11.2", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_015",
    identity: { name: "Facundo Zabala", position: "Lateral Izquierdo", age: 24, club_origin: "Olimpia" },
    financials: { base_market_value: 1400000, real_cost_accumulated: 900000, monthly_salary: 16000, contract_expiry: "2026-06-30", agent_fees: 85000, toxic_index_tau: 0.4 },
    performance: { minutes_played_pct: 0.75, adaptability_index: 8.4, injury_risk_score: 0.18 },
    ai_analysis: { fair_value_prediction: 1900000, exit_strategy: "Retener", recommendation: "Lateral con llegada. Activo en crecimiento." },
    health: { blood_group: "A-", last_medical_review: "2024-02-20", weight: 71, height: 172, is_active: true, injuries: [], tests: { speed_test_1: "10.6s", strength_test: "74kg", cooper_test: "3200m", navette_test: "12.5", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_016",
    identity: { name: "Ramón Martínez", position: "Mediocentro", age: 27, club_origin: "Olimpia" },
    financials: { base_market_value: 1100000, real_cost_accumulated: 1300000, monthly_salary: 17000, contract_expiry: "2025-12-31", agent_fees: 55000, toxic_index_tau: 0.7 },
    performance: { minutes_played_pct: 0.60, adaptability_index: 7.9, injury_risk_score: 0.22 },
    ai_analysis: { fair_value_prediction: 1200000, exit_strategy: "Retener", recommendation: "Equilibrio en el medio." },
    health: { blood_group: "O+", last_medical_review: "2024-01-15", weight: 79, height: 181, is_active: true, injuries: [], tests: { speed_test_1: "11.2s", strength_test: "85kg", cooper_test: "3100m", navette_test: "11.8", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_017",
    identity: { name: "Sebastián Quintana", position: "Mediocampista", age: 20, club_origin: "Olimpia" },
    financials: { base_market_value: 800000, real_cost_accumulated: 200000, monthly_salary: 8000, contract_expiry: "2028-12-31", agent_fees: 30000, toxic_index_tau: 0.1 },
    performance: { minutes_played_pct: 0.30, adaptability_index: 8.0, injury_risk_score: 0.05 },
    ai_analysis: { fair_value_prediction: 1500000, exit_strategy: "Préstamo / Desarrollo", recommendation: "Gran talento joven. Necesita minutos." },
    health: { blood_group: "A+", last_medical_review: "2024-03-08", weight: 68, height: 175, is_active: true, injuries: [], tests: { speed_test_1: "10.8s", strength_test: "72kg", cooper_test: "3300m", navette_test: "13.2", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_018",
    identity: { name: "Saúl Salcedo", position: "Defensa Central", age: 26, club_origin: "Olimpia" },
    financials: { base_market_value: 1600000, real_cost_accumulated: 2500000, monthly_salary: 22000, contract_expiry: "2026-12-31", agent_fees: 110000, toxic_index_tau: 0.8 },
    performance: { minutes_played_pct: 0.50, adaptability_index: 8.1, injury_risk_score: 0.45 },
    ai_analysis: { fair_value_prediction: 1400000, exit_strategy: "Recuperar / Retener", recommendation: "Volviendo de lesión larga. Paciencia." },
    health: { blood_group: "B+", last_medical_review: "2024-02-12", weight: 82, height: 183, is_active: true, injuries: [], tests: { speed_test_1: "11.5s", strength_test: "90kg", cooper_test: "3000m", navette_test: "11.0", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_019",
    identity: { name: "Allan Wlk", position: "Delantero", age: 20, club_origin: "Olimpia" },
    financials: { base_market_value: 700000, real_cost_accumulated: 150000, monthly_salary: 7000, contract_expiry: "2028-06-30", agent_fees: 25000, toxic_index_tau: 0.1 },
    performance: { minutes_played_pct: 0.20, adaptability_index: 8.5, injury_risk_score: 0.08 },
    ai_analysis: { fair_value_prediction: 1200000, exit_strategy: "Retener", recommendation: "Promesa de la cantera." },
    health: { blood_group: "O+", last_medical_review: "2024-03-05", weight: 76, height: 182, is_active: true, injuries: [], tests: { speed_test_1: "10.9s", strength_test: "78kg", cooper_test: "3150m", navette_test: "12.0", extra_test: "N/A" } }
  },
  {
    player_id: "UUID_Olimpia_020",
    identity: { name: "Manuel Romero", position: "Extremo Izquierdo", age: 22, club_origin: "Olimpia" },
    financials: { base_market_value: 900000, real_cost_accumulated: 300000, monthly_salary: 9000, contract_expiry: "2027-12-31", agent_fees: 40000, toxic_index_tau: 0.2 },
    performance: { minutes_played_pct: 0.45, adaptability_index: 8.3, injury_risk_score: 0.12 },
    ai_analysis: { fair_value_prediction: 1400000, exit_strategy: "Retener", recommendation: "Velocidad y desborde." },
    health: { blood_group: "A-", last_medical_review: "2024-02-25", weight: 70, height: 174, is_active: true, injuries: [], tests: { speed_test_1: "10.5s", strength_test: "74kg", cooper_test: "3250m", navette_test: "12.8", extra_test: "N/A" } }
  }
];
