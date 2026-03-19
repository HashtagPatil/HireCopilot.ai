"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Server, Activity, Database, Globe, ArrowUpRight, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const systemData = [
    { time: '00:00', load: 12 },
    { time: '04:00', load: 18 },
    { time: '08:00', load: 45 },
    { time: '12:00', load: 82 },
    { time: '16:00', load: 65 },
    { time: '20:00', load: 30 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-10 space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 px-6 py-2 glass border-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] w-fit">
            <Shield className="w-4 h-4" /> Root Authority
          </div>
          <h2 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
            System Control
          </h2>
          <p className="text-muted-foreground text-lg font-medium italic">High-fidelity oversight of the HireCopilot ecosystem.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: 'Total Entities', value: '1,284', inc: '+12%', icon: Users, color: 'text-blue-500' },
          { label: 'Neural Processors', value: 'Active', inc: 'Optimal', icon: Cpu, color: 'text-emerald-500' },
          { label: 'Vector Nodes', value: '8.4M', inc: '+400k', icon: Database, color: 'text-rose-500' },
          { label: 'Uptime', value: '99.99%', inc: 'Live', icon: Activity, color: 'text-orange-500' },
        ].map((stat, i) => (
          <Card key={i} className="premium-card border-0 bg-card/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <stat.icon className={`w-12 h-12 ${stat.color}`} />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-widest">{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black tracking-tight">{stat.value}</div>
               <p className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-tighter">{stat.inc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="premium-card border-0 bg-card/40 min-h-[400px]">
          <CardHeader>
            <CardTitle>System Load Projection</CardTitle>
            <CardDescription>Real-time neural processing latency.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={systemData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                  />
                  <Line type="monotone" dataKey="load" stroke="hsl(var(--primary))" strokeWidth={4} dot={{r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'white'}} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
           <Card className="premium-card border-0 bg-card/40 p-8 flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary">
                    <Server className="w-8 h-8" />
                 </div>
                 <div>
                    <h4 className="text-2xl font-black tracking-tight">Mainframe Clusters</h4>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest uppercase">7 Nodes Operational</p>
                 </div>
              </div>
              <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
           </Card>

           <Card className="premium-card border-0 bg-card/40 p-8 flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-500">
                    <Globe className="w-8 h-8" />
                 </div>
                 <div>
                    <h4 className="text-2xl font-black tracking-tight">Global Ingress</h4>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Active Traffic: 1.2k req/s</p>
                 </div>
              </div>
              <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
           </Card>
        </div>
      </div>
    </motion.div>
  );
}
