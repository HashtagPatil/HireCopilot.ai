"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, Users, Plus, ArrowRight, Sparkles, Wand2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data } = await api.get('/jobs');
        // Fetch each job with its candidates count
        const jobsWithCounts = await Promise.all(
          data.map(async (job: any) => {
            try {
              const { data: jobDetail } = await api.get(`/jobs/${job.id}`);
              return { ...job, candidateCount: jobDetail.candidates?.length || 0 };
            } catch {
              return { ...job, candidateCount: 0 };
            }
          })
        );
        setJobs(jobsWithCounts);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <h2 className="text-3xl font-bold">Active Jobs</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-10 space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Active Jobs
          </h2>
          <p className="text-muted-foreground text-lg font-medium">Manage your current job postings.</p>
        </div>
        <Link href="/generator">
          <Button className="h-12 px-8 rounded-xl font-bold text-base shadow-md transition-all gap-2">
            <Plus className="w-5 h-5" />
            Post New Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-24 text-center border border-dashed rounded-3xl border-slate-300 bg-slate-50">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Briefcase className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-3 tracking-tight text-slate-900">No Active Jobs</h3>
          <p className="text-slate-600 mb-8 max-w-md text-base leading-relaxed">Create your first job posting to start hiring.</p>
          <Link href="/generator">
            <Button className="h-12 px-8 rounded-xl font-bold shadow-sm">Post a Job</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, idx) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className="bg-white border border-slate-200 shadow-sm h-full flex flex-col group relative overflow-hidden hover:shadow-md hover:border-slate-300 transition-all">
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                  <Briefcase className="w-16 h-16 text-primary" />
                </div>
                <CardHeader className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
                      Live
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold tracking-tight leading-tight text-slate-900 group-hover:text-primary transition-colors">{job.title}</CardTitle>
                  <div className="flex items-center gap-6 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary"/> Remote</div>
                    <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-primary"/> {new Date(job.createdAt).toLocaleDateString()}</div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pt-4">
                  <p className="text-sm text-slate-600 line-clamp-3 mb-8 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(job.skills || []).slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-[10px] font-semibold border-slate-200 bg-slate-50 text-slate-700 px-3 py-1 rounded-md">{skill}</Badge>
                    ))}
                    {job.skills?.length > 3 && <Badge variant="ghost" className="text-[10px] font-semibold text-slate-500">+{job.skills.length - 3} more</Badge>}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t border-slate-100 bg-slate-50 py-4 px-6 mt-6">
                  <div className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-600">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    {job.candidateCount || 0} Applicants
                  </div>
                  <Link href={`/jobs/${job.id}`}>
                    <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-all font-bold text-[10px] uppercase tracking-wider hover:bg-white hover:text-primary rounded-lg border border-transparent hover:border-slate-200 shadow-sm px-4 py-2">
                      Manage Candidates <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
