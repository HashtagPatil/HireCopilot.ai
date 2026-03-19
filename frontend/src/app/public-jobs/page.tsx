"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Briefcase, MapPin, Clock, Send, Sparkles, Wand2, Plus, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export default function PublicJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applying, setApplying] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', resume: null as File | null });

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await api.get('/jobs/all');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resume) return toast.error("Please upload a resume");
    
    setApplying(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('resume', formData.resume);
    data.append('jobId', selectedJob.id);

    try {
      await api.post('/candidates/upload', data);
      toast.success("Application submitted successfully!");
      setSelectedJob(null);
      setFormData({ name: '', email: '', resume: null });
    } catch (err) {
      toast.error("Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 font-bold uppercase tracking-wider text-xs animate-pulse">Loading Jobs...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/20 overflow-x-hidden relative">
      <div className="relative z-10 max-w-7xl mx-auto space-y-24 py-32 px-6 md:px-12">
        <header className="text-center space-y-10 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="inline-flex items-center gap-4 px-6 py-2 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-primary uppercase tracking-wider shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> Careers
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-slate-900"
          >
            JOIN OUR <span className="text-primary">TEAM.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto font-medium"
          >
            We are building the open platform that connects great talent with opportunities.
          </motion.p>
        </header>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, idx) => (
            <motion.div 
              key={job.id} 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.1 + 0.3 }}
              className="h-full"
            >
              <Card className="bg-white h-full flex flex-col group cursor-pointer border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-500 relative overflow-hidden rounded-3xl shadow-sm">
                <CardHeader className="space-y-8 p-10">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                      <Briefcase className="w-8 h-8" />
                    </div>
                    <Badge className="rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider bg-blue-50 text-blue-700 border-none">
                      {job.experience || 'ENTRY level'}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight leading-none group-hover:text-primary transition-colors text-slate-900">{job.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-10 p-10 pt-0">
                  <div className="flex items-center gap-8 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Remote</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Full-Time</span>
                  </div>
                  <p className="text-base text-slate-600 leading-relaxed font-medium transition-opacity">
                    {job.description || "Join us to build next-generation solutions."}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-4">
                    {job.skills?.slice(0, 4).map((s: string) => (
                      <Badge key={s} variant="outline" className="text-[10px] font-semibold px-3 py-1 border-slate-200 bg-slate-50 rounded-md transition-all group-hover:border-slate-300 text-slate-700">{s.toUpperCase()}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-10 pt-0">
                  <Button 
                    className="w-full h-14 bg-primary group text-white rounded-xl shadow-sm hover:shadow-md transition-all font-bold text-xs uppercase tracking-wider border-none" 
                    onClick={() => setSelectedJob(job)}
                  >
                    Apply Now
                    <Send className="w-5 h-5 ml-4 group-hover:translate-x-3 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {jobs.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm space-y-8"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mx-auto">
               <Activity className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight mb-3 text-slate-900">NO OPEN ROLES</h3>
              <p className="text-slate-600 text-lg font-medium">There are currently no open roles. Please check back later.</p>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 40 }} 
              className="w-full max-w-3xl"
            >
              <Card className="bg-white border-slate-200 shadow-xl overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary opacity-20" />
                <CardHeader className="text-center space-y-6 pt-20 pb-12">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                     <Wand2 className="w-8 h-8 relative z-10" />
                  </div>
                  <CardTitle className="text-4xl font-bold tracking-tight text-slate-900">Apply for Role</CardTitle>
                  <CardDescription className="text-xl font-medium text-slate-600">{selectedJob.title}</CardDescription>
                </CardHeader>
                <form onSubmit={handleApply} className="space-y-10">
                  <CardContent className="space-y-12 px-16">
                    <div className="grid md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                         <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-2">Full Name</Label>
                         <Input id="name" required placeholder="Jane Doe" className="h-14 rounded-xl border-slate-300 bg-white focus:ring-primary/40 px-6 font-semibold shadow-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                       </div>
                       <div className="space-y-4">
                         <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-2">Email Address</Label>
                         <Input id="email" type="email" required placeholder="jane.doe@example.com" className="h-14 rounded-xl border-slate-300 bg-white focus:ring-primary/40 px-6 font-semibold shadow-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                       </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-2">Resume (PDF)</Label>
                      <div className="relative group/file">
                        <Input id="resume" type="file" accept=".pdf" required className="hidden" onChange={e => setFormData({...formData, resume: e.target.files?.[0] || null})} />
                        <label htmlFor="resume" className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 rounded-2xl h-40 group-hover/file:border-primary/40 transition-all cursor-pointer bg-slate-50 group-hover/file:bg-slate-100">
                           <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary mb-3 group-hover/file:scale-110 transition-all">
                              <Plus className="w-6 h-6" />
                           </div>
                           <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 transition-opacity">
                             {formData.resume ? formData.resume.name : "Select Resume"}
                           </span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-6 px-16 pb-20 pt-4">
                    <Button type="button" variant="ghost" className="flex-1 h-14 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-slate-100 text-slate-600" onClick={() => setSelectedJob(null)}>Cancel</Button>
                    <Button type="submit" className="flex-1 h-14 rounded-xl bg-primary text-white border-none font-bold text-sm uppercase tracking-wider shadow-sm hover:-translate-y-0.5 transition-all" disabled={applying}>
                      {applying ? "Submitting..." : "Submit Application"}
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

