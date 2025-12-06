import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// --- VIDEO BACKGROUND ---
interface VideoBackgroundProps {
  children: React.ReactNode;
  videoSrc?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  children, 
  videoSrc = "https://assets.mixkit.co/videos/preview/mixkit-abstract-blue-network-connection-lines-2838-large.mp4" 
}) => (
  <div className="relative min-h-screen w-full overflow-hidden bg-nova-secondaryDark">
    {/* Video Layer */}
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-50"
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
    
    {/* Dark Gradient Overlay for Readability */}
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 via-nova-secondaryDark/70 to-nova-secondaryDark z-10 backdrop-blur-[2px]"></div>
    
    {/* Content */}
    <div className="relative z-20 h-full w-full flex flex-col">
      {children}
    </div>
  </div>
);

// --- MASCOT ---
export const NovaMascot: React.FC<{ emotion?: 'happy' | 'neutral' | 'shocked' | 'talking', size?: 'sm' | 'md' | 'lg' }> = ({ emotion = 'neutral', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  // Blue & Black "Cyber Fox" construction
  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      <motion.svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-xl"
        animate={emotion === 'talking' ? { y: [0, -2, 0] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        {/* Ears - Dark Navy/Black */}
        <path d="M20 20 L35 40 L5 35 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" className="rounded-lg"/>
        <path d="M80 20 L65 40 L95 35 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2"/>
        
        {/* Head Shape - Vibrant Blue */}
        <circle cx="50" cy="55" r="35" fill="#2563EB" />
        
        {/* Face Mask - White */}
        <path d="M50 90 L30 60 L70 60 Z" fill="#FFFFFF" /> 
        
        {/* Cheeks - Lighter Blue */}
        <circle cx="25" cy="60" r="10" fill="#60A5FA" opacity="0.8"/>
        <circle cx="75" cy="60" r="10" fill="#60A5FA" opacity="0.8"/>

        {/* Eyes */}
        {emotion === 'shocked' ? (
          <>
            <circle cx="35" cy="50" r="5" fill="#1E293B" />
            <circle cx="65" cy="50" r="5" fill="#1E293B" />
          </>
        ) : (
          <>
            <ellipse cx="35" cy="50" rx="4" ry="6" fill="#1E293B" />
            <ellipse cx="65" cy="50" rx="4" ry="6" fill="#1E293B" />
            <circle cx="37" cy="48" r="1.5" fill="white" />
            <circle cx="67" cy="48" r="1.5" fill="white" />
          </>
        )}

        {/* Nose - Black */}
        <path d="M45 65 L55 65 L50 72 Z" fill="#0F172A" className="rounded-full" />

        {/* Mouth */}
        {emotion === 'happy' && <path d="M40 75 Q50 85 60 75" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />}
        {emotion === 'talking' && <circle cx="50" cy="78" r="3" fill="#0F172A" />}
        {emotion === 'shocked' && <circle cx="50" cy="78" r="5" fill="none" stroke="#0F172A" strokeWidth="2" />}
      </motion.svg>
    </div>
  );
};

// --- BUTTONS ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth, className = '', ...props }) => {
  const baseStyles = "font-bold py-3 px-6 rounded-2xl transition-all active:translate-y-1 border-b-4 active:border-b-0 uppercase tracking-wide text-sm sm:text-base";
  
  const variants = {
    primary: "bg-nova-primary border-nova-primaryDark text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20",
    secondary: "bg-nova-secondary border-nova-secondaryDark text-white hover:bg-slate-700 shadow-lg shadow-slate-900/20",
    outline: "bg-transparent border-gray-600 text-gray-300 border-2 border-b-4 hover:bg-white/5",
    danger: "bg-red-500 border-red-700 text-white hover:bg-red-400",
    ghost: "bg-transparent border-transparent text-nova-primary hover:bg-blue-500/10 border-0 shadow-none active:translate-y-0",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- INPUTS ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ icon: Icon, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input 
          className={`
            w-full bg-white/5 border-2 border-white/10 rounded-xl py-3.5 
            ${Icon ? 'pl-12' : 'pl-4'} pr-4 
            text-white placeholder-white/40
            focus:outline-none focus:border-nova-primary focus:bg-white/10
            transition-all
            ${error ? 'border-red-400' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1 ml-1 font-bold">{error}</p>}
    </div>
  );
};

// --- CARDS ---
export const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void, selected?: boolean }> = ({ children, className = '', onClick, selected }) => {
  return (
    <div 
      onClick={onClick}
      className={`rounded-2xl p-4 border-2 border-b-4 transition-all cursor-pointer relative overflow-hidden
        ${selected 
          ? 'border-nova-primary bg-nova-primary/10 shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
          : 'border-slate-700 bg-slate-800 hover:bg-slate-750 hover:border-slate-600'}
        ${className}`}
    >
      {selected && (
        <div className="absolute top-0 right-0 p-1">
          <div className="w-3 h-3 bg-nova-primary rounded-full shadow-[0_0_8px_#2563EB]"></div>
        </div>
      )}
      {children}
    </div>
  );
};

// --- PROGRESS BAR ---
export const ProgressBar: React.FC<{ progress: number, color?: string }> = ({ progress, color = 'bg-nova-primary' }) => {
  return (
    <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className={`h-full ${color} relative shadow-[0_0_10px_currentColor]`}
      >
        <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50 blur-[2px]"></div>
      </motion.div>
    </div>
  );
};

// --- STAT BADGE ---
export const StatBadge: React.FC<{ icon: LucideIcon, value: number | string, color: string }> = ({ icon: Icon, value, color }) => (
  <div className="flex items-center space-x-1 lg:space-x-2 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-white/5 backdrop-blur-sm">
    <Icon className={`w-5 h-5 ${color}`} fill="currentColor" />
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);
