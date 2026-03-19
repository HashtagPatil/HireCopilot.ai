"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data);
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
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Active Jobs</h2>
          <p className="text-muted-foreground">Manage your job postings and applicants.</p>
        </div>
        <Link href="/generator">
          <Button>Create New Job</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed">
          <Briefcase className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-medium mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-4">You haven't posted any jobs yet.</p>
          <Link href="/generator">
            <Button variant="outline">Create your first job</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="flex flex-col hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="line-clamp-1">{job.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground mt-2 space-x-4">
                  <div className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> Remote</div>
                  <div className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {new Date(job.createdAt).toLocaleDateString()}</div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(job.skills || []).slice(0, 3).map((skill: string) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                  {job.skills?.length > 3 && <Badge variant="outline">+{job.skills.length - 3}</Badge>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center text-sm font-medium">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  View Applicants
                </div>
                <Link href={\`/jobs/\${job.id}\`}>
                  <Button variant="ghost" size="sm">Manage →</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
