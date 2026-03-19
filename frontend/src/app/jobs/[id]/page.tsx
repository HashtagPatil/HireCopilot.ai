"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

export default function JobDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchJob() {
      try {
        const { data } = await api.get(\`/jobs/\${id}\`);
        setJob(data);
      } catch (error) {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id]);

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a resume (PDF or DOCX)');
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobId', id);

    setUploading(true);
    try {
      const { data: newCandidate } = await api.post('/candidates/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Resume uploaded and processed by AI!');
      setJob({ ...job, candidates: [newCandidate, ...job.candidates].sort((a,b) => b.matchScore - a.matchScore) });
      setFile(null);
    } catch (error) {
      toast.error('Upload failed. Ensure backend has OpenAI API Key for processing.');
    } finally {
      setUploading(false);
    }
  };

  const updateStatus = async (candidateId: string, status: string) => {
    try {
      await api.patch(\`/candidates/\${candidateId}/status\`, { status });
      toast.success(\`Candidate marked as \${status}\`);
      setJob((prev: any) => ({
        ...prev,
        candidates: prev.candidates.map((c: any) => c.id === candidateId ? { ...c, status } : c)
      }));
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  const generateEmail = async (candidateId: string, type: 'invite' | 'reject') => {
    try {
      toast.info('Generating email with AI...');
      const { data } = await api.get(\`/candidates/\${candidateId}/email?type=\${type}\`);
      // For this MVP, we just copy to clipboard
      navigator.clipboard.writeText(data.email);
      toast.success(\`\${type === 'invite' ? 'Invitation' : 'Rejection'} email copied to clipboard!\`);
    } catch (error) {
      toast.error('Email generation failed');
    }
  };

  if (loading) return <div className="p-8"><Skeleton className="h-[400px] w-full" /></div>;
  if (!job) return <div className="p-8 text-center text-muted-foreground">Job not found.</div>;

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{job.title}</h2>
          <div className="text-muted-foreground mt-1 flex items-center gap-2">
            <span>Created on {new Date(job.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <Badge variant="secondary">{job.experience} Experience</Badge>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Candidates ({job.candidates?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Match Score</TableHead>
                    <TableHead>AI Analysis</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {job.candidates?.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No candidates yet.</TableCell></TableRow>
                  ) : job.candidates?.map((c: any) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">
                        {c.name}<br/>
                        <span className="text-xs text-muted-foreground flex gap-1 mt-1">
                          <Badge variant="outline" className="text-[10px] h-4 leading-3">{c.status}</Badge>
                        </span>
                      </TableCell>
                      <TableCell>
                         <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                           <div className="h-full bg-primary" style={{ width: \`\${c.matchScore}%\` }} />
                         </div>
                         <span className="text-xs font-semibold">{c.matchScore}%</span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate" title={c.matchReason}>
                        {c.matchReason}
                      </TableCell>
                      <TableCell className="text-right space-x-2 w-[180px]">
                        <Button variant="ghost" size="icon" title="Accept" onClick={() => updateStatus(c.id, 'shortlisted')}>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Reject" onClick={() => updateStatus(c.id, 'rejected')}>
                          <XCircle className="w-4 h-4 text-destructive" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Generate Email" onClick={() => generateEmail(c.id, c.status === 'rejected' ? 'reject' : 'invite')}>
                          <Mail className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-primary/50 shadow-sm bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Upload className="w-5 h-5"/> Upload Resume</CardTitle>
              <CardDescription>Our AI will automatically scan and match it against this job.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="file" accept=".pdf,.docx,.doc" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
                {uploading ? 'Processing with AI...' : 'Upload & Scan'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                {job.description}
              </div>
              <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                {job.skills?.map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
