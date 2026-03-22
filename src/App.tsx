import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Cpu, Activity, AlertTriangle } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00FF41] font-sans selection:bg-[#00FF41]/30 overflow-hidden relative crt-flicker">
      <div className="noise" />
      <div className="scanline" />
      
      <nav className="relative z-10 flex justify-between items-center px-12 py-8 border-b border-[#00FF41]/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-[#00FF41] flex items-center justify-center">
            <Terminal size={20} className="text-[#00FF41]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight terminal-glow">
              VOID_OS_v4.0.1
            </h1>
            <div className="flex gap-2 text-[8px] font-mono opacity-40">
              <span>STATUS: NOMINAL</span>
              <span className="animate-pulse">|</span>
              <span>UPTIME: 0x4F2A</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-10 text-[10px] uppercase tracking-[0.3em] opacity-40">
          <a href="#" className="hover:opacity-100 transition-opacity">_CORE</a>
          <a href="#" className="hover:opacity-100 transition-opacity">_WAVES</a>
          <a href="#" className="hover:opacity-100 transition-opacity">_LOGS</a>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-1 border border-[#00FF41]/20 text-[10px] font-mono opacity-60">
            <Activity size={12} className="animate-pulse" />
            <span>NET_SYNC: OK</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-12 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-12"
        >
          <div className="space-y-6">
            <div className="inline-block px-2 py-1 border border-[#00FF41]/40 text-[10px] opacity-60">
              CRITICAL_INTERFACE_DETECTED
            </div>
            <h2 className="text-8xl font-bold leading-[0.85] tracking-tighter uppercase terminal-glow">
              FEED_THE<br />VOID
            </h2>
            <p className="text-[#00FF41]/40 text-lg font-medium max-w-md leading-tight">
              CONSUME_DATA_PACKETS. <br />
              MAINTAIN_SIGNAL_INTEGRITY. <br />
              IGNORE_THE_STATIC.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="p-6 border border-[#00FF41]/10 bg-white/5 relative group overflow-hidden">
              <span className="text-[10px] opacity-40 block mb-2">_MEMORY_ALLOCATION</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">88%</span>
              </div>
            </div>
            <div className="p-6 border border-[#00FF41]/10 bg-white/5 relative group overflow-hidden">
              <span className="text-[10px] opacity-40 block mb-2">_CPU_LOAD</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">0x0F</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-16 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-8 border border-[#00FF41]/5 animate-pulse pointer-events-none" />
            <SnakeGame />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <MusicPlayer />
          </motion.div>
        </div>
      </main>

      {/* Terminal Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#00FF41]/5 text-[#00FF41]/40 py-1 font-mono text-[8px] uppercase overflow-hidden z-50 border-t border-[#00FF41]/10">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1,2,3,4,5,6,7,8].map(i => (
            <span key={i} className="mx-6">
              {`>> [${new Date().toISOString()}] KERNEL_PANIC_PREVENTED // DATA_STREAM_STABLE // VOID_CONNECTED // `}
            </span>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
        }
      `}} />
    </div>
  );
}
