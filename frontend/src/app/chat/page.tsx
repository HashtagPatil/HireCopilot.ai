"use client";

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, User, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'card';
  data?: any;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi there! I am your AI Recruiter Assistant. How can I help you regarding your hiring process?", type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState<'none' | 'role' | 'skills' | 'exp' | 'final'>('none');
  const [scanData, setScanData] = useState({ role: '', skills: '', exp: '' });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (overrideInput?: string) => {
    const messageContent = overrideInput || input;
    if (!messageContent.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: messageContent }]);
    if (!overrideInput) setInput('');
    setLoading(true);

    // Guided Flow Logic
    if (scanStep !== 'none') {
      handleScanStep(messageContent);
      return;
    }

    if (messageContent.toLowerCase().includes('scan') || messageContent.toLowerCase().includes('find candidate')) {
      setScanStep('role');
      setMessages(prev => [...prev, { role: 'assistant', content: "Understood. Initializing candidate search. Which role are we optimizing for? (e.g., Lead Engineer)" }]);
      setLoading(false);
      return;
    }

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: messageContent, type: "candidate" })
      });

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = "";
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '');
            if (dataStr === '{}') continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.content) {
                assistantMsg += data.content;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content = assistantMsg;
                  return newMsgs;
                });
              }
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      toast.error('Transmission failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleScanStep = async (val: string) => {
    if (scanStep === 'role') {
      setScanData({ ...scanData, role: val });
      setScanStep('skills');
      setMessages(prev => [...prev, { role: 'assistant', content: `Role confirmed: ${val}. What are the key skills required? (e.g., Python, React Native)` }]);
      setLoading(false);
    } else if (scanStep === 'skills') {
      setScanData({ ...scanData, skills: val });
      setScanStep('exp');
      setMessages(prev => [...prev, { role: 'assistant', content: "Got it. Final parameter: Minimum experience level or specific background requirements?" }]);
      setLoading(false);
    } else if (scanStep === 'exp') {
      const finalData = { ...scanData, exp: val };
      setScanData(finalData);
      setScanStep('none');
      
      setMessages(prev => [...prev, { role: 'assistant', content: "Searching candidates... This will take a moment." }]);
      
      // Execute refined search
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';
        const query = `Find top 2 candidates for ${finalData.role} with skills in ${finalData.skills} and background in ${finalData.exp}. Give direct recommendations with name and match score.`;
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ message: query, type: "candidate" })
        });

        // Use streaming or just await final... let's stream for consistency
        if (!response.body) throw new Error("No body");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantMsg = "";
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
               const data = JSON.parse(line.replace('data: ', ''));
               if (data.content) {
                 assistantMsg += data.content;
                 setMessages(prev => {
                   const msgs = [...prev];
                   msgs[msgs.length - 1].content = assistantMsg;
                   return msgs;
                 });
               }
            }
          }
        }
      } catch (e) {
        toast.error('Search failed.');
      } finally {
        setLoading(false);
        setScanData({ role: '', skills: '', exp: '' });
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-6 md:p-8">
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-slate-900">
          <Sparkles className="w-6 h-6 text-primary" /> AI Recruiter Assistant
        </h2>
        <p className="text-slate-500 font-medium mt-0.5 text-sm">Ask anything about your recruiting pipeline.</p>
      </div>


      <Card className="flex-1 flex flex-col shadow-sm overflow-hidden border-slate-200 bg-white">
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${msg.role === 'user' ? 'bg-primary text-white shadow-sm' : 'bg-slate-50 border border-slate-100 text-slate-800'}`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">{msg.content}</p>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-4 justify-start animate-pulse">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="max-w-[80%] rounded-2xl px-5 py-3.5 bg-slate-50 border border-slate-100">
                  <p className="text-sm font-medium text-slate-500">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
          <div className="flex gap-2">
            <Button 
               variant="outline" 
               size="sm" 
               onClick={() => { setScanStep('role'); handleSend("Initiate candidate scan"); }}
               className="rounded-full border border-blue-200 bg-blue-50 text-xs font-semibold text-primary hover:bg-blue-100 transition-colors"
               disabled={scanStep !== 'none' || loading}
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" /> Candidate Search
            </Button>
            <Button 
               variant="outline" 
               size="sm" 
               onClick={() => handleSend("Summarize recent applicants")}
               className="rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
               disabled={loading}
            >
               Summarize Pipeline
            </Button>
          </div>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-3"
          >
            <Input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder={scanStep === 'none' ? "Ask the AI Assistant..." : "Enter parameter..."} 
              className="flex-1 shadow-sm h-12 rounded-xl border-slate-200 bg-white px-6 font-medium text-slate-900"
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || loading} className="shrink-0 h-12 w-12 rounded-xl shadow-sm bg-primary text-white hover:-translate-y-0.5 transition-all">
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
