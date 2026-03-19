"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Mail, CheckCircle2, XCircle, ArrowLeft, Download, Briefcase, Users, Zap, Wand2, MapPin, Clock, CloudUpload, SortAsc, Filter, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function JobDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'status'>('score');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const getSortedFiltered = (candidates: any[]) => {
    let result = [...(candidates || [])];
    if (search) result = result.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus !== 'all') result = result.filter(c => (c.status || 'pending') === filterStatus);
    if (sortBy === 'score') result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'status') result.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
    return result;
  };

  useEffect(() => {
    async function fetchJob() {
      try {
        const { data } = await api.get(`/jobs/${id}`);
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
      const { data: newCandidate } = await api.post('/candidates/upload', formData);
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
      await api.patch(`/candidates/${candidateId}/status`, { status });
      toast.success(`Candidate marked as ${status}`);
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
      const { data } = await api.get(`/candidates/${candidateId}/email?type=${type}`);
      // For this MVP, we just copy to clipboard
      navigator.clipboard.writeText(data.email);
      toast.success(`${type === 'invite' ? 'Invitation' : 'Rejection'} email copied to clipboard!`);
    } catch (error) {
      toast.error('Email generation failed');
    }
  };

  if (loading) return <div className="p-8"><Skeleton className="h-[400px] w-full" /></div>;
  if (!job) return <div className="p-8 text-center text-muted-foreground">Job not found.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-10 space-y-12 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <Link href="/jobs">
            <Button variant="ghost" size="sm" className="pl-0 text-slate-500 hover:text-primary transition-colors font-semibold uppercase tracking-wider text-xs">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
            </Button>
          </Link>
          <div className="space-y-1">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
              {job.title}
            </h2>
            <div className="text-slate-600 text-base font-semibold flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> Remote</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> Full-time</span>
              <Badge variant="outline" className="rounded-md border-blue-200 bg-blue-50 px-3 py-1 font-bold text-[10px] uppercase tracking-wider text-primary ml-2">
                {job.experience} Required
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-slate-200 bg-white text-xs font-bold shadow-sm hover:bg-slate-50 text-slate-700">
              <Download className="w-4 h-4 mr-2" /> Export Report
           </Button>
           <Button className="rounded-xl bg-primary text-white border-none shadow-sm font-bold text-xs uppercase tracking-wider px-6 h-10">
              Share Job
           </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-5 px-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight text-slate-900">Candidates</CardTitle>
                  <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
                    Total Applicants: {job.candidates?.length || 0}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-600">Active</span>
                </div>
              </div>
              {/* Sort/Filter Controls */}
              <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-slate-100">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search candidates..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 h-9 rounded-lg border-slate-200 bg-slate-50 text-sm"
                  />
                </div>
                <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v || 'all')}>
                  <SelectTrigger className="w-36 h-9 rounded-lg border-slate-200 bg-slate-50 text-sm font-semibold">
                    <Filter className="w-3.5 h-3.5 mr-1.5" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                  <SelectTrigger className="w-40 h-9 rounded-lg border-slate-200 bg-slate-50 text-sm font-semibold">
                    <SortAsc className="w-3.5 h-3.5 mr-1.5" />
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Highest Score</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="status">By Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="px-8 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Candidate</TableHead>
                    <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">Match Score</TableHead>
                    <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">AI Insight</TableHead>
                    <TableHead className="text-right px-8 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {job.candidates?.length === 0 ? (
                    <TableRow className="border-none">
                      <TableCell colSpan={4} className="text-center py-20">
                         <div className="flex flex-col items-center gap-4 text-slate-400">
                           <Users className="w-10 h-10" />
                           <p className="text-sm font-semibold">No candidates found.</p>
                         </div>
                      </TableCell>
                    </TableRow>
                  ) : job.candidates?.map((c: any) => (
                    <TableRow key={c.id} className="border-slate-100 hover:bg-slate-50 group transition-all">
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-bold text-primary text-xs uppercase shadow-sm">
                              {c.name.split(' ').map((n:any) => n[0]).join('')}
                           </div>
                           <div>
                             <p className="font-bold tracking-tight text-sm text-slate-800 group-hover:text-primary transition-colors">{c.name}</p>
                             <div className="flex items-center gap-2 mt-1">
                                <Badge className={cn(
                                  "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-none",
                                  c.status === 'shortlisted' ? "bg-green-100 text-green-700" : 
                                  c.status === 'rejected' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                )}>
                                  {c.status}
                                </Badge>
                             </div>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="space-y-2">
                           <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${c.matchScore}%` }}
                               className="h-full bg-primary" 
                             />
                           </div>
                           <span className="text-[10px] font-bold uppercase tracking-wider text-primary truncate block w-24">{c.matchScore}% Match</span>
                         </div>
                      </TableCell>
                      <TableCell className="max-w-[240px]">
                        <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                          {c.matchReason}
                        </p>
                      </TableCell>
                      <TableCell className="text-right px-8 space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-lg hover:bg-green-100 hover:text-green-700 text-slate-400" 
                          title="Accept" 
                          onClick={() => updateStatus(c.id, 'shortlisted')}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-lg hover:bg-red-100 hover:text-red-700 text-slate-400" 
                          title="Reject" 
                          onClick={() => updateStatus(c.id, 'rejected')}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary" 
                          title="AI Email" 
                          onClick={() => generateEmail(c.id, c.status === 'rejected' ? 'reject' : 'invite')}
                        >
                          <Wand2 className="w-3.5 h-3.5" />
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
          <Card className="bg-slate-50 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Zap className="w-16 h-16 text-primary" />
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-3 text-slate-900">
                <Upload className="w-5 h-5 text-primary" /> Upload Candidate
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-slate-500">Upload a resume to add a candidate manually.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative group/input">
                <Input 
                  type="file" 
                  accept=".pdf,.docx,.doc" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                  className="hidden" 
                  id="resume-upload" 
                />
                <label 
                  htmlFor="resume-upload" 
                  className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 bg-white rounded-2xl hover:border-slate-400 hover:bg-slate-100 transition-all cursor-pointer group"
                >
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform">
                    <CloudUpload className="w-6 h-6 text-primary" />
                  </div>
                  <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-primary transition-colors">
                    {file ? file.name : 'Select Resume'}
                  </span>
                </label>
              </div>
              <Button onClick={handleUpload} disabled={!file || uploading} className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all">
                {uploading ? 'Uploading...' : 'Upload & Analyze'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-6">
              <CardTitle className="text-xl font-bold tracking-tight text-slate-900 border-b-2 border-primary/30 inline-block pb-1">Job Description</CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto font-medium pr-4 scrollbar-thin scrollbar-thumb-slate-200">
                {job.description}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {job.skills?.map((s: string) => (
                  <Badge key={s} variant="outline" className="rounded-md bg-slate-50 text-slate-700 border-slate-200 font-semibold text-[10px] uppercase tracking-wider px-3 py-1">
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
