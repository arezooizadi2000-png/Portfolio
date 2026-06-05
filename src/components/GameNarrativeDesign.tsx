import { useState, useEffect, FormEvent } from 'react';
import { DEFAULT_BRANCHING_STORY, INITIAL_QUEST_NODES, INITIAL_QUEST_CONNECTIONS } from '../data';
import { DialogNode, QuestNode, QuestConnection, GameVariableState } from '../types';
import { GitBranch, Compass, Sparkles, RefreshCw, PlusCircle, Trash2, Code, ShieldCheck, Activity, Terminal } from 'lucide-react';

export default function GameNarrativeDesign() {
  const [activeSubTab, setActiveSubTab] = useState<'dialogue' | 'quests'>('dialogue');

  // ==========================================
  // BRANCHING DIALOGUE ENGINE STATE & HANDLERS
  // ==========================================
  const [storyNodes, setStoryNodes] = useState<{ [key: string]: DialogNode }>(() => {
    const saved = localStorage.getItem('arezoo_dialogue_nodes');
    return saved ? JSON.parse(saved) : DEFAULT_BRANCHING_STORY;
  });

  const [currentNodeId, setCurrentNodeId] = useState<string>("start");
  const [variables, setVariables] = useState<GameVariableState>({ score: 0, tension: 10 });
  const [showNodeForm, setShowNodeForm] = useState(false);

  // Dialogue Node fields
  const [nodeId, setNodeId] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [text, setText] = useState('');
  const [choice1Text, setChoice1Text] = useState('');
  const [choice1Next, setChoice1Next] = useState('');
  const [choice2Text, setChoice2Text] = useState('');
  const [choice2Next, setChoice2Next] = useState('');

  useEffect(() => {
    localStorage.setItem('arezoo_dialogue_nodes', JSON.stringify(storyNodes));
  }, [storyNodes]);

  const handleCreateNode = (e: FormEvent) => {
    e.preventDefault();
    if (!nodeId || !speaker || !text) return;

    const choices = [];
    if (choice1Text && choice1Next) {
      choices.push({ text: choice1Text, nextId: choice1Next });
    }
    if (choice2Text && choice2Next) {
      choices.push({ text: choice2Text, nextId: choice2Next });
    }

    // fallback choice if none
    if (choices.length === 0) {
      choices.push({ text: "Add choice to start dialogue...", nextId: "start" });
    }

    const newNode: DialogNode = {
      id: nodeId.trim(),
      speaker: speaker.trim(),
      text: text.trim(),
      choices
    };

    setStoryNodes(prev => ({
      ...prev,
      [newNode.id]: newNode
    }));

    setShowNodeForm(false);
    setNodeId('');
    setSpeaker('');
    setText('');
    setChoice1Text('');
    setChoice1Next('');
    setChoice2Text('');
    setChoice2Next('');
  };

  const handleChoice = (nextId: string, variableChanges?: { [key: string]: any }) => {
    if (variableChanges?.reset) {
      setVariables({ score: 0, tension: 10 });
      setCurrentNodeId("start");
      return;
    }

    if (variableChanges) {
      setVariables(prev => {
        const next = { ...prev };
        Object.keys(variableChanges).forEach(k => {
          next[k] = (next[k] || 0) + variableChanges[k];
        });
        return next;
      });
    }

    if (storyNodes[nextId]) {
      setCurrentNodeId(nextId);
    } else {
      alert(`Target node ID "${nextId}" is not defined yet. Use the Creator Panel below to map this path!`);
    }
  };

  const handleResetStory = () => {
    if (confirm("Reset dialogue tree back to default starting configuration?")) {
      setStoryNodes(DEFAULT_BRANCHING_STORY);
      setCurrentNodeId("start");
      setVariables({ score: 0, tension: 10 });
    }
  };

  const currentNode = storyNodes[currentNodeId] || storyNodes["start"] || DEFAULT_BRANCHING_STORY["start"];

  // ==========================================
  // QUEST SYSTEM ARCHITECTURE STATE & HANDLERS
  // ==========================================
  const [questNodes, setQuestNodes] = useState<QuestNode[]>(() => {
    const saved = localStorage.getItem('arezoo_quest_nodes');
    return saved ? JSON.parse(saved) : INITIAL_QUEST_NODES;
  });

  const [questConns, setQuestConns] = useState<QuestConnection[]>(() => {
    const saved = localStorage.getItem('arezoo_quest_conns');
    return saved ? JSON.parse(saved) : INITIAL_QUEST_CONNECTIONS;
  });

  const [selectedQuestId, setSelectedQuestId] = useState<string>('');
  const [showQuestForm, setShowQuestForm] = useState(false);

  // Quest Form fields
  const [qId, setQId] = useState('');
  const [qTitle, setQTitle] = useState('');
  const [qType, setQType] = useState<'start' | 'core' | 'choice' | 'outcome-good' | 'outcome-bitter'>('core');
  const [qDesc, setQDesc] = useState('');
  const [qLore, setQLore] = useState('');
  const [connectedTo, setConnectedTo] = useState(''); // Simple single destination flow helper

  useEffect(() => {
    localStorage.setItem('arezoo_quest_nodes', JSON.stringify(questNodes));
    localStorage.setItem('arezoo_quest_conns', JSON.stringify(questConns));
    if (questNodes.length > 0 && !selectedQuestId) {
      setSelectedQuestId(questNodes[0].id);
    }
  }, [questNodes, questConns]);

  const handleCreateQuest = (e: FormEvent) => {
    e.preventDefault();
    if (!qId || !qTitle) return;

    // Calculate grid layout position dynamically so they align visually side by side
    const nodeCount = questNodes.length;
    const x = 100 + (nodeCount * 170) % 900;
    const y = 80 + (Math.floor(nodeCount / 5) * 110);

    const newQuest: QuestNode = {
      id: qId.trim(),
      title: qTitle.trim(),
      type: qType,
      description: qDesc.trim() || 'No active objective requirements input.',
      questLore: qLore.trim() || 'Undocumented lore parameters.',
      x,
      y
    };

    setQuestNodes(prev => [...prev, newQuest]);
    setSelectedQuestId(newQuest.id);

    if (connectedTo.trim()) {
      const newConn: QuestConnection = {
        from: qId.trim(),
        to: connectedTo.trim(),
        label: qType === 'choice' ? 'Choice Junction' : 'Next Step'
      };
      setQuestConns(prev => [...prev, newConn]);
    }

    setShowQuestForm(false);
    setQId('');
    setQTitle('');
    setQDesc('');
    setQLore('');
    setConnectedTo('');
  };

  const handleClearQuests = () => {
    if (confirm("Clear all quest design blueprints?")) {
      setQuestNodes([]);
      setQuestConns([]);
      setSelectedQuestId('');
    }
  };

  const selectedQuestNode = questNodes.find(q => q.id === selectedQuestId);

  return (
    <div id="game-narrative-workspace" className="space-y-6">
      
      {/* Narrative Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Design & Interactive Engineering
          </span>
          <h2 className="text-2xl font-sans font-bold text-slate-800 mt-1">
            Narrative Systems Workbench
          </h2>
          <p className="text-xs text-slate-500">
            Prototype choice scripts, dialogue node arrays, and dynamic quest maps.
          </p>
        </div>

        {/* Sub-tab view buttons */}
        <div className="flex gap-1 bg-slate-150 p-1.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveSubTab('dialogue')}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
              activeSubTab === 'dialogue'
                ? 'bg-white text-slate-800 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <GitBranch className="h-3.5 w-3.5 inline mr-1.5" />
            Dialogue Tree Simulator
          </button>
          <button
            onClick={() => setActiveSubTab('quests')}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
              activeSubTab === 'quests'
                ? 'bg-white text-slate-800 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="h-3.5 w-3.5 inline mr-1.5" />
            Quest Diagrammer
          </button>
        </div>
      </div>

      {activeSubTab === 'dialogue' ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Main simulator widget */}
          <div className="bg-white/70 backdrop-blur-md border border-indigo-100/60 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 hover:shadow-md transition-shadow duration-300">
            
            {/* Left Column dialogue view */}
            <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between min-h-[380px] border-b lg:border-b-0 lg:border-r border-slate-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full font-bold">
                      Node: {currentNode.id}
                    </span>
                    <h4 className="text-sm font-sans font-bold text-slate-400 mt-1">
                      ACTIVE DIALOGUE PREVIEW
                    </h4>
                  </div>

                  <button
                    onClick={() => handleChoice("start", { reset: true })}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-teal-600 text-xs font-mono transition-colors cursor-pointer"
                    title="Reset story simulator"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset
                  </button>
                </div>

                {/* Substantive Dialogue Display */}
                <div className="bg-gradient-to-r from-teal-50/80 via-teal-50/40 to-cyan-50/20 border border-teal-200/80 p-6 rounded-xl relative overflow-hidden shadow-xs">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-teal-500 to-cyan-400" />
                  <div className="space-y-1 pl-2">
                    <span className="font-mono text-xs font-bold text-teal-800 uppercase tracking-widest bg-white/70 px-2.5 py-0.5 rounded-md border border-teal-200/40 inline-block shadow-2xs">
                      {currentNode.speaker}
                    </span>
                    <p className="text-slate-700 font-serif leading-relaxed text-base pt-2">
                      {currentNode.text}
                    </p>
                  </div>
                </div>
              </div>

              {/* Player Choices selection */}
              <div className="mt-8 space-y-2.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">
                  Interactive Choice Deciders:
                </span>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {currentNode.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChoice(choice.nextId, choice.variableChanges)}
                      className="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-cyan-50/30 hover:border-teal-400 hover:shadow-md hover:shadow-teal-100/40 transition-all duration-300 flex items-start gap-3.5 text-xs text-slate-705 hover:text-teal-950 group cursor-pointer"
                    >
                      <span className="h-6.5 w-6.5 rounded-full border border-slate-200 flex items-center justify-center text-xs font-mono font-bold bg-slate-50 text-slate-500 group-hover:bg-gradient-to-tr group-hover:from-teal-505 group-hover:to-teal-500 group-hover:border-teal-400 group-hover:text-white shrink-0 shadow-2xs transition-all duration-200">
                        {idx + 1}
                      </span>
                      <span className="leading-snug pt-1 font-sans font-medium">
                        {choice.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column variables panel */}
            <div className="lg:col-span-4 p-6 bg-slate-50/80 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h5 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold flex items-center gap-1.5 pb-2 border-b border-indigo-100">
                  <Activity className="h-3.5 w-3.5 text-teal-650" />
                  NARRATIVE STATE VARS
                </h5>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-teal-100/60 shadow-2xs rounded-xl">
                    <span className="block text-[9px] font-mono text-teal-600 uppercase font-bold">Interactive Score</span>
                    <span className="text-xl font-mono font-extrabold text-teal-700 block mt-1">
                      {variables.score || 0} pts
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-indigo-100/60 shadow-2xs rounded-xl">
                    <span className="block text-[9px] font-mono text-indigo-505 uppercase font-bold">Global Tension</span>
                    <span className="text-xl font-mono font-extrabold text-indigo-700 block mt-1">
                      {variables.tension || 0}%
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-indigo-50 p-3.5 text-xs text-slate-505 leading-normal space-y-2 font-sans rounded-xl shadow-2xs">
                  <h6 className="font-bold text-slate-700 uppercase premium-text text-[9px] font-mono tracking-wider">Nodes Catalog:</h6>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(storyNodes).map(nodeKey => (
                      <span key={nodeKey} className="text-[9px] font-mono bg-teal-50/50 text-teal-700 px-2 py-0.5 rounded border border-teal-100 font-bold transition-all hover:bg-teal-50">
                        {nodeKey}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setShowNodeForm(!showNodeForm)}
                  className="w-full py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-705 cursor-pointer hover:shadow-md transition-all duration-300 font-mono text-xs font-bold"
                >
                  {showNodeForm ? "Close Creator" : "Create Dialogue Node"}
                </button>
                <button
                  onClick={handleResetStory}
                  className="w-full py-2.5 bg-white text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg hover:border-rose-200 cursor-pointer transition font-mono text-[11px]"
                >
                  Wipe to Default Nodes
                </button>
              </div>
            </div>
          </div>

          {/* Form for new Story nodes */}
          {showNodeForm && (
            <form onSubmit={handleCreateNode} className="bg-white border border-slate-250 p-5 sm:p-6 rounded-xl space-y-4 animate-fadeIn">
              <h4 className="text-sm font-mono font-bold text-slate-755 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <GitBranch className="h-4 w-4 text-teal-600" />
                CREATE PATHWAY NODE
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-500 block">Unique Node ID *</label>
                  <input
                    type="text"
                    required
                    value={nodeId}
                    onChange={e => setNodeId(e.target.value)}
                    placeholder="e.g. final_victory (no spaces)"
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-slate-50 text-slate-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-500 block">Speaking Character Name *</label>
                  <input
                    type="text"
                    required
                    value={speaker}
                    onChange={e => setSpeaker(e.target.value)}
                    placeholder="e.g. DECKARD"
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-slate-50 text-slate-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-405 block">Scene Prompt / Focus</label>
                  <span className="text-[9.5px] font-mono text-slate-400">Speaker expression indicators</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 block">Dialogue Content body *</label>
                <textarea
                  required
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Input character's dramatic spoken text here..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-slate-50 text-slate-850 font-serif"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-2 border-r border-slate-100 pr-4">
                  <span className="text-[11px] font-mono font-bold text-slate-600 block">CHOICE BRACKET A</span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={choice1Text}
                      onChange={e => setChoice1Text(e.target.value)}
                      placeholder="Display Selection Text (e.g. Grab the keys)"
                      className="w-full px-3 py-2 text-xs rounded border border-slate-200 bg-slate-50"
                    />
                    <input
                      type="text"
                      value={choice1Next}
                      onChange={e => setChoice1Next(e.target.value)}
                      placeholder="Destination ID (e.g. choice1_success)"
                      className="w-full px-3 py-2 text-xs font-mono rounded border border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold text-slate-600 block">CHOICE BRACKET B (Optional)</span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={choice2Text}
                      onChange={e => setChoice2Text(e.target.value)}
                      placeholder="Display Selection Text"
                      className="w-full px-3 py-2 text-xs rounded border border-slate-200 bg-slate-50"
                    />
                    <input
                      type="text"
                      value={choice2Next}
                      onChange={e => setChoice2Next(e.target.value)}
                      placeholder="Destination ID"
                      className="w-full px-3 py-2 text-xs font-mono rounded border border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNodeForm(false)}
                  className="px-4 py-2 text-xs font-mono rounded bg-slate-150 text-slate-600 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono rounded bg-teal-600 hover:bg-teal-700 text-white font-bold transition"
                >
                  Compile Dialogue Node
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        // Quest flow module
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Visual board map */}
            <div className="xl:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between overflow-x-auto">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                      SYSTEMIC ROADMAP VIEWPORT
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Graph visual flow representing connections below. Click any node to open the inspector details.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowQuestForm(!showQuestForm)}
                      className="border border-slate-200 hover:bg-slate-50 text-[11px] font-mono px-3 py-1.5 rounded transition flex items-center gap-1.5 text-slate-700"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add Node
                    </button>
                    <button
                      onClick={handleClearQuests}
                      className="border border-slate-205 hover:bg-rose-50 hover:text-rose-600 text-[11px] font-mono px-3 py-1.5 rounded transition text-slate-400"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* SVG Quest Canvas */}
                {questNodes.length === 0 ? (
                  <div className="h-64 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-center space-y-2 select-none">
                    <Compass className="h-8 w-8 text-slate-300" />
                    <span className="text-xs text-slate-400 font-sans font-semibold">No quest steps plotted yet.</span>
                    <p className="text-[10px] text-slate-400 max-w-sm">Use the <strong>Add Node</strong> interface to draw your starting point and core quest variables dynamically.</p>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl border border-slate-150 p-4 overflow-x-auto min-w-[650px] relative">
                    <svg viewBox="0 0 1000 240" className="w-full max-w-[900px] h-auto">
                      
                      {/* Arrow Mark definition */}
                      <defs>
                        <marker
                          id="arrow"
                          viewBox="0 0 10 10"
                          refX="33"
                          refY="5"
                          markerWidth="6"
                          markerHeight="6"
                          orient="auto-start-reverse"
                        >
                          <path d="M 0 1 L 10 5 L 0 9 z" className="fill-indigo-400" />
                        </marker>
                      </defs>

                      {/* Connections draw */}
                      {questConns.map((conn, idx) => {
                        const fromNode = questNodes.find(n => n.id === conn.from);
                        const toNode = questNodes.find(n => n.id === conn.to);
                        if (!fromNode || !toNode) return null;

                        const dx = toNode.x - fromNode.x;
                        const pathString = `M ${fromNode.x} ${fromNode.y} C ${fromNode.x + dx/2} ${fromNode.y}, ${toNode.x - dx/2} ${toNode.y}, ${toNode.x} ${toNode.y}`;

                        return (
                          <path
                            key={idx}
                            d={pathString}
                            fill="none"
                            className="stroke-indigo-200 hover:stroke-indigo-400 stroke-[2px] transition-all"
                            markerEnd="url(#arrow)"
                          />
                        );
                      })}

                      {/* Nodes draw */}
                      {questNodes.map(node => {
                        const isSelected = selectedQuestId === node.id;
                        
                        let nodeFillColor = "fill-white";
                        let nodeBorderColor = isSelected ? "stroke-indigo-505 stroke-[2px]" : "stroke-slate-200 stroke-[1.5px]";
                        let idColor = "fill-slate-700";
                        
                        if (node.type === 'start') {
                          nodeFillColor = isSelected ? "fill-teal-100" : "fill-teal-50/80";
                          nodeBorderColor = isSelected ? "stroke-teal-555 stroke-[2px]" : "stroke-teal-300";
                          idColor = "fill-teal-800";
                        } else if (node.type === 'choice') {
                          nodeFillColor = isSelected ? "fill-purple-100" : "fill-purple-50/80";
                          nodeBorderColor = isSelected ? "stroke-purple-555 stroke-[2px]" : "stroke-purple-300";
                          idColor = "fill-purple-800";
                        } else if (node.type === 'outcome-good') {
                          nodeFillColor = isSelected ? "fill-amber-100" : "fill-amber-50/80";
                          nodeBorderColor = isSelected ? "stroke-amber-555 stroke-[2px]" : "stroke-amber-400";
                          idColor = "fill-amber-800";
                        } else if (node.type === 'outcome-bitter') {
                          nodeFillColor = isSelected ? "fill-rose-100" : "fill-rose-50/80";
                          nodeBorderColor = isSelected ? "stroke-rose-555 stroke-[2px]" : "stroke-rose-400";
                          idColor = "fill-rose-800";
                        } else if (node.type === 'core') {
                          nodeFillColor = isSelected ? "fill-blue-100" : "fill-blue-50/80";
                          nodeBorderColor = isSelected ? "stroke-blue-555 stroke-[2px]" : "stroke-blue-400";
                          idColor = "fill-blue-800";
                        }

                        return (
                          <g
                            key={node.id}
                            transform={`translate(${node.x}, ${node.y - 45})`}
                            onClick={() => setSelectedQuestId(node.id)}
                            className="cursor-pointer"
                          >
                            <rect
                              x="-65"
                              y="-20"
                              width="130"
                              height="40"
                              rx="8"
                              className={`transition-all duration-300 ${nodeFillColor} ${nodeBorderColor} filter hover:drop-shadow-sm`}
                            />
                            <text
                              x="0"
                              y="-3"
                              textAnchor="middle"
                              className={`font-mono text-[9px] font-extrabold tracking-wider ${idColor}`}
                            >
                              {node.id.toUpperCase()}
                            </text>
                            <text
                              x="0"
                              y="10"
                              textAnchor="middle"
                              className="font-sans text-[9px] font-medium fill-slate-600"
                            >
                              {node.title.length > 18 ? node.title.substring(0, 16) + '...' : node.title}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Plotted milestones: {questNodes.length}</span>
                <span>Coordinates system updates in real-time.</span>
              </div>
            </div>

            {/* Quest Details Inspection */}
            <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm min-h-[300px]">
              {selectedQuestNode ? (
                <div className="p-5 space-y-4">
                  <div className="bg-slate-50 border-b border-slate-150 p-4 -m-5 mb-3 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                      {selectedQuestNode.type} Node
                    </span>
                    <button
                      onClick={() => {
                        setQuestNodes(prev => prev.filter(q => q.id !== selectedQuestId));
                        setQuestConns(prev => prev.filter(c => c.from !== selectedQuestId && c.to !== selectedQuestId));
                        setSelectedQuestId('');
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-100 transition"
                      title="Delete Node"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">
                      Quest Key title
                    </h5>
                    <h4 className="text-sm font-sans font-bold text-slate-800">
                      {selectedQuestNode.title}
                    </h4>
                  </div>

                  <div className="space-y-1 bg-slate-50 border border-slate-100 p-2.5 rounded text-xs leading-relaxed">
                    <h5 className="text-[9px] font-mono tracking-wider text-slate-400 uppercase pb-1">
                      Objective Guidelines Text
                    </h5>
                    <p className="text-slate-650 font-serif">
                      {selectedQuestNode.description}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <h5 className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">
                      Underlying State / Conditions
                    </h5>
                    <p className="text-slate-550 leading-relaxed font-sans">
                      {selectedQuestNode.questLore}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 flex flex-col items-center justify-center space-y-2 font-sans h-full">
                  <Compass className="h-6 w-6 text-slate-300" />
                  <p className="text-xs">Select any charted milestone circle on the left map to inspect data.</p>
                </div>
              )}

              <div className="bg-slate-50 px-4 py-3 border-t border-slate-150 text-[11px] text-slate-500">
                🖲️ Click nodes on the visual map to trace connections directly in the viewport.
              </div>
            </div>
          </div>

          {/* Form for new Quest nodes */}
          {showQuestForm && (
            <form onSubmit={handleCreateQuest} className="bg-white border border-slate-205 p-5 sm:p-6 rounded-xl space-y-4 animate-fadeIn">
              <h4 className="text-sm font-mono font-bold text-slate-755 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Compass className="h-4 w-4 text-indigo-600" />
                PLOT QUEST METRIC CARD
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[11px] font-mono text-slate-500 block">Unique Node ID * (e.g. q1_start)</label>
                  <input
                    type="text"
                    required
                    value={qId}
                    onChange={e => setQId(e.target.value)}
                    placeholder="q1_infiltration"
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 bg-slate-50 text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-500 block">Junction Type</label>
                  <select
                    value={qType}
                    onChange={e => setQType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-205 bg-slate-50 text-slate-800"
                  >
                    <option value="start">Entry / Hook</option>
                    <option value="core">Main Objective Path</option>
                    <option value="choice">Choice Fork</option>
                    <option value="outcome-good">Happy Resolution Ending</option>
                    <option value="outcome-bitter">Sober / Bitter Ending</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-500 block">Establish Flow Linkage (Optional)</label>
                  <input
                    type="text"
                    value={connectedTo}
                    onChange={e => setConnectedTo(e.target.value)}
                    placeholder="Connect to ID (e.g. q1_success)"
                    className="w-full px-3 py-2 text-xs font-mono rounded border border-slate-200 bg-slate-50 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-500 block">Step Headline Name *</label>
                  <input
                    type="text"
                    required
                    value={qTitle}
                    onChange={e => setQTitle(e.target.value)}
                    placeholder="e.g. Bribe loading bay guards"
                    className="w-full px-3 py-2 text-xs rounded border border-slate-205 bg-slate-50 text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-550 block">Instructional Goals Text (for player)</label>
                  <input
                    type="text"
                    value={qDesc}
                    onChange={e => setQDesc(e.target.value)}
                    placeholder="e.g. Locate the physical security database terminal on Level 3."
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 bg-slate-50 text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 block">Underlying State Variables or Logic triggers schema</label>
                <textarea
                  value={qLore}
                  onChange={e => setQLore(e.target.value)}
                  placeholder="e.g. Requires: player_has_lockpick; Triggers: global_tension + 15"
                  rows={2}
                  className="w-full px-3 py-2 font-mono text-xs rounded border border-slate-200 bg-slate-50 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuestForm(false)}
                  className="px-4 py-2 text-xs font-mono rounded bg-slate-100 hover:bg-slate-200 text-slate-650 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition"
                >
                  Save & Pluck Node
                </button>
              </div>
            </form>
          )}

        </div>
      )}

    </div>
  );
}
