import React from 'react';

interface CountdownProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Unit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="countdown-digit relative w-20 h-24 sm:w-28 sm:h-32 md:w-36 md:h-40 flex items-center justify-center overflow-hidden text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-cyan-300 tabular-nums"
      style={{ textShadow: '0 0 20px rgba(6,182,212,0.8), 0 0 40px rgba(6,182,212,0.4)' }}>
      {String(value).padStart(2, '0')}
    </div>
    <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-400 font-mono">
      {label}
    </span>
  </div>
);

export function Countdown({ days, hours, minutes, seconds }: CountdownProps) {

  return (
    <div className="flex items-start gap-4 sm:gap-6 md:gap-10 mb-16">
      <Unit value={days} label="Days" />
      <div className="text-cyan-400 text-4xl sm:text-5xl md:text-6xl font-mono mt-6 sm:mt-8 opacity-60 animate-pulse">:</div>
      <Unit value={hours} label="Hours" />
      <div className="text-cyan-400 text-4xl sm:text-5xl md:text-6xl font-mono mt-6 sm:mt-8 opacity-60 animate-pulse">:</div>
      <Unit value={minutes} label="Minutes" />
      <div className="text-cyan-400 text-4xl sm:text-5xl md:text-6xl font-mono mt-6 sm:mt-8 opacity-60 animate-pulse">:</div>
      <Unit value={seconds} label="Seconds" />
    </div>
  );
}
