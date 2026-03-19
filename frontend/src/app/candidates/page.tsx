"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        // We will fetch all jobs and extract their candidates locally for this MVP
        const { data: jobs } = await api.get('/jobs');
        const allCandidates = await Promise.all(
          jobs.map((job: any) => api.get(\`/jobs/\${job.id}\`).then(res => res.data.candidates))
        );
        const flattened = allCandidates.flat().map((c: any, index: number) => ({
          ...c,
          jobTitle: jobs.find((j: any) => j.id === c.jobId)?.title || 'Unknown Job'
        }));
        setCandidates(flattened.sort((a,b) => (b.matchScore || 0) - (a.matchScore || 0)));
      } catch (error) {
        console.error('Failed to fetch candidates', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCandidates();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'shortlisted': return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Shortlisted</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      case 'hired': return <Badge className="bg-blue-500/10 text-blue-500">Hired</Badge>;
      default: return <Badge variant="secondary">Pending Review</Badge>;
    }
  };

  if (loading) {
    return (
        <div className="p-8 space-y-6">
          <h2 className="text-3xl font-bold">Candidates Pipeline</h2>
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Candidates Pipeline</h2>
        <p className="text-muted-foreground">Track all applicants across your active job postings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Applied For</TableHead>
                <TableHead>AI Match Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No candidates found in the system.
                  </TableCell>
                </TableRow>
              ) : candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{candidate.name}</div>
                        <div className="text-xs text-muted-foreground">{candidate.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{candidate.jobTitle}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                         <div className="h-full bg-primary" style={{ width: \`\${candidate.matchScore || 0}%\` }} />
                       </div>
                       <span className="text-sm font-medium">{candidate.matchScore || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                  <TableCell className="text-right">
                    <a href={\`http://localhost:5000\${candidate.resumeUrl}\`} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline">
                      View Resume
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
