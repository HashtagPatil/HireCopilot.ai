"use client";

import { useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Sparkles, Save } from 'lucide-react';

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
        recruiterId: 'placeholder-assigned-by-backend-token'
      });
      toast.success('Job saved to database!');
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Job Description Generator</h2>
        <p className="text-muted-foreground">Instantly draft professional job descriptions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Enter the key requirements to generate a description.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Role Title</Label>
              <Input placeholder="e.g. Senior Frontend Engineer" value={role} onChange={e => setRole(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Required Skills (Comma separated)</Label>
              <Input placeholder="e.g. React, TypeScript, Next.js" value={skills} onChange={e => setSkills(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Input placeholder="e.g. 5+ years" value={experience} onChange={e => setExperience(e.target.value)} />
            </div>
            <Button className="w-full gap-2 mt-4" onClick={handleGenerate} disabled={loading}>
              <Sparkles className="w-4 h-4" />
              {loading ? 'Generating...' : 'Generate with AI'}
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Generated Description</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            <Textarea 
              className="flex-1 min-h-[400px] resize-none font-mono text-sm leading-relaxed" 
              placeholder="Your generated job description will appear here..."
              value={generatedDesc}
              onChange={(e) => setGeneratedDesc(e.target.value)}
            />
            <Button onClick={handleSaveJob} disabled={!generatedDesc} variant="secondary" className="w-full gap-2">
              <Save className="w-4 h-4" />
              Save Job Listing
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
