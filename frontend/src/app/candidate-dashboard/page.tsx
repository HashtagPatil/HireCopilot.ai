"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Clock, CheckCircle2, AlertCircle, MapPin, Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CandidateDashboard() {
  const [applications, setApplications] = useState([
    { id: 1, title: 'Senior AI Engineer', company: 'Horizon.ai', status: 'In Review', date: '2 days ago', match: 94 },
    { id: 2, title: 'Lead Frontend Architect', company: 'Nexus Systems', status: 'Interview', date: '5 days ago', match: 88 },
    { id: 3, title: 'Distributed Systems Dev', company: 'Ether Corp', status: 'Declined', date: '1 week ago', match: 72 },
  ]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-10 space-y-12 max-w-7xl mx-auto">
      <div className="space-y-2">
        <div className="flex items-center gap-3 px-6 py-2 glass border-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] w-fit">
          <Sparkles className="w-4 h-4" /> Personal Career Hub
        </div>
        <h2 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
          My Journey
        </h2>
        <p className="text-muted-foreground text-lg font-medium italic italic">Tracking your progress in the future of work.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {[
          { label: 'Total Applications', value: 3, icon: Send },
          { label: 'Interviews', value: 1, icon: Clock },
          { label: 'Offers Managed', value: 0, icon: CheckCircle2 },
          { label: 'Avg Match Score', value: '84.6%', icon: Sparkles },
        ].map((stat, i) => (
          <Card key={i} className="premium-card border-0 bg-card/40">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-widest">{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-between">
                <div className="text-3xl font-black tracking-tight">{stat.value}</div>
                <stat.icon className="w-8 h-8 text-primary/20" />
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-8 mt-12">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight">Transmission History</h3>
            <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 px-4 font-black text-[10px] uppercase tracking-widest text-primary">Live Sync</Badge>
        </div>

        <div className="grid gap-6">
          {applications.map((app, idx) => (
            <motion.div 
              key={app.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="premium-card border-border/40 hover:border-primary/40 transition-all bg-card/20 overflow-hidden group cursor-pointer">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center p-8 gap-8">
                    <div className="flex-1 space-y-4">
                       <div className="flex items-start gap-6">
                         <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg">
                           <Briefcase className="w-7 h-7" />
                         </div>
                         <div>
                           <h4 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{app.title}</h4>
                           <div className="flex items-center gap-8 mt-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                             <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> {app.company}</span>
                             <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> {app.date}</span>
                           </div>
                         </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-12 shrink-0">
                       <div className="text-center">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Neural Match</p>
                          <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${app.match >= 85 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500 italic'}`}>
                            {app.match}% Score
                          </div>
                       </div>
                       
                       <div className="text-right min-w-[140px]">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Internal Status</p>
                          <div className="flex items-center justify-end gap-2">
                             {app.status === 'Declined' ? <AlertCircle className="w-4 h-4 text-destructive" /> : <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                             <span className="text-xs font-bold uppercase tracking-widest">{app.status}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
