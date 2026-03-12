import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Activity, 
  DollarSign, 
  MessageSquare, 
  Play, 
  Heart, 
  Menu, 
  X, 
  Send,
  ShieldAlert,
  ChevronRight,
  User,
  UserPlus,
  Settings,
  LogOut,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  FileText,
  Upload,
  Zap,
  Target,
  BarChart3,
  Loader2,
  Smile,
  Frown,
  Meh,
  Calendar,
  MapPin,
  Clock,
  Database,
  UploadCloud,
  Plus,
  Download,
  Eye,
  EyeOff,
  Pencil,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { ModuleId, PlayerData } from './types';
import { mockPlayers } from './mockData';
import { getAgentResponse } from './services/geminiService';

// --- Components ---

interface SidebarItemProps {
  id: ModuleId;
  label: string;
  icon: any;
  active: boolean;
  onClick: () => void;
  key?: string;
}

const SidebarItem = ({ 
  id, 
  label, 
  icon: Icon, 
  active, 
  onClick 
}: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
        : 'text-white/50 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span className="text-sm font-medium tracking-tight">{label}</span>
    {active && (
      <motion.div 
        layoutId="active-pill" 
        className="ml-auto w-1.5 h-1.5 rounded-full bg-black"
      />
    )}
  </button>
);

const ChatBubble = ({ role, content, timestamp }: { role: 'agent' | 'user', content: string, timestamp: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className={`flex flex-col max-w-[85%] ${role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
  >
    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
      role === 'user' 
        ? 'bg-white text-black rounded-tr-none' 
        : 'bg-supreme-gray border border-supreme-border rounded-tl-none'
    }`}>
      {content}
    </div>
    <span className="text-[10px] opacity-30 mt-1 px-1 font-mono uppercase">{timestamp}</span>
  </motion.div>
);

const ModuleHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-8">
    <h1 className="text-4xl font-bold tracking-tighter mb-1 uppercase italic">{title}</h1>
    <p className="text-white/40 text-sm font-medium tracking-wide uppercase">{subtitle}</p>
  </div>
);

const ToxicSemaphore = ({ value }: { value: number }) => {
  const color = value < 1.0 ? 'bg-safe-green' : value < 2.0 ? 'bg-warning-yellow' : 'bg-toxic-red';
  const label = value < 1.0 ? 'Rentable' : value < 2.0 ? 'Observación' : 'Tóxico';
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`} />
      <span className={`text-[10px] font-bold uppercase tracking-wider ${color.replace('bg-', 'text-')}`}>{label}</span>
    </div>
  );
};

const PlayerSmartCard = ({ 
  player, 
  onEdit,
  onAction
}: { 
  player: PlayerData, 
  onEdit: (p: PlayerData) => void,
  onAction: (msg: string, type?: 'success' | 'error' | 'info') => void
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 flex flex-col gap-6"
  >
    <div className="flex justify-between items-start">
      <div>
        <span className="executive-label">Ficha Inteligente</span>
        <h3 className="text-2xl font-black tracking-tighter uppercase mt-1">{player.identity.name}</h3>
        <p className="text-xs text-white/40 uppercase font-bold">{player.identity.position} • {player.identity.age} años</p>
      </div>
      <div className="text-right">
        <span className="executive-label">Fair Value (IA)</span>
        <p className="text-2xl font-black tracking-tighter text-safe-green">${(player.ai_analysis.fair_value_prediction / 1000000).toFixed(1)}M</p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-white/5 rounded-xl">
        <span className="executive-label block mb-2">Toxicidad (τ)</span>
        <p className="text-xl font-mono font-bold">{player.financials.toxic_index_tau.toFixed(2)}</p>
        <ToxicSemaphore value={player.financials.toxic_index_tau} />
      </div>
      <div className="p-4 bg-white/5 rounded-xl">
        <span className="executive-label block mb-2">Adaptabilidad</span>
        <p className="text-xl font-mono font-bold">{(player.performance.adaptability_index * 10).toFixed(0)}%</p>
        <div className="toxic-indicator mt-2">
          <div className="h-full bg-white transition-all" style={{ width: `${player.performance.adaptability_index * 10}%` }} />
        </div>
      </div>
      <div className="p-4 bg-white/5 rounded-xl">
        <span className="executive-label block mb-2">Riesgo Lesión</span>
        <p className="text-xl font-mono font-bold">{(player.performance.injury_risk_score * 100).toFixed(0)}%</p>
        <div className="toxic-indicator mt-2">
          <div className="h-full bg-toxic-red transition-all" style={{ width: `${player.performance.injury_risk_score * 100}%` }} />
        </div>
      </div>
    </div>

    <div className="p-4 border border-white/10 rounded-xl bg-white/5">
      <div className="flex items-center gap-2 mb-2">
        <Info size={14} className="text-white/40" />
        <span className="executive-label">Sugerencia del Agente</span>
      </div>
      <p className="text-sm leading-relaxed italic text-white/80">"{player.ai_analysis.recommendation}"</p>
    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => onAction('Estrategia de salida activada', 'info')}
                        className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all"
                      >
                        {player.ai_analysis.exit_strategy}
                      </button>
                      <button 
                        onClick={() => onEdit(player)}
                        className="px-4 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all"
                      >
                        <Settings size={18} />
                      </button>
                    </div>
  </motion.div>
);

const PlayerDetailModal = ({ 
  isOpen, 
  onClose, 
  player 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  player: PlayerData | null 
}) => {
  if (!isOpen || !player) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-supreme-black border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto"
      >
        {/* Left Side: Photo & Identity */}
        <div className="w-full md:w-1/3 bg-white/5 p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-white/10">
          <div className="w-48 h-48 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl mb-6">
            {player.identity.photo_url ? (
              <img src={player.identity.photo_url} alt={player.identity.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center">
                <User size={80} className="opacity-20" />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-black uppercase italic text-center tracking-tighter">{player.identity.name}</h2>
          <p className="text-cyan-400 font-bold uppercase tracking-widest text-xs mt-2">{player.identity.position}</p>
          
          <div className="mt-8 w-full space-y-4">
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase font-bold opacity-40">Edad</span>
              <span className="text-sm font-bold">{player.identity.age} años</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase font-bold opacity-40">Origen</span>
              <span className="text-sm font-bold">{player.identity.club_origin}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="executive-label">Expediente Completo</span>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mt-1">Detalles del Activo</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Financials */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-4">Información Contractual</h4>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs opacity-40">Valor de Mercado</span>
                  <span className="text-xs font-mono font-bold">${(player.financials.base_market_value / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs opacity-40">Salario Mensual</span>
                  <span className="text-xs font-mono font-bold">${player.financials.monthly_salary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs opacity-40">Inicio Contrato</span>
                  <span className="text-xs font-mono font-bold">{player.financials.contract_start || 'No registrado'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs opacity-40">Término Contrato</span>
                  <span className="text-xs font-mono font-bold">{player.financials.contract_expiry}</span>
                </div>
              </div>
            </div>

            {/* Performance & AI */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-4">Análisis de Rendimiento (AI)</h4>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs opacity-40">Minutos Jugados</span>
                  <span className="text-xs font-bold">{(player.performance.minutes_played_pct * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs opacity-40">Riesgo Lesión</span>
                  <span className={`text-xs font-bold ${player.performance.injury_risk_score > 0.5 ? 'text-toxic-red' : 'text-safe-green'}`}>
                    {(player.performance.injury_risk_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs opacity-40">Índice Toxicidad (τ)</span>
                  <span className={`text-xs font-bold ${player.financials.toxic_index_tau > 2 ? 'text-toxic-red' : 'text-safe-green'}`}>
                    {player.financials.toxic_index_tau.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 p-6 bg-white/5 rounded-3xl border border-white/10">
              <span className="executive-label">Recomendación Estratégica</span>
              <p className="text-sm mt-2 leading-relaxed opacity-80 italic">"{player.ai_analysis.recommendation}"</p>
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <button 
              onClick={onClose}
              className="px-10 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-2xl"
            >
              Cerrar Expediente
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ManualAssetModal = ({ 
  isOpen, 
  onClose, 
  onAddPlayer 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onAddPlayer: (p: PlayerData) => void 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    age: 25,
    club_origin: 'Olimpia',
    monthly_salary: 10000,
    base_market_value: 500000,
    minutes_played_pct: 0.5,
    contract_start: new Date().toISOString().split('T')[0],
    contract_expiry: '2026-12-31',
    photo_url: ''
  });

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlayer: PlayerData = {
      player_id: `UUID_${Math.random().toString(36).substr(2, 9)}`,
      identity: {
        name: formData.name,
        position: formData.position,
        age: formData.age,
        club_origin: formData.club_origin,
        photo_url: formData.photo_url || undefined
      },
      financials: {
        base_market_value: formData.base_market_value,
        real_cost_accumulated: 0,
        monthly_salary: formData.monthly_salary,
        contract_start: formData.contract_start,
        contract_expiry: formData.contract_expiry,
        agent_fees: 0,
        toxic_index_tau: 0.5
      },
      performance: {
        minutes_played_pct: formData.minutes_played_pct,
        adaptability_index: 5,
        injury_risk_score: 0.1
      },
      ai_analysis: {
        fair_value_prediction: formData.base_market_value,
        exit_strategy: 'N/A',
        recommendation: 'Nuevo activo ingresado manualmente.'
      }
    };
    onAddPlayer(newPlayer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-supreme-black border border-supreme-border rounded-3xl overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-6 border-b border-supreme-border flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">Ingreso Manual de Activo</h2>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Carga Directa al Núcleo de Datos</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {/* Circular Profile Photo Upload */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 bg-white/5 flex items-center justify-center shadow-2xl transition-all group-hover:border-cyan-400">
                {formData.photo_url ? (
                  <img src={formData.photo_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={64} className="text-white/20" />
                )}
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-cyan-400 text-black rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110"
              >
                <Pencil size={16} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <p className="text-[10px] uppercase font-black tracking-widest mt-4 opacity-40">Foto de Perfil del Activo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="executive-label">Nombre Completo</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 outline-none transition-all"
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <label className="executive-label">Posición</label>
              <input 
                required
                type="text" 
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 outline-none transition-all"
                placeholder="Ej: Defensa Central"
              />
            </div>
            <div className="space-y-2">
              <label className="executive-label">Edad</label>
              <input 
                required
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="executive-label">Club de Origen</label>
              <input 
                required
                type="text" 
                value={formData.club_origin}
                onChange={(e) => setFormData({...formData, club_origin: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="executive-label">Salario Mensual ($)</label>
              <input 
                required
                type="number" 
                value={formData.monthly_salary}
                onChange={(e) => setFormData({...formData, monthly_salary: Number(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="executive-label">Valor de Mercado ($)</label>
              <input 
                required
                type="number" 
                value={formData.base_market_value}
                onChange={(e) => setFormData({...formData, base_market_value: Number(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="executive-label">Fecha Contrato Inicial</label>
              <input 
                required
                type="date" 
                value={formData.contract_start}
                onChange={(e) => setFormData({...formData, contract_start: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="executive-label">Fecha Término Contrato</label>
              <input 
                required
                type="date" 
                value={formData.contract_expiry}
                onChange={(e) => setFormData({...formData, contract_expiry: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-400 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-8 py-3 bg-cyan-400 text-black rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
              Confirmar Ingreso
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const DataManagementModal = ({ 
  isOpen, 
  onClose, 
  players, 
  onUpdatePlayer 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  players: PlayerData[], 
  onUpdatePlayer: (p: PlayerData) => void 
}) => {
  const [localPlayers, setLocalPlayers] = useState(players);

  // Sync local state when players prop changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalPlayers(JSON.parse(JSON.stringify(players)));
    }
  }, [isOpen, players]);

  if (!isOpen) return null;

  const handleUpdate = (idx: number, field: string, value: any) => {
    const updated = [...localPlayers];
    const player = { ...updated[idx] };
    
    if (field === 'monthly_salary') player.financials = { ...player.financials, monthly_salary: value };
    if (field === 'base_market_value') player.financials = { ...player.financials, base_market_value: value };
    if (field === 'minutes_played_pct') player.performance = { ...player.performance, minutes_played_pct: value };
    
    updated[idx] = player;
    setLocalPlayers(updated);
    onUpdatePlayer(player);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl max-h-[90vh] bg-supreme-black border border-supreme-border rounded-3xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="p-6 border-b border-supreme-border flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">Mantenedor de Activos</h2>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Gestión Centralizada de Datos del Plantel</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {localPlayers.map((player, idx) => (
            <div key={player.player_id} className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold uppercase">{player.identity.name}</h3>
                <span className="text-[10px] font-mono opacity-40">ID: {player.player_id}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] uppercase font-bold opacity-40">Salario Mensual ($)</label>
                  <input 
                    type="number" 
                    value={player.financials.monthly_salary}
                    onChange={(e) => handleUpdate(idx, 'monthly_salary', Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-cyan-400 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase font-bold opacity-40">Valor de Mercado ($)</label>
                  <input 
                    type="number" 
                    value={player.financials.base_market_value}
                    onChange={(e) => handleUpdate(idx, 'base_market_value', Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-cyan-400 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase font-bold opacity-40">Minutos Jugados (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={player.performance.minutes_played_pct}
                    onChange={(e) => handleUpdate(idx, 'minutes_played_pct', Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-cyan-400 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={() => {
              // Simulate file selection
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.csv,.json';
              input.onchange = () => {
                // Mock loading
                onClose();
                setTimeout(() => {
                  // In a real app, we'd parse the file here
                }, 1000);
              };
              input.click();
            }}
            className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/20 transition-all group"
          >
            <Upload size={20} className="opacity-40 group-hover:opacity-100" />
            <span className="text-xs font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">Cargar Nuevo Activo (CSV/JSON)</span>
          </button>
        </div>

        <div className="p-6 border-t border-supreme-border bg-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all"
          >
            Finalizar Carga
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const CalendarModal = ({ isOpen, onClose, history }: { isOpen: boolean, onClose: () => void, history: any[] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-2xl w-full p-8 space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Calendario Completo de Ejecución</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
          {history.map((match) => (
            <div key={match.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${match.status === 'past' ? 'bg-white/20' : 'bg-cyan-400 animate-pulse'}`} />
                <div>
                  <p className="text-sm font-bold uppercase">{match.opponent}</p>
                  <p className="text-[10px] opacity-40 uppercase">{match.date} • {match.type}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-mono font-bold ${match.status === 'past' ? 'text-white' : 'text-cyan-400'}`}>
                  {match.result}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
          <button 
            onClick={() => {
              const csv = history.map(m => `${m.date},${m.opponent},${m.result},${m.type}`).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'calendario_alma.csv';
              a.click();
            }}
            className="px-6 py-2 rounded-xl bg-white text-black text-[10px] font-bold uppercase flex items-center gap-2"
          >
            <Download size={14} /> Descargar CSV
          </button>
          <button onClick={onClose} className="px-6 py-2 rounded-xl border border-white/10 text-[10px] font-bold uppercase">Cerrar</button>
        </div>
      </motion.div>
    </div>
  );
};

const TwinEditModal = ({ twin, isOpen, onClose, onSave }: { twin: any, isOpen: boolean, onClose: () => void, onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState(twin || {});

  useEffect(() => {
    if (twin) setFormData(twin);
  }, [twin]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-2xl w-full p-8 space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Editar Perfil de Gemelo</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <span className="executive-label">Posiciones (GK, DF, MD, ST, etc.)</span>
            <div className="grid grid-cols-3 gap-2">
              <input 
                type="text" 
                placeholder="Pos 1"
                className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs uppercase font-bold"
                value={formData.pos1 || ''}
                onChange={e => setFormData({...formData, pos1: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Pos 2"
                className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs uppercase font-bold"
                value={formData.pos2 || ''}
                onChange={e => setFormData({...formData, pos2: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Pos 3"
                className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs uppercase font-bold"
                value={formData.pos3 || ''}
                onChange={e => setFormData({...formData, pos3: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <span className="executive-label">Estadísticas de Rendimiento</span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[8px] uppercase opacity-40 block mb-1">Goles</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                  value={formData.goals || 0}
                  onChange={e => setFormData({...formData, goals: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-[8px] uppercase opacity-40 block mb-1">Partidos</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                  value={formData.matches || 0}
                  onChange={e => setFormData({...formData, matches: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-[8px] uppercase opacity-40 block mb-1">Faltas</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                  value={formData.fouls || 0}
                  onChange={e => setFormData({...formData, fouls: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-[8px] uppercase opacity-40 block mb-1">Asistencias</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                  value={formData.assists || 0}
                  onChange={e => setFormData({...formData, assists: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2 rounded-xl border border-white/10 text-[10px] font-bold uppercase">Cancelar</button>
          <button 
            onClick={() => onSave(formData)}
            className="px-6 py-2 rounded-xl bg-white text-black text-[10px] font-bold uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Guardar Cambios
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const FormationBuilderModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (name: string, positions: any[]) => void }) => {
  const [name, setName] = useState('');
  const [positions, setPositions] = useState<any[]>([]);
  const [pendingPos, setPendingPos] = useState<{ x: number, y: number } | null>(null);
  const [pendingLabel, setPendingLabel] = useState('ST');

  if (!isOpen) return null;

  const handleFieldClick = (e: React.MouseEvent) => {
    if (pendingPos) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPos({ x, y });
  };

  const confirmPosition = () => {
    if (pendingPos && pendingLabel) {
      setPositions([...positions, { pos: pendingLabel.toUpperCase(), top: `${pendingPos.y}%`, left: `${pendingPos.x}%` }]);
      setPendingPos(null);
      setPendingLabel('ST');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[110] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-4xl w-full p-6 md:p-8 flex flex-col gap-6 my-auto"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">Constructor de Formación Ideal</h2>
            <p className="text-[10px] md:text-xs text-white/40 uppercase">Haz clic en el campo para añadir posiciones</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <div 
              onClick={handleFieldClick}
              className="relative aspect-[16/10] bg-white/5 rounded-2xl border-2 border-dashed border-white/20 overflow-hidden cursor-crosshair"
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 border-2 border-white m-4" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-full" />
              </div>
              
              {positions.map((p, i) => (
                <div 
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-black flex items-center justify-center text-[8px] md:text-[10px] font-black shadow-lg z-10"
                  style={{ top: p.top, left: p.left }}
                >
                  {p.pos}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPositions(positions.filter((_, idx) => idx !== i));
                    }}
                    className="absolute -top-2 -right-2 bg-toxic-red text-white rounded-full p-1 hover:scale-110 transition-transform shadow-lg"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {pendingPos && (
                <div 
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2"
                  style={{ top: `${pendingPos.y}%`, left: `${pendingPos.x}%` }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-400 animate-pulse" />
                  <div className="bg-supreme-black border border-white/20 p-2 rounded-xl shadow-2xl flex flex-col gap-2 min-w-[100px]">
                    <input 
                      autoFocus
                      type="text"
                      maxLength={3}
                      value={pendingLabel}
                      onChange={(e) => setPendingLabel(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && confirmPosition()}
                      className="w-full bg-white/10 border border-white/10 rounded px-2 py-1 text-[10px] font-bold uppercase outline-none focus:border-cyan-400"
                    />
                    <div className="flex gap-1">
                      <button 
                        onClick={confirmPosition}
                        className="flex-1 bg-cyan-400 text-black text-[8px] font-bold py-1 rounded uppercase"
                      >
                        OK
                      </button>
                      <button 
                        onClick={() => setPendingPos(null)}
                        className="flex-1 bg-white/10 text-white text-[8px] font-bold py-1 rounded uppercase"
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <span className="executive-label">Nombre de la Formación</span>
              <input 
                type="text" 
                placeholder="Ej: 3-4-3 Ofensivo"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-cyan-400 transition-all"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2 flex-1">
              <span className="executive-label">Resumen de Posiciones ({positions.length})</span>
              <div className="max-h-48 lg:max-h-64 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                {positions.map((p, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-cyan-400">{p.pos}</span>
                    <span className="opacity-40">T:{parseInt(p.top)}% L:{parseInt(p.left)}%</span>
                  </div>
                ))}
                {positions.length === 0 && <p className="text-[10px] opacity-20 italic p-4 text-center border border-dashed border-white/10 rounded-xl">Haz clic en el campo para añadir posiciones</p>}
              </div>
            </div>

            <button 
              onClick={() => {
                if (!name || positions.length === 0) return;
                onSave(name, positions);
                setName('');
                setPositions([]);
                onClose();
              }}
              disabled={!name || positions.length === 0}
              className="w-full py-4 rounded-xl bg-cyan-400 text-black font-black uppercase tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:grayscale"
            >
              Guardar Formación
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const WarRoomSimulation = ({ 
  onAction, 
  isSimulating, 
  onSimulate,
  players,
  selectedIds
}: { 
  onAction: (msg: string, type?: 'success' | 'error' | 'info') => void,
  isSimulating: boolean,
  onSimulate: () => void,
  players: PlayerData[],
  selectedIds: string[]
}) => {
  const selectedPlayers = players.filter(p => selectedIds.includes(p.player_id));
  const avgToxic = selectedPlayers.length > 0 ? selectedPlayers.reduce((acc, p) => acc + p.financials.toxic_index_tau, 0) / selectedPlayers.length : 0;
  const totalValue = selectedPlayers.reduce((acc, p) => acc + p.financials.base_market_value, 0);
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-8 border-2 border-white/20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-toxic-red/20 rounded-xl flex items-center justify-center">
            <Zap size={24} className="text-toxic-red" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">The War Room</h2>
            <p className="text-xs text-white/40 uppercase font-bold">Simulador de Escenarios Estratégicos</p>
          </div>
        </div>

        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 mb-8">
          <span className="executive-label">Escenario Activo</span>
          <h3 className="text-xl font-bold uppercase mt-2">
            {selectedPlayers.length > 0 
              ? `Gestión de Activos: ${selectedPlayers.length} Jugadores Seleccionados`
              : 'Seleccione jugadores para simular escenario'}
          </h3>
          {selectedPlayers.length > 0 && (
            <p className="text-[10px] opacity-40 mt-1 uppercase font-bold">
              Valor Total en Riesgo: ${(totalValue / 1000000).toFixed(1)}M
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <span className="executive-label">Competitividad</span>
            <div className="h-32 flex items-end justify-center gap-1">
              {[40, 60, 55, 30, 20].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className={`w-4 rounded-t-sm ${i === 4 ? 'bg-toxic-red' : 'bg-white/20'}`}
                />
              ))}
            </div>
            <p className="text-[10px] font-bold text-toxic-red uppercase tracking-widest">Riesgo: Pérdida de Campeonato</p>
          </div>

          <div className="text-center space-y-4">
            <span className="executive-label">Finanzas</span>
            <div className="h-32 flex items-end justify-center gap-1">
              {[20, 30, 40, 60, 90].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className={`w-4 rounded-t-sm ${i === 4 ? 'bg-safe-green' : 'bg-white/20'}`}
                />
              ))}
            </div>
            <p className="text-[10px] font-bold text-safe-green uppercase tracking-widest">Liquidez Inmediata: +${(totalValue / 1000000).toFixed(1)}M</p>
          </div>

          <div className="text-center space-y-4">
            <span className="executive-label">Reacción Social</span>
            <div className="relative h-32 w-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="50" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <motion.circle 
                  cx="64" cy="64" r="50" fill="transparent" stroke="#FF4444" strokeWidth="8" 
                  strokeDasharray="314"
                  initial={{ strokeDashoffset: 314 }}
                  animate={{ strokeDashoffset: 314 * (avgToxic / 3) }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">{Math.min(100, Math.round((avgToxic / 3) * 100))}%</span>
                <span className="text-[8px] uppercase opacity-40">Negativo</span>
              </div>
            </div>
            <p className="text-[10px] font-bold text-warning-yellow uppercase tracking-widest">Crisis de Opinión Detectada</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex justify-end gap-4">
          <button 
            onClick={() => onAction('Simulación cancelada', 'info')}
            disabled={isSimulating || selectedIds.length === 0}
            className="px-6 py-3 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all disabled:opacity-50"
          >
            Cancelar Simulación
          </button>
          <button 
            onClick={onSimulate}
            disabled={isSimulating || selectedIds.length === 0}
            className="px-6 py-3 rounded-xl bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-2 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Procesando...
              </>
            ) : (
              'Ejecutar Decisión'
            )}
          </button>
        </div>
      </div>

      {selectedPlayers.length > 0 && (
        <div className="glass-card p-8 border-t-4 border-cyan-400">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 size={20} className="text-cyan-400" />
            <h3 className="text-xl font-black uppercase italic italic">Análisis de Figuras Destacadas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedPlayers.map(p => (
              <div key={p.player_id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] font-bold uppercase text-cyan-400 mb-1">{p.identity.position}</p>
                <p className="text-sm font-bold uppercase truncate">{p.identity.name}</p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-[8px] uppercase opacity-40">
                    <span>ROI Proyectado</span>
                    <span className="text-safe-green">+{(p.ai_analysis.fair_value_prediction / p.financials.real_cost_accumulated * 100 - 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-[8px] uppercase opacity-40">
                    <span>Riesgo Lesión</span>
                    <span className={p.performance.injury_risk_score > 0.3 ? 'text-toxic-red' : 'text-safe-green'}>{(p.performance.injury_risk_score * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-cyan-400/10 rounded-xl border border-cyan-400/20">
            <p className="text-[10px] font-bold uppercase text-cyan-400 mb-2 flex items-center gap-2">
              <Info size={12} /> Conclusión de IA para el Grupo
            </p>
            <p className="text-xs leading-relaxed opacity-80">
              La gestión conjunta de estos {selectedPlayers.length} activos permitiría una liberación de masa salarial de ${(selectedPlayers.reduce((acc, p) => acc + p.financials.monthly_salary, 0) / 1000).toFixed(0)}K mensuales. 
              {avgToxic > 1.5 ? ' Se recomienda priorizar la salida de los perfiles con alto índice τ para sanear el vestuario.' : ' El grupo presenta una estabilidad saludable; las decisiones deben basarse estrictamente en el ROI financiero.'}
            </p>
          </div>
        </div>
      )}

      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="executive-label">Histórico de Retención y Estados</span>
            <h3 className="text-xl font-black uppercase italic mt-1">Auditoría de Continuidad</h3>
          </div>
          <button 
            onClick={() => onAction('Exportando historial de estados...', 'success')}
            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Download size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {players.filter(p => selectedIds.includes(p.player_id) || selectedIds.length === 0).map((p) => (
            <div key={p.player_id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <User size={18} className="opacity-40" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase">{p.identity.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 bg-safe-green/20 text-safe-green rounded">Retenido</span>
                    <span className="text-[8px] opacity-40 uppercase">{p.identity.position}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[8px] opacity-20 uppercase font-bold mb-1">Valor Actual</p>
                  <p className="text-sm font-mono font-bold">${(p.financials.base_market_value / 1000000).toFixed(1)}M</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] opacity-20 uppercase font-bold mb-1">Toxicidad</p>
                  <p className={`text-sm font-mono font-bold ${p.financials.toxic_index_tau > 2 ? 'text-toxic-red' : 'text-safe-green'}`}>
                    τ {p.financials.toxic_index_tau.toFixed(2)}
                  </p>
                </div>
                <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const AlmaEye = ({ size = 120, scanning = true }: { size?: number, scanning?: boolean }) => {
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
        {/* Outer Ring */}
        <motion.circle 
          cx="50" cy="50" r="48" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5" 
          className="text-cyan-400/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Tech Ring 1 */}
        <motion.circle 
          cx="50" cy="50" r="42" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1" 
          strokeDasharray="10 20"
          className="text-cyan-400/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Iris Background */}
        <defs>
          <radialGradient id="irisGradient">
            <stop offset="20%" stopColor="#000" />
            <stop offset="60%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0e7490" />
          </radialGradient>
        </defs>
        
        <circle cx="50" cy="50" r="35" fill="url(#irisGradient)" className="opacity-80" />

        {/* Iris Details */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(12)].map((_, i) => (
            <line 
              key={i}
              x1="50" y1="20" x2="50" y2="30"
              transform={`rotate(${i * 30} 50 50)`}
              stroke="rgba(34, 211, 238, 0.4)"
              strokeWidth="1"
            />
          ))}
        </motion.g>

        {/* Pupil */}
        <motion.circle 
          cx="50" cy="50" r="15" 
          fill="#000" 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Pupil Reflection */}
        <circle cx="45" cy="45" r="4" fill="white" fillOpacity="0.3" />
        
        {/* Eye Shape Mask (Optional but makes it look more like an eye) */}
        <path 
          d="M10 50 Q50 10 90 50 Q50 90 10 50" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className="text-cyan-400"
        />
      </svg>

      {/* Scanning Line */}
      {scanning && (
        <motion.div 
          animate={{ top: ['10%', '90%', '10%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-4 right-4 h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)] z-20"
        />
      )}
      
      {/* Glow Overlay */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/5 blur-xl animate-pulse" />
    </div>
  );
};

const LogoutModal = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-supreme-black border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center"
      >
        <div className="w-16 h-16 bg-toxic-red/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <LogOut size={32} className="text-toxic-red" />
        </div>
        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white mb-2">¿Cerrar Sesión?</h3>
        <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-8">El sistema Alma entrará en modo de hibernación.</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onCancel}
            className="py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            No, Volver
          </button>
          <button 
            onClick={onConfirm}
            className="py-3 rounded-xl bg-toxic-red text-black font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-500/20"
          >
            Sí, Salir
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ExitScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[700] bg-black flex flex-col items-center justify-center overflow-hidden">
      <motion.div 
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="relative"
      >
        <AlmaEye size={200} scanning={false} />
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 1.5, ease: "linear" }}
          className="absolute inset-0 bg-black z-10"
        />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, times: [0, 0.5, 1] }}
        className="mt-12 text-center"
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-cyan-400">Desconectando Núcleo Alma...</p>
        <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/20 mt-2">Protocolo de seguridad ejecutado</p>
      </motion.div>

      {/* Shutdown line effect */}
      <motion.div 
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, delay: 2.2 }}
        className="absolute w-full h-[1px] bg-white z-[800]"
      />
    </div>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const icons = [Activity, DollarSign, TrendingUp, Play, Zap];
  const labels = ['Sincronizando Salud', 'Calculando Finanzas', 'Analizando Comunicación', 'Proyectando Táctica', 'Iniciando IA'];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[300] bg-supreme-black flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-toxic-red/10 blur-[120px] rounded-full animate-pulse" />

      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="flex flex-col items-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <AlmaEye size={140} />
          </motion.div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Iniciando Alma</h2>
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/30">Cargando Módulos de Alto Rendimiento</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <div className="flex gap-4">
              {icons.map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: progress > (i * 20) ? 1 : 0.2,
                    y: progress > (i * 20) ? 0 : 10,
                    scale: progress > (i * 20) ? 1.2 : 1
                  }}
                  className={`${progress > (i * 20) ? 'text-cyan-400' : 'text-white/10'}`}
                >
                  <Icon size={20} />
                </motion.div>
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">{progress}%</span>
          </div>

          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <div className="h-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p 
                key={Math.floor(progress / 20)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-[10px] uppercase font-bold tracking-widest text-white/40 text-center"
              >
                {labels[Math.min(Math.floor(progress / 20), labels.length - 1)]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'prueba@eterlink.cl' && password === 'eterlink2026@') {
        onLogin();
      } else {
        setError('Credenciales de acceso denegadas. Verifique su identidad.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-supreme-black flex items-center justify-center p-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md glass-card p-10 relative z-10 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="mb-6">
            <AlmaEye size={120} />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Alma</h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/30 mt-2">Inteligencia Deportiva de Élite</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="executive-label">Identificador de Acceso</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:border-cyan-400 outline-none transition-all placeholder:text-white/10"
                placeholder="usuario@eterlink.cl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="executive-label">Clave Encriptada</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input 
                required
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:border-cyan-400 outline-none transition-all placeholder:text-white/10"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-cyan-400 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-toxic-red/10 border border-toxic-red/20 rounded-xl flex items-center gap-3 text-toxic-red"
            >
              <ShieldAlert size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{error}</span>
            </motion.div>
          )}

          <button 
            disabled={isLoading}
            type="submit"
            className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Acceder al Núcleo <ArrowUpRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-[8px] uppercase font-bold tracking-widest text-white/20">Acceso Restringido • Protocolo de Seguridad Eterlink 2026</p>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleId>('CHAT');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'agent', content: 'Bienvenido, Presidente. El sistema Alma está en línea. ¿En qué puedo asistirle hoy?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [players, setPlayers] = useState<PlayerData[]>(mockPlayers);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerData | null>(null);
  const [toasts, setToasts] = useState<{ id: number, message: string, type: 'success' | 'error' | 'info' }[]>([]);
  const [globalConfig, setGlobalConfig] = useState({ toxicThreshold: 2.0, baseCurrency: 'USD' });
  const [mantenedorTab, setMantenedorTab] = useState<'DB' | 'INGEST' | 'CONFIG'>('DB');
  const [lineupFormation, setLineupFormation] = useState<'4-3-3' | '4-4-2'>('4-3-3');
  const [twinSearch, setTwinSearch] = useState('');
  const [selectedShadowPos, setSelectedShadowPos] = useState<string | null>(null);
  const [assignedPlayers, setAssignedPlayers] = useState<Record<string, string>>({});
  const [tacticalStyle, setTacticalStyle] = useState('Equilibrado');
  const [matchHistory, setMatchHistory] = useState([
    { id: 1, date: '2026-02-15', opponent: 'Cerro Porteño', result: '2-1', status: 'past', type: 'Clásico' },
    { id: 2, date: '2026-02-22', opponent: 'Libertad', result: '0-0', status: 'past', type: 'Liga' },
    { id: 3, date: '2026-03-05', opponent: 'Guaraní', result: 'vs', status: 'future', type: 'Liga' },
    { id: 4, date: '2026-03-12', opponent: 'Nacional', result: 'vs', status: 'future', type: 'Copa' },
  ]);
  const [selectedTwin, setSelectedTwin] = useState<any | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [financeSearch, setFinanceSearch] = useState('');
  const [selectedFinanceIds, setSelectedFinanceIds] = useState<string[]>([]);
  const [customFormations, setCustomFormations] = useState<{name: string, positions: any[]}[]>([]);
  const [isFormationBuilderOpen, setIsFormationBuilderOpen] = useState(false);
  const [editingTwin, setEditingTwin] = useState<any | null>(null);
  const [isTwinModalOpen, setIsTwinModalOpen] = useState(false);
  const [selectedDetailPlayer, setSelectedDetailPlayer] = useState<PlayerData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    
    const userMsg = chatInput;
    const newMessages = [...messages, { 
      role: 'user', 
      content: userMsg, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }];
    setMessages(newMessages);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await getAgentResponse(userMsg);
      setMessages(prev => [...prev, { 
        role: 'agent', 
        content: response, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'agent', 
        content: 'Error de conexión con el núcleo de IA.', 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const modules = [
    { id: 'CHAT', name: 'El Piloto (Agente)', icon: MessageSquare, desc: 'Interfaz de inteligencia narrativa' },
    { id: 'A', name: 'Secretaría Técnica', icon: ShieldAlert, desc: 'Gestión legal y contractual' },
    { id: 'B', name: 'Scouting & Rendimiento', icon: Search, desc: 'Selección científica de talento' },
    { id: 'C', name: 'Salud & GPS', icon: Activity, desc: 'Mitigación de lesiones y fatiga' },
    { id: 'D', name: 'Finanzas & ROI', icon: DollarSign, desc: 'Salud financiera y proyección' },
    { id: 'E', name: 'Comunicación', icon: TrendingUp, desc: 'Social listening y política' },
    { id: 'F', name: 'Táctica Dinámica', icon: Play, desc: 'Análisis de tramos y estrategia' },
    { id: 'G', name: 'Player Care', icon: Heart, desc: 'Bienestar y adaptabilidad humana' },
    { id: 'H', name: 'Mantenedores', icon: Settings, desc: 'Gestión maestra de activos y datos' },
  ];

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => {
      setIsAuthenticated(true);
      setIsInitialLoading(true);
    }} />;
  }

  if (isInitialLoading) {
    return <LoadingScreen onComplete={() => setIsInitialLoading(false)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-supreme-black">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="relative h-full border-r border-supreme-border bg-supreme-black flex flex-col z-50 overflow-hidden"
      >
        <div className="p-6 flex items-center gap-4">
          <AlmaEye size={50} />
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase italic tracking-tighter text-white leading-none">Alma</h1>
            <p className="text-[8px] uppercase font-bold tracking-widest text-white/30 mt-1">Élite Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="mb-4 px-4">
            <span className="executive-label">Módulos Troncales</span>
          </div>
          {modules.map((mod) => (
            <SidebarItem
              key={mod.id}
              id={mod.id as ModuleId}
              label={mod.name}
              icon={mod.icon}
              active={activeModule === mod.id}
              onClick={() => setActiveModule(mod.id as ModuleId)}
            />
          ))}
          
          <div className="mt-8 px-4">
            <button 
              onClick={() => setIsManualEntryOpen(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all group"
            >
              <UserPlus size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Ingreso Manual</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-supreme-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-full bg-supreme-gray border border-supreme-border flex items-center justify-center">
              <User size={20} className="text-white/50" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate uppercase">Presidente</p>
              <p className="text-[10px] text-white/30 truncate">Club Olimpia</p>
            </div>
            <button 
              onClick={() => setIsLogoutModalOpen(true)}
              className="text-white/30 hover:text-toxic-red transition-colors p-2 hover:bg-toxic-red/10 rounded-lg"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </motion.aside>

      <AnimatePresence>
        {isLogoutModalOpen && (
          <LogoutModal 
            onCancel={() => setIsLogoutModalOpen(false)}
            onConfirm={() => {
              setIsLogoutModalOpen(false);
              setIsExiting(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExiting && (
          <ExitScreen onComplete={() => {
            setIsExiting(false);
            setIsAuthenticated(false);
          }} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-supreme-border flex items-center justify-between px-8 bg-supreme-black/80 backdrop-blur-md z-40">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-safe-green animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">System Live</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Toast Container */}
          <div className="fixed top-8 right-8 z-[200] flex flex-col gap-3">
            <AnimatePresence>
              {toasts.map(toast => (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-xl ${
                    toast.type === 'success' ? 'bg-safe-green/20 border-safe-green/30 text-safe-green' :
                    toast.type === 'error' ? 'bg-toxic-red/20 border-toxic-red/30 text-toxic-red' :
                    'bg-white/10 border-white/20 text-white'
                  }`}
                >
                  {toast.type === 'success' ? <CheckCircle2 size={18} /> : 
                   toast.type === 'error' ? <ShieldAlert size={18} /> : <Info size={18} />}
                  <span className="text-sm font-bold uppercase tracking-tight">{toast.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <DataManagementModal 
            isOpen={isManagementOpen} 
            onClose={() => {
              setIsManagementOpen(false);
              addToast('Datos sincronizados correctamente');
            }} 
            players={players}
            onUpdatePlayer={(p) => {
              setPlayers(prev => prev.map(player => player.player_id === p.player_id ? p : player));
            }}
          />

          <ManualAssetModal 
            isOpen={isManualEntryOpen}
            onClose={() => setIsManualEntryOpen(false)}
            onAddPlayer={(newPlayer) => {
              setPlayers(prev => [...prev, newPlayer]);
              addToast(`Activo ${newPlayer.identity.name} ingresado correctamente`, 'success');
            }}
          />

          <AnimatePresence>
            {selectedTwin && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-2xl bg-supreme-black border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                >
                  <div className="p-8 border-b border-white/5 flex justify-between items-start">
                    <div>
                      <span className="executive-label">Análisis de Similitud IA</span>
                      <h2 className="text-3xl font-black uppercase italic mt-2">{selectedTwin.name}</h2>
                      <p className="text-sm text-cyan-400 font-bold uppercase tracking-widest mt-1">{selectedTwin.club} • {selectedTwin.pos}</p>
                    </div>
                    <button onClick={() => setSelectedTwin(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="p-8 grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[8px] uppercase font-bold opacity-40">Índice de Coincidencia</span>
                        <div className="flex items-end gap-2 mt-1">
                          <span className="text-4xl font-black italic text-safe-green">{selectedTwin.match}</span>
                          <span className="text-[10px] font-bold opacity-20 mb-1">vs. Perfil Objetivo</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <span className="executive-label">Atributos Clave</span>
                        {[
                          { label: 'Visión de Juego', val: 92 },
                          { label: 'Resistencia a la Presión', val: 88 },
                          { label: 'Pases Progresivos', val: 95 },
                          { label: 'Recuperación tras Pérdida', val: 84 },
                        ].map(attr => (
                          <div key={attr.label} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold uppercase">
                              <span className="opacity-40">{attr.label}</span>
                              <span>{attr.val}%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${attr.val}%` }}
                                className="h-full bg-white"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="glass-card p-6 flex-1 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-cyan-400/20 flex items-center justify-center">
                          <TrendingUp size={32} className="text-cyan-400" />
                        </div>
                        <p className="text-xs font-bold uppercase leading-relaxed">
                          Este jugador presenta una desviación estadística menor al 5% respecto al perfil de <span className="text-cyan-400">Enzo Fernández</span> en su etapa inicial.
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          addToast(`Iniciando contacto con agentes de ${selectedTwin.name}...`, 'info');
                          setSelectedTwin(null);
                        }}
                        className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                      >
                        Iniciar Gestión de Fichaje
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isCalendarOpen && (
              <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-3xl bg-supreme-black border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col max-h-[80vh]"
                >
                  <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div>
                      <span className="executive-label">Calendario Maestro de Ejecución</span>
                      <h2 className="text-2xl font-black uppercase italic mt-1 tracking-widest">Temporada 2026</h2>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => addToast('Generando calendario PDF descargable...', 'success')}
                        className="px-4 py-2 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all flex items-center gap-2"
                      >
                        <Download size={14} /> Descargar PDF
                      </button>
                      <button onClick={() => setIsCalendarOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                    <div className="grid grid-cols-1 gap-4">
                      {matchHistory.map((match) => (
                        <div key={match.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-cyan-400/30 transition-all group">
                          <div className="flex items-center gap-6">
                            <div className="text-center min-w-[60px]">
                              <p className="text-[10px] opacity-40 uppercase font-bold">
                                {new Date(match.date).toLocaleDateString('es-PY', { month: 'short' }).toUpperCase()}
                              </p>
                              <p className="text-2xl font-black italic">{match.date.split('-')[2]}</p>
                            </div>
                            <div className="h-10 w-px bg-white/10" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${match.status === 'past' ? 'bg-white/10 text-white/40' : 'bg-cyan-400 text-black'}`}>
                                  {match.status === 'past' ? 'Finalizado' : 'Próximo'}
                                </span>
                                <span className="text-[8px] opacity-40 uppercase font-bold">{match.type}</span>
                              </div>
                              <h3 className="text-lg font-black uppercase mt-1">{match.opponent}</h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <p className="text-[8px] opacity-20 uppercase font-bold mb-1">Resultado / Hora</p>
                              <p className={`text-xl font-mono font-black ${match.status === 'past' ? 'text-white' : 'text-cyan-400'}`}>
                                {match.result === 'vs' ? '20:00' : match.result}
                              </p>
                            </div>
                            <button className="p-3 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black">
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-6 bg-black/40 border-t border-white/5 text-center">
                    <p className="text-[10px] opacity-40 uppercase font-bold tracking-[0.3em]">Sincronizado con el Núcleo ALMA • Actualizado hace 2 min</p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeModule === 'CHAT' ? (
              <motion.div 
                key="chat-module"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col max-w-4xl mx-auto"
              >
                <ModuleHeader 
                  title="The President's Agent" 
                  subtitle="Capa 0: Interfaz de Inteligencia Narrativa" 
                />
                
                <div className="flex-1 glass-card p-6 flex flex-col gap-6 overflow-hidden">
                  <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                    {messages.map((msg, i) => (
                      <ChatBubble key={i} {...msg as any} />
                    ))}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mr-auto items-start flex flex-col"
                      >
                        <div className="px-4 py-3 rounded-2xl bg-supreme-gray border border-supreme-border rounded-tl-none flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin opacity-50" />
                          <span className="text-xs opacity-50 font-medium">Analizando módulos...</span>
                        </div>
                      </motion.div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="pt-4 border-t border-supreme-border flex gap-3">
                    <input 
                      type="text"
                      value={chatInput}
                      disabled={isTyping}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Pregunte al Agente sobre contratos, rendimiento o finanzas..."
                      className="flex-1 bg-white/5 border border-supreme-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={isTyping}
                      className="bg-white text-black p-3 rounded-xl hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
                    >
                      {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {[
                    { label: 'Ver Informe Financiero', query: 'Muéstrame un resumen financiero del plantel' },
                    { label: 'Sugerir Acción', query: '¿Qué acciones estratégicas sugieres hoy?' },
                    { label: 'Riesgo de Lesiones', query: '¿Quiénes tienen mayor riesgo de lesión?' },
                    { label: 'Contratos Vencidos', query: '¿Qué contratos vencen pronto?' }
                  ].map((action) => (
                    <button 
                      key={action.label}
                      onClick={() => {
                        setChatInput(action.query);
                        addToast(`Acción rápida: ${action.label}`, 'info');
                      }}
                      className="whitespace-nowrap px-4 py-2 rounded-full border border-supreme-border text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : activeModule === 'D' ? (
              <motion.div 
                key="finance-module"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full flex flex-col"
              >
                <ModuleHeader 
                  title="Auditoría de Activos" 
                  subtitle="Supervivencia Financiera y ROI de Jugadores" 
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card overflow-hidden flex flex-col h-[600px]">
                      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <div className="relative w-64">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                          <input 
                            type="text" 
                            placeholder="Buscar jugador..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs outline-none focus:border-cyan-400/50 transition-all"
                            value={financeSearch}
                            onChange={e => setFinanceSearch(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold uppercase opacity-40">{selectedFinanceIds.length} Seleccionados</span>
                          <button 
                            onClick={() => setSelectedFinanceIds([])}
                            className="text-[10px] font-bold uppercase text-toxic-red hover:underline"
                          >
                            Limpiar
                          </button>
                        </div>
                      </div>
                      <div className="overflow-y-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                          <thead className="sticky top-0 bg-supreme-black z-10">
                            <tr className="border-b border-white/10">
                              <th className="p-4 w-12">
                                <input 
                                  type="checkbox" 
                                  className="accent-cyan-400"
                                  checked={selectedFinanceIds.length === players.length}
                                  onChange={(e) => {
                                    if (e.target.checked) setSelectedFinanceIds(players.map(p => p.player_id));
                                    else setSelectedFinanceIds([]);
                                  }}
                                />
                              </th>
                              <th className="p-4 executive-label">Jugador</th>
                              <th className="p-4 executive-label">Costo Real ($C)</th>
                              <th className="p-4 executive-label">Valor Mercado ($V)</th>
                              <th className="p-4 executive-label">Toxicidad (τ)</th>
                              <th className="p-4 executive-label">Acción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {players.filter(p => p.identity.name.toLowerCase().includes(financeSearch.toLowerCase())).map((player) => (
                              <tr 
                                key={player.player_id}
                                onClick={() => setSelectedPlayer(player)}
                                className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${selectedPlayer?.player_id === player.player_id ? 'bg-white/5' : ''}`}
                              >
                                <td className="p-4" onClick={e => e.stopPropagation()}>
                                  <input 
                                    type="checkbox" 
                                    className="accent-cyan-400"
                                    checked={selectedFinanceIds.includes(player.player_id)}
                                    onChange={() => {
                                      if (selectedFinanceIds.includes(player.player_id)) {
                                        setSelectedFinanceIds(selectedFinanceIds.filter(id => id !== player.player_id));
                                      } else {
                                        setSelectedFinanceIds([...selectedFinanceIds, player.player_id]);
                                      }
                                    }}
                                  />
                                </td>
                                <td className="p-4">
                                  <p className="text-sm font-bold uppercase">{player.identity.name}</p>
                                  <p className="text-[10px] text-white/30 uppercase">{player.identity.position}</p>
                                </td>
                                <td className="p-4 font-mono text-sm">${(player.financials.real_cost_accumulated / 1000000).toFixed(1)}M</td>
                                <td className="p-4 font-mono text-sm">
                                  <div className="flex items-center gap-2">
                                    ${(player.financials.base_market_value / 1000000).toFixed(1)}M
                                    {player.ai_analysis.fair_value_prediction > player.financials.base_market_value ? (
                                      <ArrowUpRight size={12} className="text-safe-green" />
                                    ) : (
                                      <ArrowDownRight size={12} className="text-toxic-red" />
                                    )}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <ToxicSemaphore value={player.financials.toxic_index_tau} />
                                </td>
                                <td className="p-4">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!selectedFinanceIds.includes(player.player_id)) {
                                        setSelectedFinanceIds([...selectedFinanceIds, player.player_id]);
                                      }
                                      addToast(`Añadido a simulación: ${player.identity.name}`, 'info');
                                    }}
                                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white hover:text-black transition-all"
                                  >
                                    Gestionar
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass-card p-6">
                        <span className="executive-label">Cuadrante de Eficiencia</span>
                        <div className="h-48 mt-4 border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-10">
                            <div className="border-r border-b border-white" />
                            <div className="border-b border-white" />
                            <div className="border-r border-white" />
                            <div />
                          </div>
                          <div className="absolute top-2 left-2 text-[8px] uppercase opacity-30">Joyas</div>
                          <div className="absolute bottom-2 right-2 text-[8px] uppercase opacity-30">Clavos</div>
                          {players.map((p, i) => (
                            <motion.div 
                              key={p.player_id}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className={`w-3 h-3 rounded-full absolute shadow-lg ${p.financials.toxic_index_tau > 2 ? 'bg-toxic-red' : 'bg-safe-green'}`}
                              style={{ 
                                left: `${(p.financials.monthly_salary / 50000) * 100}%`,
                                bottom: `${(p.performance.minutes_played_pct) * 100}%`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="glass-card p-6">
                        <span className="executive-label">Proyección de Flujo de Caja</span>
                        <div className="mt-4 space-y-4">
                          <div className="flex justify-between items-end">
                            <span className="text-xs opacity-40">Optimista</span>
                            <span className="text-sm font-bold">$4.2M</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-safe-green w-[85%]" />
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-xs opacity-40">Modo Crisis</span>
                            <span className="text-sm font-bold text-toxic-red">$1.8M</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-toxic-red w-[35%]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <WarRoomSimulation 
                      onAction={addToast} 
                      isSimulating={isSimulating}
                      players={players}
                      selectedIds={selectedFinanceIds}
                      onSimulate={() => {
                        setIsSimulating(true);
                        setTimeout(() => {
                          setIsSimulating(false);
                          addToast('Decisión ejecutada. El impacto financiero ha sido proyectado en el sistema.', 'success');
                        }, 3000);
                      }}
                    />
                  </div>

                  <div className="lg:col-span-1">
                    {selectedPlayer ? (
                      <PlayerSmartCard 
                        player={selectedPlayer} 
                        onEdit={(p) => {
                          setEditingPlayer(p);
                          setIsManagementOpen(true);
                        }}
                        onAction={addToast}
                      />
                    ) : (
                      <div className="glass-card p-12 flex flex-col items-center justify-center text-center gap-4 h-full">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                          <User size={32} className="text-white/20" />
                        </div>
                        <p className="text-xs text-white/30 uppercase font-bold tracking-widest">Seleccione un jugador para ver la Ficha Inteligente</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : activeModule === 'A' ? (
              <motion.div 
                key="legal-module"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full flex flex-col"
              >
                <ModuleHeader 
                  title="Secretaría Técnica" 
                  subtitle="Digitalización Inteligente de Base Legal" 
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div 
                      onClick={() => {
                        setUploadStatus('uploading');
                        setTimeout(() => setUploadStatus('success'), 2000);
                      }}
                      className="glass-card p-12 flex flex-col items-center justify-center text-center gap-6 border-2 border-dashed border-white/10 hover:border-white/30 transition-all cursor-pointer group relative overflow-hidden h-64"
                    >
                      {uploadStatus === 'uploading' && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                          <Loader2 size={40} className="animate-spin text-white mb-4" />
                          <p className="text-sm font-bold uppercase tracking-widest">Extrayendo Cláusulas...</p>
                        </div>
                      )}
                      
                      {uploadStatus === 'success' ? (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 rounded-full bg-safe-green/20 flex items-center justify-center">
                            <CheckCircle2 size={40} className="text-safe-green" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold uppercase tracking-tight">Contrato Procesado</h3>
                            <p className="text-sm text-white/40 mt-2">Datos sincronizados con el Módulo D</p>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setUploadStatus('idle'); }}
                            className="text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100"
                          >
                            Subir otro
                          </button>
                        </motion.div>
                      ) : (
                        <>
                          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload size={40} className="text-white/40" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold uppercase tracking-tight">Ingesta de Contratos (PDF)</h3>
                            <p className="text-sm text-white/40 mt-2">Arrastre archivos aquí para extracción OCR avanzada vía AWS Textract</p>
                          </div>
                          <button className="px-6 py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest">Seleccionar Archivos</button>
                        </>
                      )}
                    </div>

                    <div className="glass-card p-8 space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <span className="executive-label">Gestión de Activos</span>
                          <h3 className="text-xl font-bold uppercase mt-1">Base de Datos Legal</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                            <input 
                              type="text" 
                              placeholder="Buscar jugador..."
                              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-[10px] uppercase font-bold tracking-widest focus:border-cyan-400 outline-none transition-all w-48"
                            />
                          </div>
                          <button 
                            onClick={() => setIsManualEntryOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                          >
                            <UserPlus size={14} /> Nuevo
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="p-4 executive-label">Jugador</th>
                              <th className="p-4 executive-label">Vencimiento</th>
                              <th className="p-4 executive-label">Estado</th>
                              <th className="p-4 executive-label text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {players.map((p) => (
                              <tr key={p.player_id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                      <User size={14} className="opacity-40" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold uppercase">{p.identity.name}</p>
                                      <p className="text-[10px] opacity-40 uppercase">{p.identity.position}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <Clock size={12} className="opacity-30" />
                                    <span className="text-xs font-mono opacity-60">{p.financials.contract_expiry}</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase ${p.financials.toxic_index_tau > globalConfig.toxicThreshold ? 'bg-toxic-red/20 text-toxic-red' : 'bg-safe-green/20 text-safe-green'}`}>
                                    {p.financials.toxic_index_tau > globalConfig.toxicThreshold ? 'Crítico' : 'Estable'}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex justify-end gap-2 transition-opacity">
                                    <button 
                                      onClick={() => {
                                        setSelectedDetailPlayer(p);
                                        setIsDetailOpen(true);
                                      }}
                                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                                      title="Ver Detalle"
                                    >
                                      <Eye size={14} />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setEditingPlayer(p);
                                        setIsManagementOpen(true);
                                      }}
                                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                                      title="Editar"
                                    >
                                      <Settings size={14} />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setPlayers(prev => prev.filter(player => player.player_id !== p.player_id));
                                        addToast(`Activo ${p.identity.name} eliminado del sistema`, 'error');
                                      }}
                                      className="p-2 hover:bg-toxic-red/20 text-toxic-red/40 hover:text-toxic-red rounded-lg transition-colors"
                                      title="Eliminar"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="glass-card p-6">
                      <span className="executive-label">Vencimientos Próximos</span>
                      <div className="mt-4 space-y-4">
                        {[
                          { name: 'Richard Ortiz', date: '30/06/2024', status: 'toxic-red' },
                          { name: 'Gastón Olveira', date: '31/12/2024', status: 'warning-yellow' },
                          { name: 'Iván Torres', date: '30/06/2025', status: 'safe-green' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                              <FileText size={16} className="text-white/30" />
                              <div>
                                <p className="text-sm font-bold uppercase">{item.name}</p>
                                <p className="text-[10px] opacity-40 uppercase">Vence: {item.date}</p>
                              </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full bg-${item.status.replace('toxic-', 'toxic-red').replace('warning-', 'warning-yellow').replace('safe-', 'safe-green')}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="glass-card p-6">
                      <span className="executive-label">Cupos de Extranjeros</span>
                      <div className="mt-4 flex items-end gap-2">
                        <span className="text-4xl font-black italic">4</span>
                        <span className="text-xl font-bold opacity-20 italic">/ 5</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest ml-auto text-safe-green">Disponible</span>
                      </div>
                      <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-[80%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : activeModule === 'B' ? (
              <motion.div 
                key="scouting-module"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <ModuleHeader 
                    title="Scouting & Rendimiento" 
                    subtitle="Selección Científica de Talento y Shadow Team" 
                  />
                  <button 
                    onClick={() => addToast('Generando reporte de scouting PDF...', 'info')}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2"
                  >
                    <Download size={14} /> Descargar Reporte
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass-card p-8 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="executive-label">The Shadow Team (Mapeo de Reemplazos)</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] opacity-40 uppercase font-bold">Estilo:</span>
                          <select 
                            value={tacticalStyle}
                            onChange={(e) => {
                              const style = e.target.value;
                              setTacticalStyle(style);
                              const isCustom = customFormations.some(f => f.name === style);
                              if (!isCustom) {
                                if (style === 'Contraataque' || style === 'Equilibrado') setLineupFormation('4-4-2');
                                else setLineupFormation('4-3-3');
                              }
                              addToast(`Estilo ${style} aplicado`, 'info');
                            }}
                            className="bg-transparent border-none text-[10px] font-bold uppercase text-cyan-400 outline-none cursor-pointer"
                          >
                            <option value="Equilibrado">Equilibrado</option>
                            <option value="Gegenpressing">Gegenpressing</option>
                            <option value="Tiki-Taka">Tiki-Taka</option>
                            <option value="Contraataque">Contraataque</option>
                            {customFormations.map(f => (
                              <option key={f.name} value={f.name}>{f.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setIsFormationBuilderOpen(true)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-400/10 text-cyan-400 text-[10px] font-bold uppercase border border-cyan-400/20 hover:bg-cyan-400 hover:text-black transition-all"
                        >
                          Cargar Ideal
                        </button>
                        <button 
                          onClick={() => setLineupFormation('4-3-3')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${lineupFormation === '4-3-3' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10'}`}
                        >
                          4-3-3
                        </button>
                        <button 
                          onClick={() => setLineupFormation('4-4-2')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${lineupFormation === '4-4-2' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10'}`}
                        >
                          4-4-2
                        </button>
                      </div>
                    </div>

                    <div className="relative aspect-[16/10] w-full max-w-4xl mx-auto bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                      {/* Soccer Field Lines */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute inset-0 border-2 border-white m-4" />
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-full" />
                      </div>

                      {/* Player Positions */}
                      {(customFormations.find(f => f.name === tacticalStyle)?.positions || (lineupFormation === '4-3-3' ? [
                        { pos: 'ARQ', top: '85%', left: '50%' },
                        { pos: 'LI', top: '65%', left: '15%' },
                        { pos: 'DFC', top: '70%', left: '35%' },
                        { pos: 'DFC', top: '70%', left: '65%' },
                        { pos: 'LD', top: '65%', left: '85%' },
                        { pos: 'MC', top: '45%', left: '30%' },
                        { pos: 'MCD', top: '50%', left: '50%' },
                        { pos: 'MC', top: '45%', left: '70%' },
                        { pos: 'EI', top: '25%', left: '20%' },
                        { pos: 'ED', top: '25%', left: '80%' },
                        { pos: 'DC', top: '15%', left: '50%' },
                      ] : [
                        { pos: 'ARQ', top: '85%', left: '50%' },
                        { pos: 'LI', top: '65%', left: '15%' },
                        { pos: 'DFC', top: '70%', left: '35%' },
                        { pos: 'DFC', top: '70%', left: '65%' },
                        { pos: 'LD', top: '65%', left: '85%' },
                        { pos: 'MI', top: '40%', left: '15%' },
                        { pos: 'MC', top: '45%', left: '40%' },
                        { pos: 'MC', top: '45%', left: '60%' },
                        { pos: 'MD', top: '40%', left: '85%' },
                        { pos: 'DC', top: '15%', left: '35%' },
                        { pos: 'DC', top: '15%', left: '65%' },
                      ])).map((p, i) => (
                        <motion.div 
                          key={`${tacticalStyle}-${i}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => {
                            const uniqueKey = `${p.pos}-${i}`;
                            setSelectedShadowPos(uniqueKey);
                            addToast(`Buscando reemplazos para posición: ${p.pos}`, 'info');
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10 ${selectedShadowPos === `${p.pos}-${i}` ? 'scale-125' : ''}`}
                          style={{ top: p.top, left: p.left }}
                        >
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex flex-col items-center justify-center shadow-xl border-2 transition-all ${selectedShadowPos === `${p.pos}-${i}` ? 'bg-cyan-400 border-white text-black' : 'bg-supreme-black border-white text-white'}`}>
                            <span className="text-[8px] md:text-[10px] font-black leading-none">{assignedPlayers[`${p.pos}-${i}`] ? assignedPlayers[`${p.pos}-${i}`].split(' ').map(n => n[0]).join('') : p.pos}</span>
                            {assignedPlayers[`${p.pos}-${i}`] && <span className="text-[5px] md:text-[6px] font-bold opacity-60 mt-0.5">{p.pos}</span>}
                          </div>
                          {assignedPlayers[`${p.pos}-${i}`] && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1.5 rounded-lg text-[7px] font-black uppercase whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.4)] z-30 flex items-center gap-2 group/label border border-black/10">
                              <span>{assignedPlayers[`${p.pos}-${i}`]}</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const uniqueKey = `${p.pos}-${i}`;
                                  const newAssigned = { ...assignedPlayers };
                                  delete newAssigned[uniqueKey];
                                  setAssignedPlayers(newAssigned);
                                  addToast(`Posición ${p.pos} liberada`, 'info');
                                }}
                                className="w-5 h-5 flex items-center justify-center bg-toxic-red text-white rounded-full hover:scale-110 transition-transform shadow-md"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          )}
                          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white text-black px-2 py-1 rounded text-[8px] font-bold uppercase z-20">
                            {assignedPlayers[`${p.pos}-${i}`] ? 'Cambiar Jugador' : 'Asignar Activo'}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {selectedShadowPos && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-white/5 border border-white/10 rounded-2xl"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="executive-label">Reemplazos Sugeridos para {selectedShadowPos.split('-')[0]}</span>
                          <button onClick={() => setSelectedShadowPos(null)} className="text-[8px] uppercase font-bold opacity-40 hover:opacity-100">Cerrar</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { name: 'Facundo Farías', match: '96%', club: 'Inter Miami', age: 21 },
                            { name: 'Valentín Carboni', match: '92%', club: 'Monza', age: 18 },
                            { name: 'Matías Soulé', match: '89%', club: 'Frosinone', age: 20 },
                          ].map(candidate => (
                            <div 
                              key={candidate.name} 
                              onClick={() => {
                                setAssignedPlayers(prev => ({ ...prev, [selectedShadowPos]: candidate.name }));
                                addToast(`${candidate.name} asignado a ${selectedShadowPos.split('-')[0]}`, 'success');
                                setSelectedShadowPos(null);
                              }}
                              className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-cyan-400/50 transition-all cursor-pointer group"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                  <User size={14} className="opacity-40" />
                                </div>
                                <span className="text-[10px] font-mono text-safe-green">{candidate.match} Match</span>
                              </div>
                              <p className="text-xs font-bold uppercase">{candidate.name}</p>
                              <p className="text-[8px] opacity-40 uppercase mt-1">{candidate.club} • {candidate.age} años</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="glass-card p-6">
                      <span className="executive-label">Algoritmo de Adaptabilidad "Carlos"</span>
                      <div className="mt-6 flex flex-col items-center gap-4">
                        <div className="relative w-32 h-32">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="50" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                            <motion.circle 
                              cx="64" cy="64" r="50" fill="transparent" stroke="#FFFFFF" strokeWidth="4" 
                              strokeDasharray="314"
                              initial={{ strokeDashoffset: 314 }}
                              animate={{ strokeDashoffset: 314 * 0.15 }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-black italic">85</span>
                          </div>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 text-center">Basado en presión y movilidad internacional</p>
                      </div>
                    </div>

                    <div className="glass-card p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="executive-label">Gemelos Estadísticos</span>
                        <div className="relative">
                          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-30" />
                          <input 
                            type="text" 
                            placeholder="Buscar..."
                            value={twinSearch}
                            onChange={(e) => setTwinSearch(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-[8px] uppercase font-bold tracking-widest focus:border-cyan-400 outline-none transition-all w-32"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {[
                          { name: 'Thiago Almada', match: '94%', club: 'Atlanta Utd', pos: 'MCO' },
                          { name: 'Alan Varela', match: '89%', club: 'FC Porto', pos: 'MCD' },
                          { name: 'Federico Redondo', match: '82%', club: 'Argentinos Jrs', pos: 'MC' },
                          { name: 'Claudio Echeverri', match: '91%', club: 'River Plate', pos: 'MCO' },
                          { name: 'Valentín Barco', match: '87%', club: 'Boca Juniors', pos: 'LI' },
                          { name: 'Gianluca Prestianni', match: '85%', club: 'Vélez Sarsfield', pos: 'ED' },
                          { name: 'Lucas Beltrán', match: '88%', club: 'Fiorentina', pos: 'DC' },
                        ].filter(t => t.name.toLowerCase().includes(twinSearch.toLowerCase()) || t.pos.toLowerCase().includes(twinSearch.toLowerCase()))
                        .map((twin, i) => (
                          <motion.div 
                            key={twin.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelectedTwin(twin)}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-400 transition-colors">
                                <span className="text-[8px] font-black">{twin.pos}</span>
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase">{twin.name}</p>
                                <p className="text-[8px] opacity-40 uppercase">{twin.club}</p>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-4">
                              <div>
                                <span className="text-[10px] font-mono font-bold text-safe-green">{twin.match}</span>
                                <p className="text-[6px] opacity-20 uppercase">Similitud</p>
                              </div>
                              <div className="flex gap-1">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTwin(twin);
                                    setIsTwinModalOpen(true);
                                  }}
                                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/20 hover:text-white"
                                >
                                  <Settings size={12} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToast(`Candidato ${twin.name} descartado del mapeo`, 'error');
                                  }}
                                  className="p-1.5 hover:bg-toxic-red/20 rounded-lg transition-colors text-toxic-red/20 hover:text-toxic-red"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <button 
                        onClick={() => addToast('Escaneando base de datos global...', 'info')}
                        className="w-full py-3 border border-white/10 rounded-xl text-[8px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all mt-2"
                      >
                        Actualizar Mapeo Global
                      </button>
                    </div>

                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="executive-label">Histórico de Ejecución</span>
                        <Calendar size={14} className="opacity-30" />
                      </div>
                      <div className="space-y-3">
                        {matchHistory.map((match) => (
                          <div key={match.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                            <div className="flex items-center gap-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${match.status === 'past' ? 'bg-white/20' : 'bg-cyan-400 animate-pulse'}`} />
                              <div>
                                <p className="text-[10px] font-bold uppercase">{match.opponent}</p>
                                <p className="text-[8px] opacity-40 uppercase">{match.date} • {match.type}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] font-mono font-bold ${match.status === 'past' ? 'text-white' : 'text-cyan-400'}`}>
                                {match.result}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setIsCalendarOpen(true)}
                        className="w-full mt-4 py-2 text-[8px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all"
                      >
                        Ver Calendario Completo
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : activeModule === 'C' ? (
              <motion.div 
                key="health-module"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full flex flex-col"
              >
                <ModuleHeader 
                  title="Salud & GPS" 
                  subtitle="Mitigación de Lesiones y Control de Fatiga (ACWR)" 
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                      <span className="executive-label">Carga Aguda vs. Crónica (ACWR)</span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-white" />
                          <span className="text-[8px] uppercase font-bold opacity-40">Carga Real</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-toxic-red" />
                          <span className="text-[8px] uppercase font-bold text-toxic-red">Zona de Riesgo</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { day: 'Lun', acute: 1.2, chronic: 1.1 },
                          { day: 'Mar', acute: 1.4, chronic: 1.15 },
                          { day: 'Mie', acute: 1.1, chronic: 1.2 },
                          { day: 'Jue', acute: 1.8, chronic: 1.25 },
                          { day: 'Vie', acute: 1.5, chronic: 1.3 },
                          { day: 'Sab', acute: 1.3, chronic: 1.32 },
                          { day: 'Dom', acute: 1.2, chronic: 1.35 },
                        ]}>
                          <defs>
                            <linearGradient id="colorAcute" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="acute" stroke="#FFFFFF" strokeWidth={2} fillOpacity={1} fill="url(#colorAcute)" />
                          <Area type="monotone" dataKey="chronic" stroke="rgba(255,255,255,0.2)" strokeWidth={1} fill="transparent" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-8 p-4 bg-toxic-red/10 border border-toxic-red/20 rounded-xl flex items-center gap-4">
                      <AlertTriangle size={20} className="text-toxic-red" />
                      <p className="text-xs font-bold uppercase tracking-tight text-toxic-red">Alerta: 3 jugadores han superado el ratio de 1.5 (Zona de Desgarro)</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="glass-card p-6">
                      <span className="executive-label">Diario de Wellness</span>
                      <div className="mt-4 space-y-4">
                        {[
                          { name: 'Sueño', value: 8, icon: Clock },
                          { name: 'Estrés', value: 3, icon: Zap },
                          { name: 'Dolor', value: 2, icon: Heart },
                        ].map((item, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <item.icon size={12} className="opacity-40" />
                                <span className="text-[10px] font-bold uppercase opacity-60">{item.name}</span>
                              </div>
                              <span className="text-[10px] font-mono font-bold">{item.value}/10</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-white transition-all" style={{ width: `${item.value * 10}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <span className="executive-label">Predicción de Lesiones (ML)</span>
                      <div className="mt-4 space-y-3">
                        {players.slice(0, 3).map((p, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase">{p.identity.name}</span>
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${p.performance.injury_risk_score > 0.3 ? 'bg-toxic-red' : 'bg-safe-green'}`} />
                              <span className="text-[10px] font-mono">{(p.performance.injury_risk_score * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : activeModule === 'E' ? (
              <motion.div 
                key="comm-module"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full flex flex-col"
              >
                <ModuleHeader 
                  title="Comunicación" 
                  subtitle="Social Listening y Política Deportiva" 
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass-card p-8">
                    <span className="executive-label">Sentiment Analysis (X/Twitter & Instagram)</span>
                    <div className="h-64 w-full mt-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Lun', pos: 400, neg: 240 },
                          { name: 'Mar', pos: 300, neg: 139 },
                          { name: 'Mie', pos: 200, neg: 980 },
                          { name: 'Jue', pos: 278, neg: 390 },
                          { name: 'Vie', pos: 189, neg: 480 },
                          { name: 'Sab', pos: 239, neg: 380 },
                          { name: 'Dom', pos: 349, neg: 430 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '12px' }}
                          />
                          <Bar dataKey="pos" fill="#10B981" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="neg" fill="#EF4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="glass-card p-6">
                      <span className="executive-label">Trending Topics</span>
                      <div className="mt-4 space-y-4">
                        {[
                          { tag: '#FueraTodos', count: '12.4K', trend: 'up' },
                          { tag: '#OlimpiaCampeon', count: '8.1K', trend: 'down' },
                          { tag: '#FichajesYa', count: '5.2K', trend: 'up' },
                        ].map((t, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-xs font-bold">{t.tag}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] opacity-40">{t.count}</span>
                              {t.trend === 'up' ? <ArrowUpRight size={12} className="text-toxic-red" /> : <ArrowDownRight size={12} className="text-safe-green" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : activeModule === 'F' ? (
              <motion.div 
                key="tactics-module"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full flex flex-col"
              >
                <ModuleHeader 
                  title="Táctica Dinámica" 
                  subtitle="Análisis Predictivo de Juego y Estrategia" 
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass-card p-8 bg-[url('https://picsum.photos/seed/tactics/1200/800?blur=10')] bg-cover bg-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/80" />
                    <div className="relative z-10">
                      <span className="executive-label">Live Match Analysis: Olimpia vs. Cerro Porteño</span>
                      <div className="mt-8 flex items-center justify-center gap-12">
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-2 border-2 border-white">
                            <span className="text-2xl font-black italic">OLI</span>
                          </div>
                          <span className="text-4xl font-black italic">2</span>
                        </div>
                        <div className="text-4xl font-black italic opacity-20">-</div>
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-2 border-2 border-white/20">
                            <span className="text-2xl font-black italic">CER</span>
                          </div>
                          <span className="text-4xl font-black italic">1</span>
                        </div>
                      </div>
                      
                      <div className="mt-12 space-y-4">
                        <span className="executive-label">Probabilidad de Victoria (Live)</span>
                        <div className="h-4 bg-white/5 rounded-full flex overflow-hidden">
                          <div className="h-full bg-white w-[65%]" />
                          <div className="h-full bg-white/20 w-[10%]" />
                          <div className="h-full bg-white/10 w-[25%]" />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span>Olimpia (65%)</span>
                          <span>Empate (10%)</span>
                          <span>Cerro (25%)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="executive-label">Sugerencia Táctica (IA)</span>
                        <Zap size={14} className="text-cyan-400 animate-pulse" />
                      </div>
                      <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-sm italic leading-relaxed">"El rival está dejando espacios en el carril interior izquierdo. Activar presión alta con el ST para forzar error en salida."</p>
                      </div>
                      <button className="w-full mt-4 py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest">Enviar a Tablet DT</button>
                    </div>

                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="executive-label">Histórico de Táctica</span>
                        <Clock size={14} className="opacity-30" />
                      </div>
                      <div className="space-y-3">
                        {matchHistory.filter(m => m.status === 'past').map((match) => (
                          <div key={match.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <div>
                              <p className="text-[10px] font-bold uppercase">{match.opponent}</p>
                              <p className="text-[8px] opacity-40 uppercase">{match.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-mono font-black">{match.result}</p>
                              <p className="text-[6px] opacity-20 uppercase">Finalizado</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
              </motion.div>
            ) : activeModule === 'G' ? (
              <motion.div 
                key="care-module"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full flex flex-col"
              >
                <ModuleHeader 
                  title="Player Care" 
                  subtitle="Bienestar Humano y Adaptabilidad" 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {players.map((p, i) => (
                    <div key={i} className="glass-card p-6 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold uppercase">{p.identity.name}</h3>
                        <div className="px-2 py-1 bg-white/5 rounded text-[8px] font-bold uppercase tracking-widest">Nivel 4</div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] opacity-40 uppercase">Adaptación Familiar</span>
                          <span className="text-[10px] font-bold">90%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-safe-green w-[90%]" />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] opacity-40 uppercase">Integración Vestuario</span>
                          <span className="text-[10px] font-bold">75%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-warning-yellow w-[75%]" />
                        </div>
                      </div>
                      
                      <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/5">
                        <span className="text-[8px] uppercase font-bold opacity-30 block mb-1">Última Nota</span>
                        <p className="text-[10px] italic">"Buscando colegio para sus hijos. Requiere apoyo logístico."</p>
                      </div>
                      <button 
                        onClick={() => addToast(`Asignando apoyo logístico a ${p.identity.name}`)}
                        className="w-full mt-2 py-2 border border-white/10 rounded-lg text-[8px] uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-all"
                      >
                        Asignar Apoyo
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : activeModule === 'H' ? (
              <motion.div 
                key="management-module"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full flex flex-col"
              >
                <ModuleHeader 
                  title="Centro de Datos & Mantenedores" 
                  subtitle="Núcleo de Inteligencia y Gestión de Activos" 
                />
                
                {/* Sub-Tabs Navigation */}
                <div className="flex gap-8 border-b border-white/10 mb-8">
                  {[
                    { id: 'DB', label: 'Base de Datos Maestra', icon: Database },
                    { id: 'INGEST', label: 'Ingesta de Información', icon: UploadCloud },
                    { id: 'CONFIG', label: 'Configuración de Sistema', icon: Settings },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setMantenedorTab(tab.id as any)}
                      className={`pb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                        mantenedorTab === tab.id ? 'text-cyan-400' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                      {mantenedorTab === tab.id && (
                        <motion.div layoutId="mantenedor-tab-pill" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {mantenedorTab === 'DB' ? (
                    <div className="space-y-8">
                      {/* Data Health Dashboard */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                          { label: 'Integridad de Datos', value: '98.2%', color: 'text-safe-green' },
                          { label: 'Activos Registrados', value: players.length, color: 'text-white' },
                          { label: 'Última Sincronización', value: 'Hace 2m', color: 'text-cyan-400' },
                          { label: 'Alertas de Datos', value: '0', color: 'text-white/40' },
                        ].map((stat, i) => (
                          <div key={i} className="glass-card p-4 border-white/5">
                            <span className="text-[8px] uppercase font-bold opacity-40 block mb-1">{stat.label}</span>
                            <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="glass-card p-8">
                        <div className="flex items-center justify-between mb-8">
                          <span className="executive-label">Explorador de Activos</span>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => addToast('Exportando base de datos...', 'info')}
                              className="px-4 py-2 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-2"
                            >
                              <FileText size={14} /> Exportar
                            </button>
                            <button 
                              onClick={() => setIsManualEntryOpen(true)}
                              className="px-4 py-2 bg-cyan-400 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                            >
                              <UserPlus size={14} /> Manual
                            </button>
                            <button 
                              onClick={() => {
                                setMantenedorTab('INGEST');
                                addToast('Accediendo a módulo de ingesta', 'info');
                              }}
                              className="px-4 py-2 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all flex items-center gap-2"
                            >
                              <Plus size={14} /> Importar
                            </button>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="p-4 executive-label">ID</th>
                                <th className="p-4 executive-label">Nombre</th>
                                <th className="p-4 executive-label">Posición</th>
                                <th className="p-4 executive-label">Salario ($)</th>
                                <th className="p-4 executive-label">Valor ($)</th>
                                <th className="p-4 executive-label">Estado</th>
                                <th className="p-4 executive-label">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {players.map((p) => (
                                <tr key={p.player_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                  <td className="p-4 font-mono text-xs opacity-40">{p.player_id}</td>
                                  <td className="p-4 font-bold uppercase text-sm">{p.identity.name}</td>
                                  <td className="p-4 text-xs opacity-60">{p.identity.position}</td>
                                  <td className="p-4 font-mono text-sm">${p.financials.monthly_salary?.toLocaleString() || '0'}</td>
                                  <td className="p-4 font-mono text-sm">${p.financials.base_market_value?.toLocaleString() || '0'}</td>
                                  <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase ${p.financials.toxic_index_tau > globalConfig.toxicThreshold ? 'bg-toxic-red/20 text-toxic-red' : 'bg-safe-green/20 text-safe-green'}`}>
                                      {p.financials.toxic_index_tau > globalConfig.toxicThreshold ? 'Crítico' : 'Estable'}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => {
                                          setEditingPlayer(p);
                                          setIsManagementOpen(true);
                                          addToast(`Editando a ${p.identity.name}`, 'info');
                                        }}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                      >
                                        <Settings size={14} />
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setPlayers(prev => prev.filter(player => player.player_id !== p.player_id));
                                          addToast(`Eliminando ${p.identity.name}...`, 'error');
                                        }}
                                        className="p-2 hover:bg-toxic-red/20 text-toxic-red rounded-lg transition-colors"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : mantenedorTab === 'INGEST' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="glass-card p-8 space-y-8">
                        <div>
                          <span className="executive-label">Terminal de Ingesta</span>
                          <h3 className="text-xl font-bold uppercase mt-2">Carga de Información Crítica</h3>
                          <p className="text-xs text-white/40 mt-2">Arrastre archivos CSV, JSON o PDF para alimentar el núcleo de datos.</p>
                        </div>

                        <div 
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.onchange = () => addToast('Archivo detectado. Iniciando procesamiento OCR/IA...', 'info');
                            input.click();
                          }}
                          className="h-64 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-white/5 hover:border-cyan-400/50 transition-all cursor-pointer group"
                        >
                          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <UploadCloud size={32} className="text-white/20 group-hover:text-cyan-400" />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-bold uppercase tracking-widest">Click o Arrastrar para Cargar</p>
                            <p className="text-[10px] opacity-30 mt-1">Soporta: Plantillas de Jugadores, Contratos, Reportes de Scouting</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <span className="executive-label">Fuentes de Datos Activas</span>
                          {[
                            { name: 'API Transfermarkt', status: 'Conectado', last: 'Hace 5m' },
                            { name: 'Sistema Contable ERP', status: 'Sincronizando', last: 'En curso' },
                            { name: 'GPS Catapult Cloud', status: 'Conectado', last: 'Hace 1m' },
                          ].map((source, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${source.status === 'Conectado' ? 'bg-safe-green' : 'bg-warning-yellow animate-pulse'}`} />
                                <span className="text-xs font-bold uppercase">{source.name}</span>
                              </div>
                              <span className="text-[10px] opacity-40 font-mono">{source.last}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-8 border-t border-white/10">
                          <span className="executive-label">Método Alternativo</span>
                          <button 
                            onClick={() => setIsManualEntryOpen(true)}
                            className="w-full mt-4 p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-cyan-400/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <UserPlus size={24} className="text-cyan-400" />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-bold uppercase">Ingreso Manual de Datos</p>
                                <p className="text-[10px] opacity-40">Carga individual de activos sin documentos</p>
                              </div>
                            </div>
                            <ChevronRight size={20} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </button>
                        </div>
                      </div>

                      <div className="glass-card p-8 space-y-8">
                        <div>
                          <span className="executive-label">Cola de Procesamiento</span>
                          <h3 className="text-xl font-bold uppercase mt-2">Estado de Carga</h3>
                        </div>

                        <div className="space-y-6">
                          {[
                            { file: 'contratos_2026_v2.pdf', progress: 100, status: 'Completado' },
                            { file: 'scouting_brasil_u20.json', progress: 45, status: 'Analizando con IA' },
                            { file: 'finanzas_q1_report.csv', progress: 12, status: 'Validando' },
                          ].map((job, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold truncate max-w-[200px]">{job.file}</span>
                                <span className="text-[10px] uppercase font-bold opacity-40">{job.status}</span>
                              </div>
                              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${job.progress}%` }}
                                  className={`h-full ${job.progress === 100 ? 'bg-safe-green' : 'bg-cyan-400'}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-6 bg-cyan-400/10 border border-cyan-400/20 rounded-2xl">
                          <div className="flex gap-3">
                            <Info size={18} className="text-cyan-400 shrink-0" />
                            <p className="text-xs leading-relaxed text-cyan-400/80">
                              <strong>Sugerencia del Piloto:</strong> Hemos detectado inconsistencias en 3 contratos cargados recientemente. Se recomienda revisión manual en el Módulo A.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="glass-card p-8 flex flex-col gap-4">
                        <span className="executive-label">Configuración Global</span>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs opacity-60">Umbral de Toxicidad (τ)</span>
                            <input 
                              type="number" 
                              step="0.1"
                              value={globalConfig.toxicThreshold}
                              onChange={(e) => setGlobalConfig(prev => ({ ...prev, toxicThreshold: Number(e.target.value) }))}
                              className="w-20 bg-black border border-white/10 rounded px-2 py-1 text-xs text-right"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs opacity-60">Moneda Base</span>
                            <select 
                              value={globalConfig.baseCurrency}
                              onChange={(e) => setGlobalConfig(prev => ({ ...prev, baseCurrency: e.target.value }))}
                              className="bg-black border border-white/10 rounded px-2 py-1 text-xs"
                            >
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="PYG">PYG</option>
                            </select>
                          </div>
                          <button 
                            onClick={() => addToast('Configuración global actualizada')}
                            className="w-full mt-4 py-3 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                          >
                            Guardar Cambios
                          </button>
                        </div>
                      </div>

                      <div className="glass-card p-8 flex flex-col gap-4">
                        <span className="executive-label">Acciones Rápidas</span>
                        <div className="space-y-4">
                          <button 
                            onClick={() => setIsManualEntryOpen(true)}
                            className="w-full p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-2xl flex items-center gap-3 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all group"
                          >
                            <UserPlus size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Ingreso Manual de Activo</span>
                          </button>
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                            <span className="text-[8px] uppercase font-bold opacity-40">Seguridad</span>
                            <div className="flex items-center justify-between">
                              <span className="text-xs opacity-60">2FA</span>
                              <div className="w-8 h-4 bg-safe-green/20 rounded-full p-1 flex items-center justify-end">
                                <div className="w-2 h-2 bg-safe-green rounded-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="fallback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <p className="text-white/20 uppercase font-black tracking-[1em]">Módulo No Encontrado</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <TwinEditModal 
        isOpen={isTwinModalOpen} 
        twin={editingTwin} 
        onClose={() => setIsTwinModalOpen(false)} 
        onSave={(data) => {
          addToast(`Perfil de ${data.name} actualizado correctamente`, 'success');
          setIsTwinModalOpen(false);
        }}
      />

      <FormationBuilderModal 
        isOpen={isFormationBuilderOpen} 
        onClose={() => setIsFormationBuilderOpen(false)} 
        onSave={(name, positions) => {
          setCustomFormations(prev => [...prev, { name, positions }]);
          setTacticalStyle(name);
          addToast(`Formación "${name}" guardada y aplicada`, 'success');
        }}
      />

      <CalendarModal 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
        history={matchHistory} 
      />

      <PlayerDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        player={selectedDetailPlayer} 
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
