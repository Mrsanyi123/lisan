import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Button, Input, VideoBackground, NovaMascot } from '../components/ui';

interface AuthScreenProps {
  mode: 'LOGIN' | 'SIGNUP';
  onSuccess: () => void;
  onSwitchMode: () => void;
  onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ mode, onSuccess, onSwitchMode, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Basic Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (mode === 'SIGNUP' && !name) {
      setError('Please tell us your name');
      setIsLoading(false);
      return;
    }

    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };

  const isLogin = mode === 'LOGIN';

  return (
    <VideoBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md z-30"
        >
          <ArrowLeft size={24} />
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-nova-secondaryDark/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-nova-primary/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <NovaMascot emotion="happy" size="sm" />
            </div>
            <h2 className="text-3xl font-extrabold text-white text-center">
              {isLogin ? 'Welcome Back!' : 'Join NOVA'}
            </h2>
            <p className="text-blue-200 mt-2 text-center">
              {isLogin ? 'Ready to continue your streak?' : 'Start your language journey today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input 
                icon={User} 
                type="text" 
                placeholder="Your Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            )}
            
            <Input 
              icon={Mail} 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input 
              icon={Lock} 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="bg-red-500/20 text-red-200 text-sm p-3 rounded-xl border border-red-500/50 text-center">
                {error}
              </div>
            )}

            <Button 
              fullWidth 
              variant="primary" 
              type="submit" 
              disabled={isLoading}
              className="mt-4 shadow-lg shadow-blue-600/20"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} /> Processing...
                </span>
              ) : (
                isLogin ? 'LOG IN' : 'CREATE ACCOUNT'
              )}
            </Button>
          </form>

          {/* Social / Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-white/30 text-xs font-bold uppercase">Or continue with</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 flex items-center justify-center transition-all">
               <span className="text-white font-bold">Google</span>
            </button>
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 flex items-center justify-center transition-all">
               <span className="text-white font-bold">Apple</span>
            </button>
          </div>

          {/* Switch Mode */}
          <div className="mt-8 text-center">
            <p className="text-blue-200 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={onSwitchMode}
                className="ml-2 font-bold text-nova-primary hover:text-white transition-colors underline decoration-2 underline-offset-4"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </VideoBackground>
  );
};
