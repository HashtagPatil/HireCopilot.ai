"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, FileCheck, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    jobs: 0,
    candidates: 0,
    shortlisted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: jobs } = await api.get('/jobs');
        // A real app would have an aggregate endpoint, we mock the stats calculation
        setStats({
          jobs: jobs.length || 5,
          candidates: 24,
          shortlisted: 8
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const data = [
    { name: 'Jan', applicants: 40 },
    { name: 'Feb', applicants: 30 },
    { name: 'Mar', applicants: 60 },
    { name: 'Apr', applicants: 45 },
    { name: 'May', applicants: 80 },
    { name: 'Jun', applicants: 110 },
  ];

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your recruitment pipeline.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.jobs}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.candidates}</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            <FileCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shortlisted}</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Hiring Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Applications Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => \`\${value}\`} />
                  <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="applicants" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-secondary">
                    <span className="flex h-full w-full items-center justify-center font-semibold text-primary">JD</span>
                  </span>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe applied for Senior React Dev</p>
                    <p className="text-sm text-muted-foreground">Match Score: 89%</p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-muted-foreground">2h ago</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
