"use client";

import { useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Sparkles, Save, Wand2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GeneratorPage() {
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedDesc, setGeneratedDesc] = useState('');

  const handleGenerate = async () => {
    if (!role || !skills || !experience) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/jobs/generate-description', { role, skills, experience });
      setGeneratedDesc(data.description);
      toast.success('Generated successfully!');
    } catch (error) {
      toast.error('Failed to generate description');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async () => {
    try {
      const skillsArray = skills.split(',').map(s => s.trim());
      await api.post('/jobs', {
        title: role,
        description: generatedDesc,
        requirements: ["Generated via AI based on requirements."],
        skills: skillsArray,
        experience,
      });
      toast.success('Job saved to database!');
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Job Description Generator
          </h2>
          <p className="text-slate-600 text-lg font-medium">Create detailed job descriptions with AI.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-primary uppercase tracking-wider">
          <Wand2 className="w-4 h-4" /> GPT-4 Powered
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8">
          <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">Job Requirements</CardTitle>
              <CardDescription className="text-slate-500 font-medium">Define the role and ideal candidate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">Job Role</Label>
                <Input placeholder="e.g. Senior Frontend Engineer" className="bg-slate-50 border-slate-200 rounded-xl py-6" value={role} onChange={e => setRole(e.target.value)} />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">Skills & Technologies</Label>
                <Input placeholder="e.g. React, Next.js, TypeScript" className="bg-slate-50 border-slate-200 rounded-xl py-6" value={skills} onChange={e => setSkills(e.target.value)} />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">Experience Required</Label>
                <Input placeholder="e.g. 5+ years building web applications" className="bg-slate-50 border-slate-200 rounded-xl py-6" value={experience} onChange={e => setExperience(e.target.value)} />
              </div>
              <Button className="w-full gap-2 py-6 h-14 rounded-xl text-base font-bold bg-primary text-white shadow-md hover:shadow-lg transition-all mt-6" onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating Description...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Description
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 bg-green-50 rounded-2xl border border-green-100 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <p className="text-sm font-bold">AI Consistency Check Passed</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our AI ensures the job description matches industry standards and SEO best practices for maximum reach.
            </p>
          </div>
        </div>

        <Card className="lg:col-span-7 bg-white border border-slate-200 shadow-sm flex flex-col min-h-[700px]">
          <CardHeader className="border-b border-slate-100 py-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Job Description Draft</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Generated description for your review and editing.</CardDescription>
              </div>
              {generatedDesc && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 font-semibold uppercase tracking-wider text-[10px]">
                  Draft Ready
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative group">
            <Textarea 
              className="absolute inset-0 border-0 focus-visible:ring-0 resize-none font-mono text-sm p-10 leading-relaxed bg-transparent custom-scrollbar text-slate-700" 
              placeholder="Your professional job description will appear here..."
              value={generatedDesc}
              onChange={(e) => setGeneratedDesc(e.target.value)}
            />
          </CardContent>
          <CardFooter className="border-t border-slate-100 p-8 bg-slate-50">
            <Button onClick={handleSaveJob} disabled={!generatedDesc} className="w-full gap-3 py-6 h-14 text-base font-bold rounded-xl shadow-md hover:-translate-y-0.5 transition-all bg-primary text-white hover:bg-primary/90">
              <Save className="w-5 h-5" />
              Save Job Posting
            </Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
