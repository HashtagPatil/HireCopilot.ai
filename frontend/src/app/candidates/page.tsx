"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, XCircle, Search, Star, Mail, Phone, Eye, ThumbsUp, ThumbsDown, Calendar, Filter, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type CandidateStatus = 'shortlisted' | 'rejected' | 'hired' | 'pending' | string;

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    let result = candidates;
    if (search) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.jobTitle?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(c => (c.status || 'pending').toLowerCase() === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, candidates]);

  async function fetchCandidates() {
    setLoading(true);
    try {
      const { data } = await api.get('/candidates');
      const formatted = data.map((c: any) => ({
        ...c,
        jobTitle: c.job?.title || 'Unknown Job'
      }));
      const sorted = formatted.sort((a: any, b: any) => (b.matchScore || 0) - (a.matchScore || 0));
      setCandidates(sorted);
      setFiltered(sorted);
    } catch (error) {
      console.error('Failed to fetch candidates', error);
      toast.error('Could not fetch candidates');
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/candidates/${id}/status`, { status });
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      toast.success(`Candidate marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update candidate status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: CandidateStatus) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'shortlisted':
        return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">Shortlisted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-50 text-red-700 border border-red-200 font-semibold">Rejected</Badge>;
      case 'hired':
        return <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-semibold">Hired</Badge>;
      case 'invited':
        return <Badge className="bg-purple-50 text-purple-700 border border-purple-200 font-semibold">Interview Scheduled</Badge>;
      default:
        return <Badge className="bg-slate-50 text-slate-600 border border-slate-200 font-semibold">Pending Review</Badge>;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  const statusCounts = {
    all: candidates.length,
    pending: candidates.filter(c => (c.status || 'pending') === 'pending').length,
    shortlisted: candidates.filter(c => c.status === 'shortlisted').length,
    rejected: candidates.filter(c => c.status === 'rejected').length,
    hired: candidates.filter(c => c.status === 'hired').length,
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">Candidates</h2>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Candidates</h2>
          <p className="text-slate-500 text-base mt-1 font-medium">Review, shortlist, and manage all applicants.</p>
        </div>
        <Button onClick={fetchCandidates} variant="outline" className="rounded-xl border-slate-200 bg-white shadow-sm text-slate-700 gap-2 hover:bg-slate-50 font-semibold">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'shortlisted', 'rejected', 'hired'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
              statusFilter === s
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            )}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)} ({statusCounts[s]})
          </button>
        ))}
      </div>

      {/* Search + Stats */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-11 rounded-xl border border-slate-200 bg-white h-12 font-medium text-slate-800 shadow-sm focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <p className="text-sm text-slate-500 font-medium ml-auto">{filtered.length} results</p>
      </div>

      {/* Candidates Table */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-slate-900">All Applications</CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-1">Click actions to shortlist, invite, or reject candidates.</CardDescription>
            </div>
            <Badge className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 font-semibold">
              {filtered.length} Total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-20 px-8">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No candidates found</h3>
              <p className="text-slate-500 font-medium">{search ? 'Try adjusting your search.' : 'Candidates will appear here once they apply to your jobs.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider pl-8">Candidate</TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Applied For</TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">AI Match Score</TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Status</TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider text-right pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((candidate, idx) => (
                    <TableRow key={candidate.id} className="group hover:bg-slate-50 transition-colors border-b border-slate-100">
                      <TableCell className="font-medium py-4 pl-8">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-white shadow-sm flex items-center justify-center text-blue-700 font-bold text-sm">
                              {candidate.name.charAt(0).toUpperCase()}
                            </div>
                            {candidate.matchScore >= 80 && (
                              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Star className="w-2 h-2 text-white fill-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{candidate.name}</div>
                            <div className="text-xs text-slate-500 font-medium">{candidate.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-semibold text-slate-800">{candidate.jobTitle}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all", getMatchScoreColor(candidate.matchScore || 0))}
                              style={{ width: `${candidate.matchScore || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-800">{candidate.matchScore || 0}%</span>
                        </div>
                        {candidate.matchReason && (
                          <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] truncate font-medium">{candidate.matchReason}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(candidate.status)}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center gap-2 justify-end">
                          {/* View Resume */}
                          <a
                            href={`http://localhost:8080${candidate.resumeUrl}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg h-8 px-3 border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs gap-1"
                            >
                              <FileText className="w-3 h-3" /> Resume
                            </Button>
                          </a>

                          {/* Shortlist */}
                          {candidate.status !== 'shortlisted' && candidate.status !== 'hired' && (
                            <Button
                              size="sm"
                              disabled={updatingId === candidate.id}
                              onClick={() => updateStatus(candidate.id, 'shortlisted')}
                              className="rounded-lg h-8 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs gap-1 shadow-none border-none"
                            >
                              <ThumbsUp className="w-3 h-3" /> Shortlist
                            </Button>
                          )}

                          {/* Schedule Interview */}
                          {candidate.status === 'shortlisted' && (
                            <Button
                              size="sm"
                              disabled={updatingId === candidate.id}
                              onClick={() => updateStatus(candidate.id, 'invited')}
                              className="rounded-lg h-8 px-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold text-xs gap-1 shadow-none border-none"
                            >
                              <Calendar className="w-3 h-3" /> Invite
                            </Button>
                          )}

                          {/* Mark as Hired */}
                          {(candidate.status === 'shortlisted' || candidate.status === 'invited') && (
                            <Button
                              size="sm"
                              disabled={updatingId === candidate.id}
                              onClick={() => updateStatus(candidate.id, 'hired')}
                              className="rounded-lg h-8 px-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs gap-1 shadow-none border-none"
                            >
                              <CheckCircle className="w-3 h-3" /> Hire
                            </Button>
                          )}

                          {/* Reject */}
                          {candidate.status !== 'rejected' && candidate.status !== 'hired' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={updatingId === candidate.id}
                              onClick={() => updateStatus(candidate.id, 'rejected')}
                              className="rounded-lg h-8 px-3 text-red-500 hover:bg-red-50 hover:text-red-600 font-semibold text-xs gap-1"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
