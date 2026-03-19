"use client";

import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Sparkles, ArrowLeft, ShieldCheck, HelpCircle, Globe, ChevronRight, 
  Zap, MessageSquare, Cpu, Shield, Settings, Lock, CheckCircle2, 
  BookOpen, Activity, Users, Briefcase, BarChart2, Mail, Phone
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import { cn } from '@/lib/utils';

const contentMap: Record<string, {
  title: string,
  subtitle: string,
  icon: any,
  sections: { title: string, content: string, icon?: any }[]
}> = {
  features: {
    title: "Platform Features",
    subtitle: "Everything you need to hire smarter, faster, and at scale.",
    icon: Sparkles,
    sections: [
      { title: "AI Resume Screening", content: "Upload resumes in bulk and let our AI instantly score and rank each candidate against the job requirements. No manual reading required.", icon: Cpu },
      { title: "Smart Candidate Matching", content: "Our AI analyzes skills, experience, and qualifications to generate a match score for every applicant — so you focus only on the best fits.", icon: Users },
      { title: "Job Description Generator", content: "Generate professional, detailed job descriptions in seconds. Just enter the role, skills, and experience needed.", icon: FileText },
      { title: "AI Recruiter Assistant", content: "Chat with your AI assistant to search candidates, summarize applicant pools, and get instant hiring insights.", icon: MessageSquare },
      { title: "Candidate Pipeline", content: "Manage every applicant from applied to hired in one view. Shortlist, invite to interview, or reject with one click.", icon: BarChart2 },
      { title: "Careers Page", content: "A public-facing careers portal where candidates can browse openings and apply directly. Fully integrated with your hiring dashboard.", icon: Globe },
    ]
  },
  pricing: {
    title: "Pricing Plans",
    subtitle: "Straightforward pricing that scales with your team.",
    icon: Zap,
    sections: [
      { title: "Starter — Free", content: "Perfect for small teams just getting started. Post up to 3 jobs, screen up to 20 resumes per month, and access the AI assistant.", icon: Activity },
      { title: "Pro — $49/month", content: "For growing teams with active hiring. Unlimited job postings, unlimited resume screening, AI email generation, and priority support.", icon: Zap },
      { title: "Enterprise — Custom", content: "Tailored for large organizations. Custom integrations, dedicated account manager, SSO, and SLA guarantees. Contact us for pricing.", icon: Sparkles },
    ]
  },
  solutions: {
    title: "Use Cases & Solutions",
    subtitle: "Built for every kind of recruiting team.",
    icon: Briefcase,
    sections: [
      { title: "Startups", content: "Move fast with lean teams. Our AI handles candidate screening so your founders can focus on growing the business.", icon: Zap },
      { title: "Scale-ups", content: "Handle high application volumes without adding headcount. Automate screening for every open role simultaneously.", icon: Activity },
      { title: "HR Teams", content: "Bring structure and intelligence to your recruitment process. From posting to shortlisting, everything in one platform.", icon: Users },
      { title: "Staffing Agencies", content: "Manage multiple client job pipelines, screen resumes at scale, and deliver shortlisted candidates to clients faster.", icon: Briefcase },
    ]
  },
  about: {
    title: "About HireCopilot",
    subtitle: "We're on a mission to make great hiring accessible to everyone.",
    icon: ShieldCheck,
    sections: [
      { title: "Our Mission", content: "HireCopilot was built to remove the friction of talent acquisition. We believe the best person for the job should always get the interview — not just the prettiest resume.", icon: Globe },
      { title: "Built Responsibly", content: "Our AI scoring is designed to be objective and skills-based. We focus on what matters: relevant experience, skills match, and role requirements.", icon: Shield },
      { title: "The Team", content: "We're a team of engineers, product designers, and ex-recruiters who've experienced both sides of hiring. We built the tool we always wished existed.", icon: Users },
    ]
  },
  settings: {
    title: "Account Settings",
    subtitle: "Manage your profile, preferences, and account configuration.",
    icon: Settings,
    sections: [
      { title: "Profile Information", content: "Update your name, email address, and profile picture. Your display name appears across all recruiter-facing views in the platform.", icon: Users },
      { title: "Notification Preferences", content: "Choose how you receive alerts for new applications, candidate status changes, and system updates. Configure email or in-app notifications.", icon: Mail },
      { title: "API & Integrations", content: "Connect HireCopilot with your existing ATS, HRIS, or communication tools. Manage your API keys and webhook configurations here.", icon: Cpu },
    ]
  },
  trust: {
    title: "Security & Privacy",
    subtitle: "Your data is protected with enterprise-grade security standards.",
    icon: Lock,
    sections: [
      { title: "Data Encryption", content: "All data is encrypted at rest and in transit using AES-256 and TLS 1.3. Resume files and candidate information are stored securely.", icon: Lock },
      { title: "Access Controls", content: "Role-based access ensures only authorized team members can view sensitive candidate data. Audit logs track every action.", icon: Shield },
      { title: "Privacy Compliance", content: "HireCopilot is designed with GDPR and data privacy best practices in mind. Candidates can request data deletion at any time.", icon: CheckCircle2 },
      { title: "Responsible AI", content: "Our AI models do not make hiring decisions. They provide assistance and scoring to help human recruiters make better-informed choices.", icon: ShieldCheck },
    ]
  },
  faq: {
    title: "Help & FAQ",
    subtitle: "Answers to the most common questions about using HireCopilot.",
    icon: HelpCircle,
    sections: [
      { title: "How does AI resume screening work?", content: "When a candidate uploads their resume, our AI extracts the text, compares it to the job description, and generates a match score from 0-100 with an explanation. Scores above 75 are automatically shortlisted.", icon: Cpu },
      { title: "Can I upload resumes manually?", content: "Yes. On any job detail page, you'll find the 'Upload Candidate' panel. Upload a PDF or DOCX file and the AI will process and score the resume instantly.", icon: FileText },
      { title: "How do I post a new job?", content: "Go to Jobs → Post New Job, or use the JD Generator to first create a job description. You can then fill in the job details and publish it to your careers page.", icon: Briefcase },
      { title: "How do I contact support?", content: "Email us at support@hirecopilot.ai or use the AI Assistant in the dashboard. Our support team responds within 24 hours on business days.", icon: Phone },
    ]
  },
};

function StaticPageContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'features';
  const data = contentMap[type] || {
    title: type.charAt(0).toUpperCase() + type.slice(1),
    subtitle: "This section is coming soon.",
    icon: FileText,
    sections: []
  };
  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-24">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
          <Link href="/">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 transition-all font-semibold pl-0 gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </motion.div>

        <div className="flex flex-col gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-primary uppercase tracking-wider w-fit"
          >
            <Icon className="w-4 h-4" /> {type}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900"
          >
            {data.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-medium max-w-3xl leading-relaxed"
          >
            {data.subtitle}
          </motion.p>
        </div>

        {/* Nav links for sub-sections */}
        <div className="flex flex-wrap gap-2 mb-12">
          {[
            { label: 'Features', key: 'features' },
            { label: 'Pricing', key: 'pricing' },
            { label: 'Solutions', key: 'solutions' },
            { label: 'About', key: 'about' },
            { label: 'Settings', key: 'settings' },
            { label: 'Security', key: 'trust' },
            { label: 'Help', key: 'faq' },
          ].map(item => (
            <Link key={item.key} href={`/resources?type=${item.key}`}>
              <span className={cn(
                "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all",
                type === item.key
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              )}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {data.sections.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {data.sections.map((section, idx) => {
                const SIcon = section.icon;
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="group bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
                  >
                    {SIcon && (
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <SIcon className="w-6 h-6" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors">{section.title}</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">{section.content}</p>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mx-auto">
                <Icon className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Content Coming Soon</h2>
                <p className="text-slate-500 font-medium">This section is under construction.</p>
              </div>
              <Link href="/">
                <Button className="h-12 px-10 rounded-xl text-sm font-bold bg-primary text-white mt-4">Back to Home</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function StaticPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-500 font-semibold animate-pulse">
        Loading...
      </div>
    }>
      <StaticPageContent />
    </Suspense>
  );
}
