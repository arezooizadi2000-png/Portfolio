import { useState, useEffect, FormEvent, MouseEvent } from 'react';
import { INITIAL_CERTIFICATES } from '../data';
import { Certificate } from '../types';
import { Award, ShieldCheck, Bookmark, Calendar, X, PlusCircle, Trash2, Check, FileText } from 'lucide-react';

export default function Certificates() {
  const [certs, setCerts] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('arezoo_certs');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [highlight, setHighlight] = useState('');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    localStorage.setItem('arezoo_certs', JSON.stringify(certs));
  }, [certs]);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !issuer) return;

    const newCert: Certificate = {
      id: "cert_" + Date.now(),
      title,
      issuer,
      issueDate: issueDate || "June 2026",
      highlight: highlight || "Recognized for top tier industry implementation",
      skills: skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : ["Narrative Systems"],
      description: description || "Professional narrative certification."
    };

    setCerts(prev => [...prev, newCert]);
    setShowAddForm(false);
    
    // Clear fields
    setTitle('');
    setIssuer('');
    setIssueDate('');
    setHighlight('');
    setSkills('');
    setDescription('');
  };

  const handleDelete = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this certificate?")) {
      setCerts(prev => prev.filter(c => c.id !== id));
      if (activeCert?.id === id) {
        setActiveCert(null);
      }
    }
  };

  return (
    <div id="certificates-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Professional Verification Desk
          </span>
          <h3 className="text-2xl font-sans font-semibold text-slate-800 tracking-tight mt-1">
            Certications & Credentials
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Publish your credentials and verify certifications.
          </p>
        </div>

        <button
          id="toggle-add-cert-form"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          {showAddForm ? "Hide Creator Panel" : "Add Certificate"}
        </button>
      </div>

      {/* Creation form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm animate-fadeIn">
          <h4 className="text-sm font-mono font-bold text-slate-705 flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            NEW CREDENTIAL PROFILE
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 block">Certificate Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Advanced Game Writing Mastery"
                className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50 text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 block">Issuing Authority *</label>
              <input
                type="text"
                required
                value={issuer}
                onChange={e => setIssuer(e.target.value)}
                placeholder="e.g. Narrative Design Institute"
                className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50 text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 block">Completion Date</label>
              <input
                type="text"
                value={issueDate}
                onChange={e => setIssueDate(e.target.value)}
                placeholder="e.g. September 2025"
                className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50 text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 block">Dean's Highlight Recommendation (Short citation)</label>
              <input
                type="text"
                value={highlight}
                onChange={e => setHighlight(e.target.value)}
                placeholder="e.g. Graduated with Honors in branching storyline structures"
                className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50 text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 block">Skills Covered (Comma-separated list)</label>
              <input
                type="text"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="e.g. Dialogue Trees, Unity integration, Scripting logic"
                className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50 text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-500 block">Detailed Syllabus Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Covered branching state variables, managing dialogue overhead, character arcs, etc."
              rows={3}
              className="w-full px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50 text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-mono rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-mono rounded bg-amber-500 hover:bg-amber-600 text-white transition font-bold"
            >
              Save Certificate
            </button>
          </div>
        </form>
      )}

      {/* Grid displays */}
      {certs.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-xl p-10 text-center space-y-3">
          <Award className="h-10 w-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-sans font-semibold text-slate-700">No certificates added yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            This section is empty. Use the <strong>Add Certificate</strong> button to input your verified qualifications, course details, and titles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map(cert => (
            <div
              key={cert.id}
              onClick={() => setActiveCert(cert)}
              className="group cursor-pointer bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-5 sm:p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                    <Award className="h-5 w-5" />
                  </div>
                  <button
                    onClick={(e) => handleDelete(cert.id, e)}
                    className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-50 transition"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-sm font-sans font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                    {cert.title}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400">
                    {cert.issuer}
                  </p>
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-serif">
                  {cert.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex flex-wrap gap-1">
                  {cert.skills.slice(0, 2).map((skill, idx) => (
                    <span key={idx} className="text-[9px] font-mono text-slate-600 bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                  {cert.skills.length > 2 && (
                    <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                      +{cert.skills.length - 2} more
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    {cert.issueDate}
                  </span>
                  <span className="text-amber-600 font-bold">
                    View Details &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Focus Modal Overlay */}
      {activeCert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl max-w-lg w-full animate-scaleUp">
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-150 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-mono text-slate-500 font-bold tracking-wider uppercase">
                  VERIFICATION DETAILS
                </span>
              </div>
              <button
                id="modal-close"
                onClick={() => setActiveCert(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[9px] font-mono font-bold text-amber-600 uppercase tracking-widest">
                  {activeCert.issuer}
                </span>
                <h3 className="text-lg font-sans font-bold text-slate-800 mt-0.5">
                  {activeCert.title}
                </h3>
              </div>

              {activeCert.highlight && (
                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg">
                  <h5 className="text-[10px] uppercase font-mono tracking-wider text-amber-700 font-bold flex items-center gap-1.5">
                    <Bookmark className="h-3.5 w-3.5" />
                    Citation / Spotlight
                  </h5>
                  <p className="text-xs text-slate-600 font-serif mt-1 italic">
                    "{activeCert.highlight}"
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <h5 className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Core Skills & Topics
                </h5>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {activeCert.skills.map((skill, idx) => (
                    <span key={idx} className="flex items-center gap-1 bg-slate-50 text-slate-600 border border-slate-150 px-2 py-0.5 rounded text-[11px]">
                      <Check className="h-3 w-3 text-amber-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <h5 className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Description / Syllabus
                </h5>
                <p className="text-slate-600 font-serif leading-relaxed">
                  {activeCert.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <div>
                  <span className="block text-[8px] text-slate-400">CREATOR LOGS:</span>
                  <span className="text-[9.5px] text-slate-600 font-semibold">{activeCert.id}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-405">COMPLETED ON:</span>
                  <span className="text-[9.5px] text-slate-600 font-semibold">{activeCert.issueDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-150 flex justify-end">
              <button
                onClick={() => setActiveCert(null)}
                className="px-4 py-2 text-xs font-mono rounded bg-amber-550 bg-amber-600 text-white hover:bg-amber-750 transition"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
