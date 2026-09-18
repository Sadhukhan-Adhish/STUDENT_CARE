import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  Lightbulb,
  ArrowRight,
  Code,
  Compass,
} from 'lucide-react';
import { PageHeader } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { mockStudent } from '../../data/mockData';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

const initialMessages: Message[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    content: `Hello Alex! I am your NEXORA Student Intelligence Mentor. I have full context on your academic standing (CGPA 8.74, Sem 6), your verified skills (Python 82%, Algorithms A+), and your target role as a Machine Learning Engineer. How can I help you accelerate your trajectory today?`,
    timestamp: '10:00 AM',
    suggestions: [
      'How can I improve my Python skills?',
      'What skills am I missing for an ML Engineer role?',
      'Suggest a project based on my current skills.',
      'Create a 30-day learning plan.',
    ],
  },
];

const mockResponses: Record<string, string> = {
  'How can I improve my Python skills?': `Based on your skill matrix, your Python proficiency is currently verified at **82%**, which is already strong. However, tier-1 ML Engineer positions expect **90%+** in production Python.

Here is your tailored plan:
1. **Async & Concurrency**: Master \`asyncio\` and multiprocessing for high-throughput model inference pipelines.
2. **Memory Profiling**: Learn \`tracemalloc\`, \`objgraph\`, and Cython extensions for memory optimization during large batch processing.
3. **Packaging & Type Safety**: Implement strict \`mypy\` type hints, write custom Pydantic v2 validation models, and package reusable ML modules with Poetry.

Would you like me to link an advanced PyTorch tensor optimization task to Stage 3 of your Roadmap?`,

  'What skills am I missing for an ML Engineer role?': `Analyzing your verified skills against current tech job descriptions for **Machine Learning Engineer**:

1. **PyTorch & Transformers (-28% deficit)**:
   You have classical Scikit-Learn mastered (78%), but deep learning with PyTorch is currently at 52%. You need hands-on Transformer attention mechanisms.
2. **Docker & Containerization (-28% deficit)**:
   Current level: 42%. ML engineers must package inference models into minimal GPU-enabled Docker containers.
3. **MLOps & Pipeline Deployment (-40% deficit)**:
   Current level: 35%. You need experience with MLflow experiment tracking, model registries, and ONNX runtime serving.

Target Action: Complete the recommended **Computer Vision Defect Detector** project in your Project Lab to bridge the PyTorch and Docker gaps simultaneously.`,

  'Suggest a project based on my current skills.': `Based on your high grades in Algorithms (A+) and DBMS (A), plus your ongoing AI Study Assistant build:

### Recommended Project: **"Real-Time Semantic Video Search Engine"**
* **Why this matches you**: Leverages your Python (82%) and SQL strengths, while forcing you to learn PyTorch embeddings and Vector databases.
* **Tech Stack**: PyTorch, CLIP, Milvus / ChromaDB, FastAPI, and React.
* **Resume Impact**: Addresses missing ATS keywords: *"Vector Embeddings"*, *"Distributed Inference"*, and *"Quantization"*.

I can add this to your Project Lab with pre-configured milestone rubrics if you'd like!`,

  'Create a 30-day learning plan.': `Here is your customized **30-Day Sprint to Close the ML Gap**:

* **Week 1 (Days 1–7): Deep Learning Foundations**
  * Implement Multi-Head Attention and Positional Encoding from scratch in PyTorch.
  * Practice memory-efficient backpropagation.
* **Week 2 (Days 8–14): Microservices & Docker**
  * Containerize a PyTorch inference endpoint with FastAPI and multi-worker Uvicorn.
  * Write Dockerfile with multi-stage caching to reduce image size < 800MB.
* **Week 3 (Days 15–21): MLOps & Experiment Tracking**
  * Hook up MLflow tracking on your Landslide Risk model.
  * Export model weights to ONNX format and benchmark latency reduction.
* **Week 4 (Days 22–30): Portfolio Deployment & ATS Sync**
  * Deploy the pipeline to Cloud Run with automated CI/CD GitHub Actions.
  * Re-upload resume to NEXORA Resume Intelligence to verify score jump from 84 to 90+.`,
};

export const AiAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const student = user?.studentProfile || mockStudent;

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    // Simulate AI model reasoning delay
    await new Promise((resolve) => setTimeout(resolve, 900));

    // Find best mock response or default
    let reply = mockResponses[text];
    if (!reply) {
      reply = `Thank you for asking! Analyzing your request against your academic profile (CGPA ${student.cgpa}) and target career (${student.targetCareer}):

To achieve optimal results on this, focus on connecting your strong algorithmic foundation with production engineering standards. Ensure all solutions include clean documentation, unit tests, and performance benchmarks.

Feel free to ask me to draft a syllabus, review code snippets, or compare job descriptions!`;
    }

    const aiMessage: Message = {
      id: 'msg-' + (Date.now() + 1),
      sender: 'assistant',
      content: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleClear = () => {
    setMessages(initialMessages);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col font-sans">
      <PageHeader
        title="AI Student Intelligence Assistant"
        subtitle="Context-aware guidance model conditioned on your verified grades, skill gap matrix, and career roadmap."
        badge="Context Engine: Active"
        actions={
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
              Target: {student.targetCareer}
            </span>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-[#121826] hover:bg-[#182030] border border-[#1E2638] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>
        }
      />

      {/* Main Chat Container */}
      <div className="flex-1 rounded-2xl bg-[#0D111A] border border-[#1C2538] flex flex-col overflow-hidden shadow-2xl">
        {/* Context Status Bar */}
        <div className="h-10 bg-[#0A0E18] border-b border-[#182132] px-4 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NEXORA Assistant • Ready for Gemini API Hook</span>
          </div>
          <span className="hidden sm:inline">Student: {student.name} (CGPA {student.cgpa})</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${
                    isUser
                      ? 'bg-indigo-600'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-400/30'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-[#121828] text-slate-200 border border-[#1F2B42] rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-line font-sans">
                    {msg.content}
                  </div>

                  {/* Suggestion prompt pills */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#1C263A] space-y-2">
                      <p className="text-[11px] font-mono text-indigo-300 font-semibold flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Suggested Queries:</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(sug)}
                            className="text-left px-3 py-1.5 rounded-lg bg-[#182136] hover:bg-[#202C48] text-slate-200 hover:text-white border border-[#273656] text-xs transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{sug}</span>
                            <ArrowRight className="w-3 h-3 text-indigo-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`mt-2 text-[10px] font-mono text-right ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#121828] border border-[#1F2B42] rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2 font-mono text-[11px]">Synthesizing transcript &amp; skill matrices...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#090D15] border-t border-[#182132]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about academic strategy, skill gaps, resume keywords, or projects..."
              disabled={isLoading}
              className="flex-1 bg-[#101522] border border-[#1F2A40] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
