"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Briefcase, Zap, CheckCircle2, ArrowRight, Shield, Globe, BarChart3, MessageSquare, Wand2, Play, MapPin, Clock, ChevronRight, Activity, Terminal, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data } = await api.get('/jobs/all');
        setJobs(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen mesh-gradient">
      <div className="fixed top-24 left-0 right-0 z-40 h-10 bg-white/80 backdrop-blur-md border-y border-slate-200 overflow-hidden flex items-center shadow-sm">
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] px-4 gap-12 items-center">
          {[
            { label: "SYSTEM STATUS", value: "ONLINE", color: "text-green-600" },
            { label: "ACTIVE JOBS", value: "1,240", color: "text-primary" },
            { label: "UPTIME", value: "99.9%", color: "text-primary" },
            { label: "AVG RESPONSE", value: "12ms", color: "text-green-600" },
            { label: "SUCCESS RATE", value: "98%", color: "text-primary" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-widest text-slate-500">{stat.label}:</span>
              <span className={cn("text-[10px] font-bold tracking-widest", stat.color)}>{stat.value}</span>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {[
            { label: "SYSTEM STATUS", value: "ONLINE", color: "text-green-600" },
            { label: "ACTIVE JOBS", value: "1,240", color: "text-primary" },
            { label: "UPTIME", value: "99.9%", color: "text-primary" },
            { label: "AVG RESPONSE", value: "12ms", color: "text-green-600" },
            { label: "SUCCESS RATE", value: "98%", color: "text-primary" },
          ].map((stat, i) => (
            <div key={i+"sub"} className="flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-widest text-slate-500">{stat.label}:</span>
              <span className={cn("text-[10px] font-bold tracking-widest", stat.color)}>{stat.value}</span>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
            </div>
          ))}
        </div>
      </div>

      <section className="relative pt-44 pb-32 md:pt-64 md:pb-48 overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_20%,#e0e7ff,transparent_70%)]" />
        
        <div className="container px-6 mx-auto text-center max-w-6xl">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-primary uppercase tracking-wider mb-12 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              AI Recruiting Platform
            </motion.div>
            <h1 className="text-7xl md:text-[8rem] font-black tracking-tight leading-[0.9] mb-8 text-slate-900">
              HIRE TOP TALENT <br /> 
              <span className="text-primary px-4 bg-blue-50/50 rounded-3xl inline-block mt-4">FASTER</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              The world's most advanced recruitment platform. 
              Let AI screen, interview, and rank elite talent automatically so you can focus on hiring.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register">
                <Button className="h-16 px-10 rounded-2xl text-lg font-bold bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
                  Start Hiring Now <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" className="h-16 px-10 rounded-2xl text-lg font-bold bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all duration-300">
                View Pricing
              </Button>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 150, rotateX: 20 }}
            animate={{ opacity: 1, y: 80, rotateX: 0 }}
            transition={{ delay: 0.5, duration: 1.5, type: "spring", bounce: 0.3 }}
            className="mt-16 mx-auto max-w-7xl perspective-2000"
          >
            <div className="bg-white/90 backdrop-blur-md rounded-[3rem] p-5 border border-slate-200 shadow-2xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-[3rem] opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="rounded-[2.5rem] bg-slate-50 border border-slate-200 overflow-hidden aspect-[16/10] flex flex-col relative">
                {/* Internal UI Mockup */}
                <div className="h-14 border-b border-slate-200 flex items-center justify-between px-8 bg-white/50">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-slate-300" />
                     <div className="w-3 h-3 rounded-full bg-slate-300" />
                     <div className="w-3 h-3 rounded-full bg-slate-300" />
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="h-6 w-48 bg-slate-100 rounded-full flex items-center px-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
                        <span className="text-[10px] font-semibold text-slate-500">System Processing</span>
                      </div>
                   </div>
                </div>
                <div className="flex-1 p-8 grid grid-cols-12 gap-8 bg-slate-50/50">
                   <div className="col-span-3 space-y-6">
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-600 uppercase mb-2">Overall Match</div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full w-[85%] bg-primary" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="h-12 w-full bg-white border border-slate-100 shadow-sm rounded-xl flex items-center px-4 gap-3">
                            <Activity className="w-3.5 h-3.5 text-primary" />
                            <div className="h-2 w-24 bg-slate-100 rounded-full" />
                          </div>
                        ))}
                      </div>
                   </div>
                   <div className="col-span-9 flex flex-col gap-8">
                      <div className="grid grid-cols-3 gap-6">
                        {[
                          { label: "Skills Match", val: "94%", icon: Cpu },
                          { label: "Experience", val: "5 Yrs", icon: Zap },
                          { label: "Interviews", val: "3", icon: Globe },
                        ].map((s, i) => (
                          <div key={i} className="p-6 bg-white shadow-sm rounded-3xl border border-slate-200 group/tile relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-3 opacity-5 group-hover/tile:opacity-10 transition-opacity"><s.icon className="w-8 h-8"/></div>
                             <div className="text-xs font-bold uppercase text-slate-500 mb-1">{s.label}</div>
                             <div className="text-3xl font-black text-slate-900">{s.val}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 p-8 relative overflow-hidden shadow-sm">
                         <div className="flex justify-between items-center mb-8">
                            <div className="flex gap-4">
                               <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-primary flex items-center justify-center font-bold text-3xl">JS</div>
                               <div>
                                  <div className="text-xl font-bold text-slate-900">John Smith</div>
                                  <div className="text-xs font-semibold text-slate-500 mt-1">Senior Frontend Engineer</div>
                               </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-4 py-2 text-xs font-bold">BEST MATCH</Badge>
                         </div>
                         <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <div className="text-xs font-bold text-slate-500 uppercase">Skill Breakdown</div>
                               <div className="space-y-2">
                                  {[1,2,3].map(i => <div key={i} className="h-3 w-full bg-slate-100 rounded-full" />)}
                               </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-[10px] text-slate-600 leading-relaxed shadow-inner">
                               &gt; RESUME ANALYZED<br/>
                               &gt; STRONG JAVASCRIPT FUNDAMENTALS<br/>
                               &gt; 5 YEARS REACT EXPERIENCE<br/>
                               &gt; RECOMMEND PROGRESSION TO INTERVIEW
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Opportunities Section */}
      <section id="solutions" className="py-32 px-6 relative bg-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-primary uppercase w-fit shadow-sm">
                 <Briefcase className="w-3.5 h-3.5" /> Open Roles
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-slate-900">
                LATEST <br /> OPPORTUNITIES
              </h2>
            </div>
            
            <div className="flex items-center gap-10">
               <div className="text-right">
                  <p className="text-5xl font-black tracking-tight text-primary">2,490</p>
                  <p className="text-xs font-bold text-slate-500 uppercase mt-2">Open Positions</p>
               </div>
               <div className="w-px h-16 bg-slate-200" />
               <div className="text-right">
                  <p className="text-5xl font-black tracking-tight text-slate-900">1.2M+</p>
                  <p className="text-xs font-bold text-slate-500 uppercase mt-2">Active Candidates</p>
               </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {jobs.length === 0 ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] w-full bg-slate-100 rounded-[2.5rem] animate-pulse" />
              ))
            ) : (
              jobs.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full flex flex-col group bg-white border border-slate-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden rounded-[2.5rem]">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-all" />
                    <CardHeader className="space-y-6 pt-10">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                        <Briefcase className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 pr-10">{job.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6">
                      <div className="flex gap-3">
                        <Badge className="rounded-lg px-3 py-1 font-semibold text-[10px] uppercase tracking-wider bg-primary/10 text-primary border-none">Featured</Badge>
                        <Badge className="rounded-lg px-3 py-1 font-semibold text-[10px] uppercase tracking-wider bg-slate-100 text-slate-600 border-none">Remote</Badge>
                      </div>
                      <p className="text-base text-slate-600 line-clamp-3 leading-relaxed">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(job.skills) ? job.skills : (job.skills ? String(job.skills).split(',') : [])).slice(0, 3).map((s: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-[10px] font-semibold border-slate-200 bg-slate-50 text-slate-700 px-2 py-1 rounded-md">{s.trim()}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-6 pb-8 border-t border-slate-100 flex gap-3">
                      <Button
                        className="flex-1 h-12 rounded-xl bg-primary text-white font-bold uppercase text-xs tracking-wider shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                        onClick={() => setSelectedJob(job)}
                      >
                        Apply Now
                      </Button>
                      <Link href={`/public-jobs`} className="flex-1">
                        <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-600 hover:bg-slate-50">
                          Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
          
          <div className="text-center">
            <Link href="/public-jobs">
              <Button variant="ghost" className="h-16 px-10 text-sm font-bold uppercase tracking-wider text-slate-600 hover:text-primary hover:bg-transparent group">
                Browse All Openings <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-all" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 relative overflow-hidden bg-primary text-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[120px] rounded-full" />
        <div className="container px-6 mx-auto relative z-10">
          <div className="grid lg:grid-cols-3 gap-16">
            {[
              { label: "TIME SAVED", value: "98%", desc: "AI automation replaces traditional manual screening." },
              { label: "FASTER HIRES", value: "15x", desc: "Average time-to-hire accelerated significantly." },
              { label: "ACCURACY", value: "99%", desc: "Consistent, impartial evaluation for every candidate." },
            ].map((stat, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="text-center group"
              >
                <div className="text-7xl font-bold mb-4">{stat.value}</div>
                <div className="text-xl font-bold uppercase tracking-wider mb-3 text-blue-100">{stat.label}</div>
                <p className="text-blue-50 text-base font-medium leading-relaxed max-w-xs mx-auto">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-slate-50 relative border-y border-slate-200">
        <div className="container px-6 mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-6xl md:text-[6rem] font-bold tracking-tight leading-[0.9] mb-12 text-slate-900">
              READY TO <br /> <span className="text-primary italic">HIRE?</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register">
                <Button className="h-20 px-12 rounded-2xl text-xl font-bold bg-primary text-white hover:bg-primary/90 shadow-lg hover:-translate-y-1 transition-all">
                  Sign Up Free
                </Button>
              </Link>
              <Button variant="outline" className="h-20 px-12 rounded-2xl text-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
                Book a Demo
              </Button>
            </div>
            {/* Enterprise Logos */}
            <div className="mt-24 flex flex-wrap justify-center items-center gap-16 opacity-50 text-slate-400">
               <div className="text-3xl font-bold tracking-tight">Acme Corp</div>
               <div className="text-3xl font-bold tracking-wider">GlobalTech</div>
               <div className="text-3xl font-bold uppercase tracking-tight text-primary/60">Startups_Inc</div>
               <div className="text-3xl font-bold">Innovate</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-slate-900 text-slate-300 relative">
        <div className="container px-6 mx-auto grid grid-cols-2 lg:grid-cols-5 gap-16">
          <div className="col-span-2 lg:col-span-1">
             <Link href="/" className="flex items-center gap-3 mb-8 group">
               <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
                 <Sparkles className="w-5 h-5 text-white" />
               </div>
               <span className="text-2xl font-bold tracking-tight text-white">HireCopilot</span>
             </Link>
             <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
               Modern AI recruitment platform for modern teams. Screen, assess, and hire faster.
             </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-8">Product</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li><Link href="/resources?type=features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/resources?type=pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/resources?type=integrations" className="hover:text-primary transition-colors">Integrations</Link></li>
              <li><Link href="/dashboard" className="text-primary hover:text-white transition-all">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-8">Resources</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li><Link href="/resources?type=blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/resources?type=faq" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/resources?type=developers" className="hover:text-primary transition-colors">API</Link></li>
              <li><Link href="/resources?type=guides" className="hover:text-primary transition-colors">Guides</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-8">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li><Link href="/resources?type=about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/public-jobs" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/resources?type=contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/resources?type=trust" className="hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-1">
             <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
               <div className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">Newsletter</div>
               <p className="text-sm text-slate-400 mb-4">Get the latest product updates and recruiting tips.</p>
               <input type="text" placeholder="email@company.com" className="w-full bg-slate-900 rounded-xl p-3 text-sm border border-slate-700 mb-3 focus:outline-none focus:border-primary transition-colors text-slate-200" />
               <Button className="w-full h-12 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 hover:shadow-lg transition-all">Subscribe</Button>
             </div>
          </div>
        </div>
        <div className="container px-6 mx-auto mt-24 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-semibold text-slate-500">
           <div>&copy; 2026 HireCopilot. All rights reserved.</div>
           <div className="flex gap-8">
             <Link href="/resources?type=privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
             <Link href="/resources?type=terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
           </div>
           <div className="flex items-center gap-2 text-slate-400">
             <div className="w-2.5 h-2.5 rounded-full bg-green-500 outline outline-2 outline-green-500/20" /> 
             All Systems Normal
           </div>
        </div>
      </footer>
    </div>

      {/* Inline Apply Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="w-full max-w-lg"
            >
              <Card className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
                <div className="h-1.5 w-full bg-primary" />
                <CardHeader className="text-center pt-10 pb-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900">Apply for Role</CardTitle>
                  <CardDescription className="text-base font-medium text-slate-500 mt-1">{selectedJob.title}</CardDescription>
                </CardHeader>
                <form onSubmit={handleApply}>
                  <CardContent className="space-y-5 px-8">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Full Name</label>
                      <input
                        type="text" required placeholder="Jane Doe"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        value={applyData.name}
                        onChange={e => setApplyData({...applyData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Email Address</label>
                      <input
                        type="email" required placeholder="jane@example.com"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        value={applyData.email}
                        onChange={e => setApplyData({...applyData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Resume (PDF)</label>
                      <label htmlFor="lp-resume" className="flex items-center justify-center gap-3 h-16 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-slate-50 transition-all">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="text-sm font-semibold text-slate-500">{applyData.resume ? applyData.resume.name : 'Click to select PDF'}</span>
                        <input id="lp-resume" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setApplyData({...applyData, resume: e.target.files?.[0] || null})} required />
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-4 px-8 pb-8 pt-4">
                    <Button type="button" variant="ghost" className="flex-1 h-12 rounded-xl font-bold uppercase text-xs text-slate-600 hover:bg-slate-100" onClick={() => setSelectedJob(null)}>Cancel</Button>
                    <Button type="submit" className="flex-1 h-12 rounded-xl bg-primary text-white font-bold uppercase text-xs tracking-wider shadow-sm" disabled={applying || !applyData.resume}>
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}
