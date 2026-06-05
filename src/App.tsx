import { useState, FormEvent } from 'react';
import { PORTFOLIO_INFO } from './data';
import GameNarrativeDesign from './components/GameNarrativeDesign';
import WritingSamples from './components/WritingSamples';
import Certificates from './components/Certificates';
import {
  FileText,
  Compass,
  Award,
  GitBranch,
  BookOpen,
  Mail,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle,
  Code,
  User,
  Check,
  Send,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  const [activeCabinet, setActiveCabinet] = useState<'narrative' | 'writing' | 'certificates' | 'about'>('narrative');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [sentStatus, setSentStatus] = useState(false);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    setSentStatus(true);
    setTimeout(() => {
      setSentStatus(false);
      setShowContactModal(false);
      setContactMessage('');
      setContactSubject('');
    }, 2050);
  };

  return (
    <div id="portfolio-light-root" className="min-h-screen text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 relative">
      {/* Dynamic atmospheric ambient glow containers */}
      <div className="aurora-glow-left" />
      <div className="aurora-glow-right" />
      
      {/* Upper Status Workspace Bar */}
      <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-md border-t-4 border-t-indigo-600 border-b border-indigo-100/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
          <span className="font-mono text-xs font-bold tracking-widest text-slate-800">
            AREZOO // PORTFOLIO
          </span>
          <span className="text-[9px] font-mono text-indigo-600 bg-indigo-50 border border-indigo-100/60 px-2 py-0.5 rounded uppercase font-bold">
            Creative Workspace
          </span>
        </div>

        {/* Quick Contacts */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowContactModal(true)}
            className="px-4 py-1.5 text-xs font-mono rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 text-white font-bold transition-all duration-300 flex items-center gap-1.5 shadow-md hover:shadow-indigo-200/50 hover:scale-[1.02] cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5" />
            Contact Me
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-14 space-y-10 relative z-10">
        
        {/* HERO HEADER AREA */}
        <section id="executive-summary" className="relative bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl p-6 sm:p-10 space-y-6 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          {/* Aesthetic colourful left border stripe */}
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-b from-indigo-505 via-purple-500 to-teal-400" />
          
          {/* Internal colorful glows */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-indigo-200/10 to-purple-200/15 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gradient-to-tr from-teal-200/10 to-cyan-200/15 rounded-full filter blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-4xl pl-2 sm:pl-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-100 rounded-full px-3 py-1 text-xs font-mono text-indigo-705 transition">
              <Sparkles className="h-3 w-3 animate-spin text-indigo-500" />
              Creative & System Portfolio Edition
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-sans font-extrabold tracking-tight text-slate-900 leading-none">
                {PORTFOLIO_INFO.name} Portfolio
              </h1>
              
              {/* Correct Roles list */}
              <div className="flex flex-wrap gap-2 pt-2">
                {PORTFOLIO_INFO.roles.map((role, idx) => {
                  let badgeColors = "bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100/80";
                  if (idx === 1) badgeColors = "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100/80";
                  if (idx === 2) badgeColors = "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/80";
                  return (
                    <span
                      key={idx}
                      className={`px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold transition-all duration-300 shadow-xs flex items-center gap-1.5 cursor-default ${badgeColors}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {role}
                    </span>
                  );
                })}
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 font-serif leading-relaxed text-justify max-w-3xl pt-2">
              {PORTFOLIO_INFO.about}
            </p>
          </div>

          {/* Specialization Domain Skills list */}
          <div className="pt-5 border-t border-slate-100 pl-2 sm:pl-4">
            <span className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider mb-3">
              CREATIVE CORE SKILLS
            </span>
            <div className="flex flex-wrap gap-1.5 max-w-3xl">
              {(() => {
                const colors = [
                  "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100/60",
                  "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/60",
                  "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/60",
                  "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100/60",
                  "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100/60",
                  "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/60",
                  "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100/60",
                  "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/60"
                ];
                return PORTFOLIO_INFO.skills.map((skill, idx) => {
                  const styleClass = colors[idx % colors.length];
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-lg border transition-all duration-200 text-xs font-sans font-medium shadow-xs cursor-default ${styleClass}`}
                    >
                      {skill}
                    </span>
                  );
                });
              })()}
            </div>
          </div>
        </section>


        {/* MAIN CATEGORY NAV BOARD */}
        <section id="cabinet-switchboard" className="space-y-6">
          
          {/* Main Selectors Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <button
              onClick={() => setActiveCabinet('narrative')}
              className={`text-left p-5 rounded-xl border transition-all duration-300 shadow-xs flex flex-col justify-between space-y-4 cursor-pointer group ${
                activeCabinet === 'narrative'
                  ? 'bg-gradient-to-br from-teal-50/80 via-white to-cyan-50/30 border-teal-500 ring-4 ring-teal-100/65 shadow-md scale-[1.01]'
                  : 'bg-white/80 border-slate-200 hover:border-teal-300 hover:bg-teal-50/10'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className={`p-2.5 rounded-lg border transition-colors ${activeCabinet === 'narrative' ? 'bg-teal-100 text-teal-700 border-teal-200' : 'bg-slate-50 text-slate-500 border-slate-100 group-hover:bg-teal-50 group-hover:text-teal-600'}`}>
                  <GitBranch className="h-5 w-5" />
                </div>
                <span className="font-mono text-[9px] uppercase font-bold text-slate-400">Section 01</span>
              </div>
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm group-hover:text-teal-800 transition-colors">Game Narrative Design</h3>
                <p className="text-xs text-slate-500 mt-1">Branching story engines and quest flowchart visual maps.</p>
              </div>
            </button>

            <button
              onClick={() => setActiveCabinet('writing')}
              className={`text-left p-5 rounded-xl border transition-all duration-300 shadow-xs flex flex-col justify-between space-y-4 cursor-pointer group ${
                activeCabinet === 'writing'
                  ? 'bg-gradient-to-br from-purple-50/80 via-white to-pink-50/30 border-purple-500 ring-4 ring-purple-100/65 shadow-md scale-[1.01]'
                  : 'bg-white/80 border-slate-200 hover:border-purple-300 hover:bg-purple-50/10'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className={`p-2.5 rounded-lg border transition-colors ${activeCabinet === 'writing' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-500 border-slate-100 group-hover:bg-purple-50 group-hover:text-purple-600'}`}>
                  <FileText className="h-5 w-5" />
                </div>
                <span className="font-mono text-[9px] uppercase font-bold text-slate-400">Section 02</span>
              </div>
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm group-hover:text-purple-800 transition-colors">Sample Writing</h3>
                <p className="text-xs text-slate-500 mt-1">Creative screenplays, lore world bibles, and NPC barks.</p>
              </div>
            </button>

            <button
              onClick={() => setActiveCabinet('certificates')}
              className={`text-left p-5 rounded-xl border transition-all duration-300 shadow-xs flex flex-col justify-between space-y-4 cursor-pointer group ${
                activeCabinet === 'certificates'
                  ? 'bg-gradient-to-br from-amber-50/80 via-white to-orange-50/30 border-amber-500 ring-4 ring-amber-100/65 shadow-md scale-[1.01]'
                  : 'bg-white/80 border-slate-200 hover:border-amber-300 hover:bg-amber-50/10'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className={`p-2.5 rounded-lg border transition-colors ${activeCabinet === 'certificates' ? 'bg-amber-100 text-amber-700 border-amber-250' : 'bg-slate-50 text-slate-500 border-slate-100 group-hover:bg-amber-50 group-hover:text-amber-600'}`}>
                  <Award className="h-5 w-5" />
                </div>
                <span className="font-mono text-[9px] uppercase font-bold text-slate-400">Section 03</span>
              </div>
              <div>
                <h3 className="font-sans font-bold text-slate-805 text-sm group-hover:text-amber-800 transition-colors">Certificates</h3>
                <p className="text-xs text-slate-500 mt-1">Accredited certifications, course badges, and credentials.</p>
              </div>
            </button>

          </div>

          {/* ACTIVE VIEW CABINET DOOR CONTAINER */}
          <div className={`bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 sm:p-8 min-h-[400px] shadow-sm relative transition-all duration-500 border-t-4 ${
            activeCabinet === 'narrative' ? 'border-t-teal-500 shadow-teal-500/5' :
            activeCabinet === 'writing' ? 'border-t-purple-500 shadow-purple-500/5' :
            'border-t-amber-500 shadow-amber-500/5'
          }`}>
            {activeCabinet === 'narrative' && (
              <GameNarrativeDesign />
            )}

            {activeCabinet === 'writing' && (
              <WritingSamples />
            )}

            {activeCabinet === 'certificates' && (
              <Certificates />
            )}
          </div>

        </section>


        {/* PHILOSOPHY SECTION */}
        <section id="philosophy" className="bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Technical Principles
            </span>
            <h3 className="text-xl font-sans font-bold text-slate-800 tracking-tight mt-1">
              My Narrative Creation Philosophy
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-4 md:pt-0 md:px-4 space-y-1 hover:translate-x-1 transition-transform">
              <span className="text-teal-600 font-mono text-xs font-bold block">01 / Agency over Static Text</span>
              <h5 className="font-sans font-bold text-slate-700">Decisions Move Players</h5>
              <p className="text-xs text-slate-500 leading-relaxed font-serif">
                A choice must carry weight. Branches should force re-evaluation of characters, resources, or narrative safety guidelines.
              </p>
            </div>

            <div className="pt-4 md:pt-0 md:px-4 space-y-1 hover:translate-x-1 transition-transform">
              <span className="text-purple-600 font-mono text-xs font-bold block">02 / Immersive Dynamic Barks</span>
              <h5 className="font-sans font-bold text-slate-700">Reactive Ambient Dialogues</h5>
              <p className="text-xs text-slate-500 leading-relaxed font-serif">
                System barks must align directly with active gameplay scripts. Changing weather, stealth alerts, or companion relationships should trigger unique spoken variants.
              </p>
            </div>

            <div className="pt-4 md:pt-0 md:px-4 space-y-1 hover:translate-x-1 transition-transform">
              <span className="text-amber-600 font-mono text-xs font-bold block">03 / Polished Layout Copy</span>
              <h5 className="font-sans font-bold text-slate-700">Readability is King</h5>
              <p className="text-xs text-slate-500 leading-relaxed font-serif">
                Formatting screenplay scripts, world guides, or content outlines neatly ensures level designers, voice actors, and readers engage deeply.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Design */}
      <footer className="bg-white border-t border-slate-200 px-4 sm:px-8 py-10 text-center space-y-4">
        <p className="text-xs font-mono text-slate-500">
          Handcrafted by {PORTFOLIO_INFO.name} &copy; 2026. All Content & Design Rights Reserved.
        </p>
        <div className="flex justify-center gap-4 text-xs font-mono text-slate-400">
          <button onClick={() => setShowContactModal(true)} className="hover:text-indigo-600 transition">Email Me</button>
          <span>&middot;</span>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition">GitHub Profile</a>
          <span>&middot;</span>
          <span className="text-slate-400">Created in AI Studio Slate Theme</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-[9.5px] font-mono text-slate-400">
          <span>Active Client Sandbox Secured</span>
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/80 hover:scale-105 transition-transform" />
        </div>
      </footer>

      {/* Contact Modal Panel */}
      {showContactModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl max-w-md w-full animate-scaleUp">
            
            {/* Header */}
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-150 flex justify-between items-center">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                GET IN TOUCH
              </span>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-slate-650 font-sans"
              >
                Close &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSendMessage} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 block">Your Contact Name / Studio</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BioWare Narratives"
                  className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-505 block">Message Subject</label>
                <input
                  type="text"
                  required
                  value={contactSubject}
                  onChange={e => setContactSubject(e.target.value)}
                  placeholder="e.g. Design Collaboration Request"
                  className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 block">Collaboration Details</label>
                <textarea
                  required
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  placeholder="Hello Arezoo, I saw your portfolio and would love to collaborate..."
                  rows={4}
                  className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 text-slate-800"
                />
              </div>

              {sentStatus ? (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-2 text-center rounded text-xs font-mono uppercase">
                  ✓ Dispatching message...
                </div>
              ) : (
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="px-4 py-2 text-xs font-mono rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-mono rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" />
                    Send Brief
                  </button>
                </div>
              )}
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
