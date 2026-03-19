"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Github, Mail, Lock, User as UserIcon, ShieldCheck, Globe, Zap, Terminal, Fingerprint } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data } = await api.post('/auth/login', { email, password });
        Cookies.set('token', data.token, { expires: 7, path: '/' });
        toast.success('Welcome back!');
        router.push('/dashboard');
      } else {
        const { data } = await api.post('/auth/register', { name, email, password });
        Cookies.set('token', data.token, { expires: 7, path: '/' });
        toast.success('Registration successful. Welcome!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Authentication Failed: Handshake Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-slate-50 selection:bg-primary/20 text-slate-900">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[500px] z-10 perspective-1000"
      >
        <div className="flex flex-col items-center mb-12 space-y-6">
          <motion.div 
            whileHover={{ scale: 1.1, rotateY: 180 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-md text-white relative group cursor-pointer"
          >
            <Sparkles className="w-10 h-10" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
          </motion.div>
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-extrabold tracking-tight leading-none text-slate-900">
              Hire Copilot
            </h1>
            <div className="flex items-center justify-center gap-3">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Secure Login</span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <Badge className="text-[9px] px-2 py-0.5 border-slate-200 text-slate-500 font-bold uppercase tracking-widest bg-white shadow-sm">v2.0</Badge>
            </div>
          </div>
        </div>

        <Card className="bg-white relative overflow-hidden border border-slate-200 shadow-sm rounded-3xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
          
          <CardHeader className="space-y-4 text-center pt-12 pb-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </CardTitle>
                <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-2 flex items-center justify-center gap-2">
                  <Fingerprint className="w-4 h-4" />
                  {isLogin
                    ? 'Welcome back'
                    : 'Join Hire Copilot'}
                </CardDescription>
              </motion.div>
            </AnimatePresence>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8 px-10 pb-8">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-3"
                  >
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-2">Full Name</Label>
                    <div className="relative group/input">
                      <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-primary transition-colors" />
                      <Input
                        placeholder="Jane Doe"
                        required={!isLogin}
                        className="h-14 pl-12 rounded-xl border-slate-200 bg-slate-50 focus:ring-primary/40 font-semibold text-slate-800"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-2">Email Address</Label>
                <div className="relative group/input">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-primary transition-colors" />
                  <Input
                    type="email"
                    placeholder="jane.doe@example.com"
                    required
                    className="h-14 pl-12 rounded-xl border-slate-200 bg-slate-50 focus:ring-primary/40 font-semibold text-slate-800"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">Password</Label>
                  {isLogin && <button type="button" className="text-[10px] font-bold text-primary hover:text-blue-700 transition-colors uppercase tracking-wider">Forgot Key?</button>}
                </div>
                <div className="relative group/input">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-primary transition-colors" />
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    required
                    className="h-14 pl-12 rounded-xl border-slate-200 bg-slate-50 focus:ring-primary/40 font-bold tracking-[0.3em] text-slate-800"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-6 px-10 pb-12 pt-4">
              <Button className="w-full h-14 bg-primary text-white border-none rounded-xl font-bold text-sm uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden" type="submit" disabled={loading}>
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                <span className="relative z-10 flex items-center justify-center gap-4">
                  {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                  <span className="bg-white px-4 text-slate-400">Secure Shortcuts</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 w-full">
                <Button variant="outline" type="button" className="h-14 rounded-xl border-slate-200 bg-white text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 text-slate-700 transition-all">
                  <Github className="w-4 h-4 mr-2" /> GITHUB
                </Button>
                <Button variant="outline" type="button" className="h-14 rounded-xl border-slate-200 bg-white text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 text-slate-700 transition-all">
                  <Globe className="w-4 h-4 mr-2" /> GOOGLE
                </Button>
              </div>

              <p className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-6">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:text-blue-700 transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-12 flex flex-col items-center gap-4 opacity-60 text-slate-500">
           <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-green-600" /> 
              Secure AES-256 Encryption
           </div>
           <div className="flex items-center gap-2 group cursor-help">
              <Terminal className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold tracking-wider">Hire Copilot v2.0 Platform</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

