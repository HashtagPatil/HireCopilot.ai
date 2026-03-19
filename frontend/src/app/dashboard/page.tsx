"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Briefcase, FileCheck, TrendingUp, Plus, ArrowRight, Clock, Activity, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    jobs: 0,
    candidates: 0,
    shortlisted: 0,
  });
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const [jobsRes, candidatesRes] = await Promise.allSettled([
          api.get('/jobs'),
          api.get('/candidates'),
        ]);

        const jobsData = jobsRes.status === 'fulfilled' ? jobsRes.value.data : [];
        const candidatesData = candidatesRes.status === 'fulfilled' ? candidatesRes.value.data : [];

        setJobs(jobsData.slice(0, 3));
        setStats({
          jobs: jobsData.length,
          candidates: candidatesData.length,
          shortlisted: candidatesData.filter((c: any) => c.status === 'shortlisted').length,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const chartData = [
    { name: 'Jan', applications: 40 },
    { name: 'Feb', applications: 30 },
    { name: 'Mar', applications: 60 },
    { name: 'Apr', applications: 45 },
    { name: 'May', applications: 80 },
    { name: 'Jun', applications: 110 },
  ];

  const statCards = [
    {
      title: 'Active Jobs',
      value: stats.jobs,
      icon: Briefcase,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      trend: '+12%',
      trendColor: 'text-emerald-600',
    },
    {
      title: 'Total Candidates',
      value: stats.candidates,
      icon: Users,
      color: 'text-violet-500',
      bg: 'bg-violet-50',
      trend: '+40%',
      trendColor: 'text-emerald-600',
    },
    {
      title: 'Shortlisted',
      value: stats.shortlisted,
      icon: FileCheck,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      trend: 'Top Tier',
      trendColor: 'text-emerald-600',
    },
    {
      title: 'Conversion Rate',
      value: stats.candidates > 0 ? `${Math.round((stats.shortlisted / stats.candidates) * 100)}%` : '0%',
      icon: TrendingUp,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      trend: 'Steady',
      trendColor: 'text-slate-500',
    },
  ];

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 md:p-10 space-y-10 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">System Online</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500 font-medium">Overview of your recruitment operations.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/generator">
            <Button variant="outline" className="rounded-xl border-slate-200 bg-white shadow-sm text-slate-700 gap-2 hover:border-primary/40 font-semibold">
              <FileCheck className="w-4 h-4" /> Generate JD
            </Button>
          </Link>
          <Link href="/jobs">
            <Button className="rounded-xl bg-primary text-white gap-2 shadow-sm hover:-translate-y-0.5 transition-all font-semibold">
              <Plus className="w-4 h-4" /> Post a Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <span className={cn("text-xs font-bold uppercase tracking-wider", stat.trendColor)}>
                    {stat.trend}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
                  <p className="text-sm font-semibold text-slate-500">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts + Recent Jobs */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Chart */}
        <Card className="lg:col-span-3 bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-4 px-8 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Applications Overview</CardTitle>
                <CardDescription className="text-sm font-medium text-slate-500 mt-1">Monthly application volume</CardDescription>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-600">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div style={{ width: '100%', minHeight: 260 }}>
              {mounted && (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(99, 102, 241, 0.04)', radius: 8 }}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                      }}
                      labelStyle={{ fontWeight: 700, color: '#1e293b', fontSize: '12px' }}
                      itemStyle={{ fontWeight: 600, color: '#6366f1', fontSize: '12px' }}
                    />
                    <Bar dataKey="applications" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card className="lg:col-span-2 bg-white border border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-900">Recent Jobs</CardTitle>
              <Link href="/jobs">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary text-xs font-semibold gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {jobs.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-500">No jobs posted yet.</p>
                <Link href="/jobs">
                  <Button className="mt-4 rounded-xl bg-primary text-white text-xs gap-1 h-9" size="sm">
                    <Plus className="w-3 h-3" /> Add a Job
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {jobs.map((job, i) => (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{job.title}</p>
                        <p className="text-xs text-slate-500 font-medium">{job.experience || 'Any experience'}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
          <div className="p-4 border-t border-slate-100">
            <Link href="/candidates">
              <Button variant="outline" className="w-full rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold gap-2">
                <Users className="w-4 h-4" /> View All Candidates
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Post a New Job', desc: 'Create and publish a new job opening', href: '/jobs', icon: Briefcase, color: 'bg-blue-500' },
          { title: 'Generate Job Description', desc: 'Use AI to draft a professional JD', href: '/generator', icon: FileCheck, color: 'bg-violet-500' },
          { title: 'View Candidates', desc: 'Review and shortlist applicants', href: '/candidates', icon: Users, color: 'bg-emerald-500' },
        ].map((action, i) => (
          <Link key={i} href={action.href}>
            <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group">
              <CardContent className="p-6 flex items-center gap-5">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0", action.color)}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">{action.title}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{action.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
