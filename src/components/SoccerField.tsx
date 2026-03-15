import React from 'react';
import { Shirt } from 'lucide-react';

interface SoccerFieldProps {
  lineup: string;
  teamName: string;
  isAway?: boolean;
}

const SoccerField: React.FC<SoccerFieldProps> = ({ lineup, teamName, isAway }) => {
  const players = lineup.split('\n').filter(p => p.trim() !== '').map(p => p.trim());
  const starters = players.slice(0, 11);
  const reserves = players.slice(11);

  // Positions for a 4-3-3 formation (normalized 0-100)
  // [x, y] where x is horizontal (0 left, 100 right) and y is vertical (0 top, 100 bottom)
  // For "Home" (isAway=false), goalie is at bottom (y=90)
  // For "Away" (isAway=true), goalie is at top (y=10)
  const positions = [
    [50, 90],  // Goalie
    [85, 70],  // RB
    [65, 75],  // CB1
    [35, 75],  // CB2
    [15, 70],  // LB
    [50, 50],  // CDM
    [75, 45],  // CM1
    [25, 45],  // CM2
    [80, 20],  // RW
    [50, 15],  // ST
    [20, 20],  // LW
  ];

  const getPosition = (index: number) => {
    const pos = positions[index] || [50, 50];
    if (isAway) {
      // Flip vertically for away team if needed, but here we'll just use the same field
      // and maybe just change colors or labels. 
      // Actually, let's just keep the same visual for both to keep it clean.
      return { left: `${pos[0]}%`, top: `${pos[1]}%` };
    }
    return { left: `${pos[0]}%`, top: `${pos[1]}%` };
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative aspect-[2/3] w-full bg-emerald-600 rounded-3xl border-4 border-white/20 overflow-hidden shadow-2xl">
        {/* Field Lines */}
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 border-b-2 border-white/20" />
          <div className="flex-1" />
        </div>
        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white/20 rounded-full" />
        
        {/* Penalty Areas */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 border-2 border-t-0 border-white/20" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-20 border-2 border-b-0 border-white/20" />
        
        {/* Players */}
        {starters.map((player, index) => (
          <div 
            key={index}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group"
            style={getPosition(index)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${isAway ? 'bg-white text-zinc-950' : 'bg-yellow-500 text-zinc-950'}`}>
              <Shirt className="w-5 h-5" />
            </div>
            <span className="bg-zinc-950/80 backdrop-blur-sm text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded text-white whitespace-nowrap border border-white/10">
              {player}
            </span>
          </div>
        ))}
      </div>

      {/* Reserves List */}
      {reserves.length > 0 && (
        <div className="bg-zinc-900/50 rounded-2xl p-4 border border-white/5">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Reservas</h5>
          <div className="grid grid-cols-2 gap-2">
            {reserves.map((player, index) => (
              <div key={index} className="text-xs text-zinc-400 flex items-center gap-2">
                <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                {player}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SoccerField;
