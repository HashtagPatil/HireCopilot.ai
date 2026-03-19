"use client";

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I am your AI Recruiter Copilot. Ask me to find candidates, summarize a resume, or analyze your hiring pipeline!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';
      
      const response = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/chat\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`
        },
        body: JSON.stringify({ message: userMessage.content, type: "candidate" })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = "";

      // Add a preliminary assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '');
            if (dataStr === '{}') continue; // End event
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
            } catch (e) {
               // Ignore parse errors from partial chunks
            }
          }
        }
      }
    } catch (error) {
       toast.error('Chat failed. Ensure OpenAI API Key is valid.');
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex flex-col mb-6">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> AI Recruiter Assistant
        </h2>
        <p className="text-muted-foreground mt-1">Chat securely about your hiring data using semantic search.</p>
      </div>

      <Card className="flex-1 flex flex-col shadow-lg overflow-hidden border-primary/20">
        <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={\`flex gap-4 \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                
                <div className={\`max-w-[80%] rounded-2xl px-4 py-3 \${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/60 text-foreground'}\`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-4 justify-start animate-pulse">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-muted/60">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 bg-background border-t">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="e.g., Which candidates have React experience?" 
              className="flex-1 shadow-sm"
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || loading} className="shrink-0 rounded-full h-10 w-10">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
