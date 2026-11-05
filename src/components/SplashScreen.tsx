import React, { useEffect, useState } from 'react';
import { Shield, MapPin } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onDismiss, 200);
          return 100;
        }
        return prev + 12;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onDismiss]);

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-50 bg-[#090909] flex flex-col items-center justify-between p-8 select-none cursor-pointer overflow-hidden animate-in fade-in duration-300"
    >
      {/* Background Subtle Night Roadway Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-[#090909]/80 to-[#090909] pointer-events-none" />
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Status Bar Placeholder */}
      <div className="w-full flex justify-between items-center text-[11px] font-mono text-[#A0A0A0] relative z-10 pt-2">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FFD400]" />
          <span>RAKSHA SECURE</span>
        </div>
      </div>

      {/* Center Hero Branding */}
      <div className="flex flex-col items-center text-center relative z-10 my-auto">
        {/* Shield with Pin Logo */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-[#1C1C1C] border-2 border-[#FFD400] flex items-center justify-center shadow-2xl shadow-[#FFD400]/20 transition-transform hover:scale-105 duration-300">
            <div className="relative flex items-center justify-center">
              <Shield className="w-14 h-14 text-[#FFD400]" strokeWidth={2.2} />
              <MapPin className="w-7 h-7 text-[#090909] fill-[#FFD400] absolute top-3" strokeWidth={2.5} />
            </div>
          </div>
          <div className="absolute -inset-2 bg-[#FFD400]/15 rounded-3xl blur-xl -z-10" />
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wider text-white">
          RAKSHA
        </h1>
        <h2 className="text-lg sm:text-xl font-bold tracking-widest text-[#FFD400] mt-1 uppercase">
          CELESTIA
        </h2>

        {/* Brand Tagline */}
        <p className="text-sm text-[#A0A0A0] font-medium mt-4 max-w-xs leading-relaxed">
          Your Safety. Your Awareness. Your Shield.
        </p>
      </div>

      {/* Bottom Loading Bar */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3 relative z-10 pb-4">
        <div className="w-28 h-1 bg-[#1C1C1C] rounded-full overflow-hidden border border-[#2A2A2A]">
          <div
            className="h-full bg-[#FFD400] rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-[#6B7280] tracking-wider uppercase">
          Mysuru Tactical Network • Ready
        </span>
      </div>
    </div>
  );
};
