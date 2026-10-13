import React, { useState } from 'react';
import { PageId } from '../types/portfolio';
import { SERVICES_DATA } from '../data/portfolioData';
import { Check, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: PageId) => void;
  onPreFillContact?: (serviceSummary: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, onPreFillContact }) => {
  // Interactive Scope Estimator State
  const [selectedServices, setSelectedServices] = useState<string[]>(['brand-identity']);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['custom-type']);
  const [timelineSpeed, setTimelineSpeed] = useState<'standard' | 'rush' | 'relaxed'>('standard');

  const addonOptions = [
    { id: 'custom-type', label: 'Typography & Custom Brand Guidelines', timeWeeks: 1.5 },
    { id: 'packaging-mockup', label: 'Packaging Design & 3D Mockup Design', timeWeeks: 1.5 },
    { id: 'social-kit', label: 'Social Media Graphics & Campaign Templates', timeWeeks: 1 },
    { id: 'motion-ae', label: 'Motion Graphics / Logo Animation (After Effects)', timeWeeks: 1.5 },
    { id: 'ui-ux-figma', label: 'UI/UX Design & Interactive Figma Prototype', timeWeeks: 2 },
  ];

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  // Calculate estimated weeks
  const baseWeeks = selectedServices.length * 4;
  const addonWeeks = selectedAddons.length * 1.5;
  const totalWeeks = Math.max(
    3,
    timelineSpeed === 'rush'
      ? Math.round((baseWeeks + addonWeeks) * 0.7)
      : timelineSpeed === 'relaxed'
      ? Math.round((baseWeeks + addonWeeks) * 1.3)
      : Math.round(baseWeeks + addonWeeks)
  );

  const handleStartInquiry = () => {
    const summary = `Selected Services: ${selectedServices.join(', ')} | Add-ons: ${selectedAddons.join(', ')} | Pace: ${timelineSpeed} (~${totalWeeks} weeks)`;
    if (onPreFillContact) {
      onPreFillContact(summary);
    }
    onNavigate('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-16 space-y-24">
      
      {/* Page Header */}
      <div className="border-b border-orange-500/15 pb-12 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-orange-400 uppercase">
          <span>CAPABILITIES & METHODOLOGY</span>
          <span className="text-stone-600">/</span>
          <span>BRAND & PACKAGING ATELIER</span>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-display font-bold uppercase text-[#ea580c] leading-tight text-glow-orange">
            SERVICES & EXPERTISE
          </h1>
          <p className="text-stone-300 text-sm sm:text-base font-sans mt-3 leading-relaxed">
            I operate with an intentional, craft-led approach. Every project is executed with dedicated focus—marrying structural packaging architecture, editorial typographic rigor, and enduring visual identity systems.
          </p>
        </div>
      </div>

      {/* 3 Core Services in-depth Cards */}
      <div className="space-y-16">
        {SERVICES_DATA.map((srv, idx) => (
          <div
            key={srv.id}
            className="p-8 sm:p-12 rounded bg-[#110e0c] border border-orange-500/20 hover:border-orange-500/40 transition-all space-y-8 relative overflow-hidden"
          >
            {/* Top row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-orange-500/15">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-mono text-orange-500 font-bold">{srv.number}</span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
                  {srv.title}
                </h2>
              </div>
              <div className="text-xs font-mono text-stone-400">
                TIMELINE: <span className="text-orange-400">{srv.timeline}</span>
              </div>
            </div>

            {/* Description & Deliverables */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-4">
                <p className="text-base text-orange-300 font-serif italic">
                  "{srv.tagline}"
                </p>
                <p className="text-sm text-stone-300 font-sans leading-relaxed">
                  {srv.description}
                </p>
                <div className="pt-2 text-xs font-mono text-stone-400">
                  <span className="text-orange-400">IDEAL FOR:</span> {srv.idealFor}
                </div>
              </div>

              <div className="lg:col-span-6 bg-[#16120e] p-6 rounded border border-orange-500/15 space-y-3">
                <span className="text-xs font-mono text-orange-400 uppercase tracking-widest block mb-2">
                  STANDARD DELIVERABLES
                </span>
                <ul className="space-y-2.5">
                  {srv.deliverables.map((del, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2.5 text-xs text-stone-300">
                      <Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* The 4-Phase Creative Orbit Process */}
      <div className="space-y-10 border-t border-orange-500/15 pt-16">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono tracking-[0.25em] text-orange-400 uppercase">THE CREATIVE PROCESS</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            FOUR STAGES OF ORBIT
          </h2>
          <p className="text-xs text-stone-400 font-mono">
            How we take an abstract vision and turn it into lasting visual gravity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded bg-[#120f0d] border border-orange-500/20 space-y-3">
            <span className="text-orange-500 font-mono text-sm font-bold">01.</span>
            <h3 className="font-display font-semibold text-lg text-white">Gravitational Discovery</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              We immerse into your cultural origins, archives, audience perspectives, and conceptual core before drawing a single line.
            </p>
          </div>

          <div className="p-6 rounded bg-[#120f0d] border border-orange-500/20 space-y-3">
            <span className="text-orange-500 font-mono text-sm font-bold">02.</span>
            <h3 className="font-display font-semibold text-lg text-white">Visual Cartography</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Exploration of 2–3 distinct directional trajectories with custom typography sketches, tactile palette tests, and spatial mockups.
            </p>
          </div>

          <div className="p-6 rounded bg-[#120f0d] border border-orange-500/20 space-y-3">
            <span className="text-orange-500 font-mono text-sm font-bold">03.</span>
            <h3 className="font-display font-semibold text-lg text-white">Tactile Prototyping</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Physical paper proofs, foil stamps, risograph ink tests, and interactive code prototypes to verify presence in the real world.
            </p>
          </div>

          <div className="p-6 rounded bg-[#120f0d] border border-orange-500/20 space-y-3">
            <span className="text-orange-500 font-mono text-sm font-bold">04.</span>
            <h3 className="font-display font-semibold text-lg text-white">Permanent Launch</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Delivery of comprehensive design guidelines, vector master assets, print-ready mechanicals, and hands-on production supervision.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Project Scope & Timeline Estimator */}
      <div className="p-8 sm:p-12 rounded bg-gradient-to-b from-[#16110e] to-[#0e0c0a] border border-orange-500/30 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE ESTIMATOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            CONFIGURE YOUR PROJECT SCOPE
          </h2>
          <p className="text-xs text-stone-400 font-mono">
            Select your desired engagement scope to preview estimated production timelines and start a tailored inquiry.
          </p>
        </div>

        {/* Core Services Selection */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block">
            1. Select Core Disciplines:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SERVICES_DATA.map((s) => {
              const isSelected = selectedServices.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleService(s.id)}
                  className={`p-4 rounded text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500/15 border-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.2)]'
                      : 'bg-[#120f0d] border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-orange-400">{s.number}</div>
                  <div className="font-display font-bold text-sm sm:text-base text-white mt-1">{s.title}</div>
                  <div className="text-[11px] text-stone-400 mt-1">{s.tagline}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Add-ons Selection */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block">
            2. Specialty Tactile & Craft Add-ons:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {addonOptions.map((addon) => {
              const isChecked = selectedAddons.includes(addon.id);
              return (
                <button
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-3 rounded text-left border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-orange-950/30 border-orange-500/60 text-white'
                      : 'bg-[#120f0d] border-stone-800/80 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <span className="text-xs font-sans">{addon.label}</span>
                  <div
                    className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-orange-500 border-orange-500 text-black' : 'border-stone-600'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline Pace */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block">
            3. Project Pace & Velocity:
          </span>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'rush', label: 'Expedited Orbit (Fast-Track)', note: 'Priority studio scheduling' },
              { id: 'standard', label: 'Standard Editorial Pace', note: 'Balanced iterative rhythm' },
              { id: 'relaxed', label: 'Extended Research & Prototyping', note: 'Deep exploratory immersion' },
            ].map((pace) => (
              <button
                key={pace.id}
                onClick={() => setTimelineSpeed(pace.id as any)}
                className={`px-4 py-2 rounded text-xs font-mono border transition-all cursor-pointer ${
                  timelineSpeed === pace.id
                    ? 'bg-orange-500 text-black font-bold border-orange-500'
                    : 'bg-[#120f0d] border-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                {pace.label}
              </button>
            ))}
          </div>
        </div>

        {/* Estimated Output Bar */}
        <div className="p-6 rounded bg-[#100c0a] border border-orange-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-xs font-mono text-stone-400 uppercase">Estimated Production Timeline</div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-orange-400 mt-1">
              ~{totalWeeks} Weeks <span className="text-xs font-mono text-stone-400 font-normal">({selectedServices.length} disciplines · {selectedAddons.length} craft add-ons)</span>
            </div>
          </div>

          <button
            onClick={handleStartInquiry}
            className="inline-flex items-center gap-2 px-6 py-3 rounded bg-orange-500 hover:bg-orange-600 text-black font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] cursor-pointer"
          >
            <span>PROCEED WITH THIS BRIEF</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-8 border-t border-orange-500/15 pt-16">
        <div className="space-y-1">
          <span className="text-xs font-mono text-orange-400 uppercase tracking-widest">TRANSPARENCY</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">COMMISSIONING FAQS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-6 rounded bg-[#110e0c] border border-stone-800/80 space-y-2">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-orange-500" />
              Do you take international commissions & remote roles?
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Yes. I collaborate seamlessly with founders, agencies, and creative teams globally. Deliverables, asset handoffs, and feedback loops are coordinated across international time zones via Figma, structured milestone roadmaps, and clear digital checkpoints.
            </p>
          </div>

          <div className="p-6 rounded bg-[#110e0c] border border-stone-800/80 space-y-2">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-orange-500" />
              Who owns the final design intellectual property?
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Upon final project completion and handover, 100% of global commercial usage rights and production-ready master vector files (AI, PSD, PDF, SVG, Figma) are completely transferred to you. I retain non-commercial archival display rights for portfolio presentation.
            </p>
          </div>

          <div className="p-6 rounded bg-[#110e0c] border border-stone-800/80 space-y-2">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-orange-500" />
              How do you handle physical packaging and print production?
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              For packaging and print deliverables, I provide exact dieline geometry, paper stock specifications (weights, tactile finishes, foil stamping coordinates), press-ready PDF/X prepress mechanicals, and direct manufacturer liaison to guarantee fidelity.
            </p>
          </div>

          <div className="p-6 rounded bg-[#110e0c] border border-stone-800/80 space-y-2">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-orange-500" />
              What is your project capacity and timeline?
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              To guarantee uncompromising craft refinement and direct personal attention, I limit active freelance projects concurrently. Typical brand identity engagements span 2 to 5 weeks, adhering to mutually agreed milestones.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
