import { useState, useEffect, FormEvent, MouseEvent } from 'react';
import { INITIAL_WRITING_SAMPLES } from '../data';
import { WritingSample, ScriptLine, LoreSection, BarkRow } from '../types';
import { FileText, BookOpen, MessageSquare, PlusCircle, Trash2, Clock, CheckCircle } from 'lucide-react';

export default function WritingSamples() {
  const [samples, setSamples] = useState<WritingSample[]>(() => {
    const saved = localStorage.getItem('arezoo_writing');
    return saved ? JSON.parse(saved) : INITIAL_WRITING_SAMPLES;
  });

  const [activeTab, setActiveTab] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Screenplay' | 'World Lore' | 'Npc Barks'>('Screenplay');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  
  // Custom Raw Input that we parse
  const [rawText, setRawText] = useState('');

  useEffect(() => {
    localStorage.setItem('arezoo_writing', JSON.stringify(samples));
    if (samples.length > 0 && !activeTab) {
      setActiveTab(samples[0].id);
    }
  }, [samples]);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!title) return;

    let formattedContent: any = {};

    // Basic intuitive parsers for inputted raw content
    if (category === 'Screenplay') {
      // Split lines. Look for lines like "CHARACTER: dialogue" or sluglines like "INT." or descriptions
      const lines = rawText.split('\n').filter(l => l.trim().length > 0);
      const parsedScript: ScriptLine[] = lines.map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('INT.') || trimmed.startsWith('EXT.')) {
          return { type: 'slugline', text: trimmed };
        } else if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
          return { type: 'parenthetical', text: trimmed };
        } else if (trimmed.includes(':')) {
          const colonIdx = trimmed.indexOf(':');
          const character = trimmed.substring(0, colonIdx).trim().toUpperCase();
          const text = trimmed.substring(colonIdx + 1).trim();
          return { type: 'dialogue', character, text };
        } else {
          return { type: 'action', text: trimmed };
        }
      });
      formattedContent = { script: parsedScript };
    } else if (category === 'World Lore') {
      // Create simple LoreSections split by paragraphs
      const sections = rawText.split('\n\n').filter(p => p.trim().length > 0);
      const parsedLore: LoreSection[] = sections.map((sec, idx) => {
        const lines = sec.split('\n').map(l => l.trim()).filter(Boolean);
        const secTitle = lines[0]?.startsWith('#') ? lines[0].replace('#', '').trim() : `Lore Chapter ${idx + 1}`;
        const bodyLines = lines[0]?.startsWith('#') ? lines.slice(1) : lines;
        return {
          title: secTitle,
          body: bodyLines.length > 0 ? bodyLines : [sec]
        };
      });
      formattedContent = { lore: parsedLore };
    } else if (category === 'Npc Barks') {
      // Parse barks: format "TRIGGER_ID | Context description | dialogue text" per line
      const lines = rawText.split('\n').filter(l => l.trim().length > 0);
      const parsedBarks: BarkRow[] = lines.map(line => {
        const parts = line.split('|').map(p => p.trim());
        return {
          trigger: parts[0] || 'ON_GENERIC_INTERACTION',
          context: parts[1] || 'Default fallback state context trigger.',
          dialogue: parts[2] || (parts[0] ? `"${parts[0]} dialogue lines."` : 'No text specified.'),
          variantCount: Math.floor(Math.random() * 3) + 2
        };
      });
      formattedContent = { barks: parsedBarks };
    }

    const newSample: WritingSample = {
      id: "sample_" + Date.now(),
      title,
      category,
      description: description || "Professional narrative layout specimen.",
      genre: genre || "High Concept",
      formattedContent
    };

    setSamples(prev => [...prev, newSample]);
    setActiveTab(newSample.id);
    setShowAddForm(false);

    // Clear form
    setTitle('');
    setGenre('');
    setDescription('');
    setRawText('');
  };

  const handleDelete = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this writing sample?")) {
      setSamples(prev => {
        const remaining = prev.filter(s => s.id !== id);
        if (activeTab === id) {
          setActiveTab(remaining[0]?.id || '');
        }
        return remaining;
      });
    }
  };

  const activeSample = samples.find(s => s.id === activeTab);

  return (
    <div id="writing-samples-cabinet" className="bg-white border border-slate-250 rounded-xl overflow-hidden shadow-sm">
      
      {/* Header Bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            Manuscripts & Samples
          </span>
          <h3 className="text-xl font-sans font-semibold text-slate-800 tracking-tight mt-1">
            Professional Drafting Portfolio
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Display your copyedits, screenplays, World Lore, or game barks.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          {showAddForm ? "Hide Panel" : "Add Writing Sample"}
        </button>
      </div>

      {/* Creation form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-slate-50 p-5 sm:p-6 border-b border-slate-200 space-y-4 animate-fadeIn">
          <h4 className="text-sm font-mono font-bold text-slate-705 flex items-center gap-2">
            <FileText className="h-4 w-4 text-purple-500" />
            CREATE NEW DRAFT MANUSCRIPT
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 block">Sample Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Iron & Salt Screenplay"
                className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white text-slate-850"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 block">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white text-slate-850"
              >
                <option value="Screenplay">Screenplay / Script</option>
                <option value="World Lore">World Lore bible</option>
                <option value="Npc Barks">NPC Bark Database</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 block">Genre / Tone</label>
              <input
                type="text"
                value={genre}
                onChange={e => setGenre(e.target.value)}
                placeholder="e.g. Dark Fantasy Noir"
                className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white text-slate-850"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-500 block">Short Description / Design Goals</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Introduction sequence meant to build dramatic tension using high sensory audio cues"
              className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white text-slate-850"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-mono text-slate-530 block font-semibold">Raw Text Data Entry</label>
              <span className="text-[9.5px] font-mono text-slate-400">
                {category === 'Screenplay' && "Use format: CHARACTER: dialogue line (use INT. for scenes)"}
                {category === 'World Lore' && "Separate paragraphs with double spaces. Starting paragraph with '#' sets header."}
                {category === 'Npc Barks' && "Format: TRIGGER_CODE | Context details | Vocal quotation text (one per line)"}
              </span>
            </div>
            <textarea
              required
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder={
                category === 'Screenplay' ? "INT. SLEAZY BAR - NIGHT\nKALE: What are you searching for?\nLISA: (Whispering) The codes. They are in the vault." :
                category === 'World Lore' ? "# Chapter 1: The Rift\nThe tectonic rift splits the oceanic floor apart.\n\n# Chapter 2: The Core\nNo living pilot has returned from the hot vents." :
                "ON_PATROL_IDLE | Guards on castle ramparts | Fine evening for a stroll, isn't it?\nHEAR_NOISE | Heard rock shatter | Stop right there... Who goes?"
              }
              rows={6}
              className="w-full px-3 py-2 font-mono text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white text-slate-850"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-mono rounded bg-slate-200 text-slate-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-mono rounded bg-purple-600 hover:bg-purple-700 text-white font-bold transition"
            >
              Build Manuscript
            </button>
          </div>
        </form>
      )}

      {/* Tabs list of current values */}
      {samples.length === 0 ? (
        <div className="bg-white border-t border-slate-200 p-12 text-center space-y-3">
          <FileText className="h-10 w-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-sans font-semibold text-slate-700">No writing samples added yet</h4>
          <p className="text-xs text-slate-403 max-w-sm mx-auto">
            You can compose and manage drafts using the <strong>Add Writing Sample</strong> button above. They are safely cached to your local browser!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[400px]">
          {/* Tabs Selector Left Column */}
          <div className="lg:col-span-4 bg-slate-50 border-r border-slate-200 divide-y divide-slate-100 flex flex-col justify-between">
            <div className="p-3 space-y-1 max-h-[400px] overflow-y-auto">
              <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-400 block px-2 mb-2">
                Draft index ({samples.length})
              </span>
              {samples.map(item => {
                const isActive = activeTab === item.id;
                let activeColors = "bg-purple-50/50 border-purple-200 text-purple-700 shadow-xs border font-medium";
                if (item.category === 'Screenplay') activeColors = "bg-rose-50 text-rose-750 border-rose-200 shadow-xs border font-normal";
                if (item.category === 'Npc Barks') activeColors = "bg-teal-50 text-teal-750 border-teal-200 shadow-xs border font-normal";
                
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left p-3 rounded-lg text-xs font-sans transition cursor-pointer flex justify-between items-center ${
                      isActive
                        ? activeColors
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 max-w-[80%]">
                      {item.category === 'Screenplay' && <FileText className="h-3.5 w-3.5 text-rose-500 shrink-0" />}
                      {item.category === 'World Lore' && <BookOpen className="h-3.5 w-3.5 text-purple-500 shrink-0" />}
                      {item.category === 'Npc Barks' && <MessageSquare className="h-3.5 w-3.5 text-teal-500 shrink-0" />}
                      <span className="truncate">{item.title}</span>
                    </div>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-100 transition"
                      title="Delete draft"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-100/40 text-[11px] text-slate-500 space-y-1 font-serif">
              <p>🌱 <strong>Pro Tip:</strong> Pasting script lines formatted with colons automatically creates a high-fidelity visual script block.</p>
            </div>
          </div>

          {/* Tab Content Display Right Panel */}
          <div className="lg:col-span-8 p-6 sm:p-8 bg-white select-text h-[500px] overflow-y-auto">
            {activeSample ? (
              <div className="space-y-6">
                <div>
                  {(() => {
                    let tagStyle = "bg-purple-50 text-purple-700 border-purple-200";
                    let genreStyle = "text-purple-600";
                    if (activeSample.category === 'Screenplay') {
                      tagStyle = "bg-rose-50 text-rose-700 border-rose-200";
                      genreStyle = "text-rose-600";
                    } else if (activeSample.category === 'Npc Barks') {
                      tagStyle = "bg-teal-50 text-teal-700 border-teal-200";
                      genreStyle = "text-teal-600";
                    }
                    return (
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${tagStyle}`}>
                          {activeSample.category}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${genreStyle}`}>
                          Genre: {activeSample.genre}
                        </span>
                      </div>
                    );
                  })()}
                  <h3 className="text-xl font-sans font-bold text-slate-800 tracking-tight mt-1.5 pb-2 border-b border-slate-100">
                    {activeSample.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">
                    <strong>Intent:</strong> {activeSample.description}
                  </p>
                </div>

                {/* Render screenplays */}
                {activeSample.category === 'Screenplay' && activeSample.formattedContent?.script && (
                  <div className="border border-slate-100 p-6 sm:p-8 bg-slate-50 rounded-xl font-mono text-[13px] text-slate-700 space-y-3.5 leading-relaxed max-w-xl shadow-inner">
                    {activeSample.formattedContent.script.map((line, idx) => {
                      if (line.type === 'slugline') {
                        return <div key={idx} className="uppercase font-bold text-slate-900 mt-4">{line.text}</div>;
                      }
                      if (line.type === 'action') {
                        return <div key={idx} className="text-slate-500 font-serif text-[13.5px] italic">{line.text}</div>;
                      }
                      if (line.type === 'parenthetical') {
                        return <div key={idx} className="pl-16 text-slate-400 italic">({line.text.replace(/[()]/g, '')})</div>;
                      }
                      if (line.type === 'dialogue') {
                        return (
                          <div key={idx} className="pl-12 space-y-0.5">
                            <span className="font-bold text-slate-900 text-xs block uppercase tracking-wider">{line.character}</span>
                            <p className="text-slate-700 pl-2 border-l-2 border-slate-200">{line.text}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}

                {/* Render Lore */}
                {activeSample.category === 'World Lore' && activeSample.formattedContent?.lore && (
                  <div className="space-y-6 font-serif max-w-xl text-slate-700">
                    {activeSample.formattedContent.lore.map((sec, sIdx) => (
                      <div key={sIdx} className="space-y-2">
                        <h4 className="text-base font-sans font-bold text-slate-800 flex items-center gap-2 pb-1 border-b border-slate-100">
                          <span className="text-purple-600 text-xs font-mono font-bold">CHAPTER_0{sIdx+1}</span>
                          {sec.title}
                        </h4>
                        {sec.body.map((para, pIdx) => (
                          <p key={pIdx} className="text-xs sm:text-sm leading-relaxed text-justify">
                            {para}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Render NPC Barks */}
                {activeSample.category === 'Npc Barks' && activeSample.formattedContent?.barks && (
                  <div className="overflow-x-auto border border-slate-150 rounded-xl">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 font-mono text-[9px] uppercase tracking-wider border-b border-slate-200">
                          <th className="p-3">Gameplay Signal</th>
                          <th className="p-3">Context Condition</th>
                          <th className="p-3">Dialogue Text Draft</th>
                          <th className="p-3 text-right">Vars</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600 font-sans text-[11px] leading-relaxed">
                        {activeSample.formattedContent.barks.map((bark, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 font-mono text-[10px] text-purple-600 font-bold">
                              {bark.trigger}
                            </td>
                            <td className="p-3 text-[11px] text-slate-500">
                              {bark.context}
                            </td>
                            <td className="p-3 italic text-slate-800 font-serif text-sm">
                              "{bark.dialogue.replace(/"/g, '')}"
                            </td>
                            <td className="p-3 text-right font-mono text-slate-400 text-[10px]/none p-0.5">
                              {bark.variantCount} cols
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2 text-slate-400">
                <FileText className="h-8 w-8 text-slate-300" />
                <p className="text-xs">Select any draft menu item on the left column to view formatted content details.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
}
