import React, { useState } from 'react';
import {
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  ExternalLink,
} from 'lucide-react';

const TARGET_DESIGNER_EMAIL = 'fatimahghani.2026@gmail.com';

interface ContactPageProps {
  initialServiceNotes?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ initialServiceNotes = '' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('Brand Identity');
  const [budget, setBudget] = useState('Flexible / Open to Discussion');
  const [timeline, setTimeline] = useState('2–4 Weeks');
  const [message, setMessage] = useState(initialServiceNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(TARGET_DESIGNER_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  const createMailtoLink = () => {
    const subject = encodeURIComponent(
      `Project Commission Inquiry: ${projectType} – ${name || 'Client'}`
    );
    const body = encodeURIComponent(
      `Hello Fatimah,\n\n` +
      `I would like to inquire about a project:\n` +
      `- Name: ${name}\n` +
      `- Client Email: ${email}\n` +
      `- Discipline: ${projectType}\n` +
      `- Target Horizon: ${timeline}\n` +
      `- Budget: ${budget}\n\n` +
      `Project Brief / Details:\n${message}\n\n` +
      `Best regards,\n${name}`
    );
    return `mailto:${TARGET_DESIGNER_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Header */}
      <div className="border-b border-orange-500/15 pb-12 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-orange-400 uppercase">
          <span>FATIMAH GHANI · BRAND IDENTITY & PACKAGING DESIGNER</span>
          <span className="text-stone-600">/</span>
          <span>GET IN TOUCH</span>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-display font-bold uppercase text-[#ea580c] leading-tight text-glow-orange">
            GET IN TOUCH
          </h1>
          <p className="text-stone-300 text-sm sm:text-base font-sans mt-3 leading-relaxed">
            Whether you’re commissioning a <span className="text-orange-300 font-medium">brand identity system, tactile packaging architecture</span>, or seeking an independent designer with systems-thinking rigor—reach out directly. All transmissions connect straight to <a href={`mailto:${TARGET_DESIGNER_EMAIL}`} className="text-orange-400 font-mono font-medium underline">{TARGET_DESIGNER_EMAIL}</a>.
          </p>
        </div>
      </div>

      {/* Contact Quick Action Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#140f0c] border border-orange-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center flex-shrink-0 text-orange-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                DIRECT INQUIRIES & COMMISSIONS
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>AVAILABLE FOR WORK</span>
              </span>
            </div>
            <p className="text-xs text-stone-300 font-sans mt-0.5">
              Direct inbox: <a href={`mailto:${TARGET_DESIGNER_EMAIL}`} className="text-orange-300 font-mono hover:underline">{TARGET_DESIGNER_EMAIL}</a>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-start md:self-auto">
          {/* Simple 'Email me' button opening mailto link */}
          <a
            href={`mailto:${TARGET_DESIGNER_EMAIL}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-black text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-[0_0_15px_rgba(234,88,12,0.35)] hover:shadow-[0_0_25px_rgba(234,88,12,0.5)] cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email me</span>
          </a>

          {/* Behance Link */}
          <a
            href="https://behance.net/fatimahghani"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#181310] border border-orange-500/30 text-stone-300 hover:text-orange-400 hover:border-orange-500/60 text-xs font-mono transition-colors"
          >
            <span>Behance</span>
            <ExternalLink className="w-3 h-3 text-orange-400" />
          </a>

          {/* LinkedIn Link */}
          <a
            href="https://linkedin.com/in/fatimahghani"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#181310] border border-orange-500/30 text-stone-300 hover:text-orange-400 hover:border-orange-500/60 text-xs font-mono transition-colors"
          >
            <span>LinkedIn</span>
            <ExternalLink className="w-3 h-3 text-orange-400" />
          </a>

          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/p/DePZvlYiiWV/?utm_source=ig_web_copy_link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#181310] border border-orange-500/30 text-stone-300 hover:text-orange-400 hover:border-orange-500/60 text-xs font-mono transition-colors"
          >
            <span>Instagram</span>
            <ExternalLink className="w-3 h-3 text-orange-400" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Interactive Commission / Inquiry Form */}
        <div className="lg:col-span-7 bg-[#120f0d] p-6 sm:p-10 rounded border border-orange-500/20 shadow-xl">
          {isSuccess ? (
            <div className="py-12 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto border border-orange-500/40 shadow-[0_0_20px_rgba(234,88,12,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  TRANSMISSION SUCCESSFUL
                </h3>
                <p className="text-stone-300 text-sm max-w-md mx-auto font-sans leading-relaxed">
                  Thank you, <span className="text-orange-400 font-semibold">{name}</span>. Your brief has been prepared for Fatimah Ghani at <span className="text-orange-300 font-mono font-medium">{TARGET_DESIGNER_EMAIL}</span>.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <a
                  href={createMailtoLink()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#17120e] border border-orange-500/30 text-orange-300 text-xs font-mono uppercase tracking-wider hover:border-orange-500 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open in Email App</span>
                </a>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="px-6 py-2.5 rounded bg-orange-500 hover:bg-orange-600 text-black text-xs font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer"
                >
                  SEND ANOTHER INQUIRY
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold text-white">COMMISSION INQUIRY</h3>
                  <p className="text-xs font-mono text-stone-500">Provide details below to calculate alignment and atelier availability.</p>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-300 block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Thorne"
                    className="w-full px-4 py-2.5 rounded bg-[#16120e] border border-orange-500/20 text-stone-200 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-300 block">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. maya@studio.com"
                    className="w-full px-4 py-2.5 rounded bg-[#16120e] border border-orange-500/20 text-stone-200 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* Project Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-stone-300 block">
                  Project Discipline
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Brand Identity',
                    'Packaging Architecture',
                    'Visual Direction',
                    'Typographic System',
                    'Editorial & Print',
                    'Comprehensive Universe',
                  ].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setProjectType(type)}
                      className={`px-3 py-2 rounded text-xs font-mono text-left transition-all border cursor-pointer ${
                        projectType === type
                          ? 'bg-orange-500 text-black font-bold border-orange-500 shadow-[0_0_10px_rgba(234,88,12,0.3)]'
                          : 'bg-[#16120e] border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-300 block">
                    Approximate Budget
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-2.5 rounded bg-[#16120e] border border-orange-500/20 text-stone-200 text-xs font-mono focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                  >
                    <option value="Flexible / Open to Discussion">Flexible / Open to Discussion</option>
                    <option value="Role Opportunity (Full-Time / Contract)">Role Opportunity (Full-Time / Contract Designer)</option>
                    <option value="$1,000 – $2,500">$1,000 – $2,500 (Logo & Essential Brand System)</option>
                    <option value="$2,500 – $5,000">$2,500 – $5,000 (Complete Brand & Structural Packaging)</option>
                    <option value="$5,000+">$5,000+ (Comprehensive Brand Ecosystem)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-300 block">
                    Target Horizon
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded bg-[#16120e] border border-orange-500/20 text-stone-200 text-xs font-mono focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                  >
                    <option value="Immediate / 1–2 Weeks (Fast Track)">Immediate / 1–2 Weeks (Fast Track)</option>
                    <option value="2–4 Weeks (Standard)">2–4 Weeks (Standard Rhythm)</option>
                    <option value="1–2 Months (Deep Identity & Packaging)">1–2 Months (Deep Identity & Packaging Exploration)</option>
                    <option value="Flexible Horizon">Flexible Horizon</option>
                  </select>
                </div>
              </div>

              {/* Project Brief / Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-stone-300 block">
                  Project Brief or Role Details
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details about your brand concept, packaging requirements, target launch date, or visual references..."
                  className="w-full px-4 py-3 rounded bg-[#16120e] border border-orange-500/20 text-stone-200 text-sm focus:outline-none focus:border-orange-500 transition-colors leading-relaxed placeholder:text-stone-600"
                />
              </div>

              {/* Submit Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>PREPARING BRIEF FOR {TARGET_DESIGNER_EMAIL}...</span>
                    </>
                  ) : (
                    <>
                      <span>SUBMIT COMMISSION INQUIRY</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-stone-400 pt-1">
                  <a
                    href={`mailto:${TARGET_DESIGNER_EMAIL}`}
                    className="flex items-center gap-1.5 hover:text-orange-400 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-orange-400" />
                    <span>Direct route: {TARGET_DESIGNER_EMAIL}</span>
                  </a>

                  <a
                    href={createMailtoLink()}
                    className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 underline"
                  >
                    <span>Open in Email App</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </form>
          )}
        </div>

        {/* Right Column: Direct Contact Coordinates */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Direct Email Card */}
          <div className="p-6 sm:p-8 rounded bg-[#110e0c] border border-orange-500/25 space-y-4">
            <span className="text-xs font-mono text-orange-400 uppercase tracking-widest block">
              DIRECT CONTACT CHANNELS
            </span>
            <h3 className="text-xl font-display font-bold text-white">CONNECT WITH FATIMAH</h3>
            <p className="text-xs text-stone-400 font-sans leading-relaxed">
              Reach out directly for brand identity & packaging commissions, studio design roles, or creative partnerships:
            </p>

            {/* Email */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">OFFICIAL EMAIL</span>
              <div className="flex items-center justify-between p-3 rounded bg-[#17120f] border border-orange-500/20">
                <a
                  href={`mailto:${TARGET_DESIGNER_EMAIL}`}
                  className="font-mono text-xs text-orange-300 hover:text-orange-400 underline truncate"
                >
                  {TARGET_DESIGNER_EMAIL}
                </a>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopyEmail}
                    className="p-1.5 rounded hover:bg-orange-500/20 text-stone-400 hover:text-orange-400 transition-colors cursor-pointer"
                    title="Copy email to clipboard"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-orange-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={`mailto:${TARGET_DESIGNER_EMAIL}`}
                    className="p-1.5 rounded hover:bg-orange-500/20 text-stone-400 hover:text-orange-400 transition-colors"
                    title="Email me"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Behance */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">BEHANCE PORTFOLIO</span>
              <a
                href="https://behance.net/fatimahghani"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded bg-[#17120f] border border-orange-500/20 hover:border-orange-500/50 text-xs font-mono text-stone-200 hover:text-orange-400 transition-all"
              >
                <span>behance.net/fatimahghani</span>
                <span className="text-orange-400">OPEN ↗</span>
              </a>
            </div>

            {/* LinkedIn */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">LINKEDIN</span>
              <a
                href="https://linkedin.com/in/fatimahghani"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded bg-[#17120f] border border-orange-500/20 hover:border-orange-500/50 text-xs font-mono text-stone-200 hover:text-orange-400 transition-all"
              >
                <span>linkedin.com/in/fatimahghani</span>
                <span className="text-orange-400">OPEN ↗</span>
              </a>
            </div>

            {/* Instagram */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">INSTAGRAM</span>
              <a
                href="https://www.instagram.com/p/DePZvlYiiWV/?utm_source=ig_web_copy_link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded bg-[#17120f] border border-orange-500/20 hover:border-orange-500/50 text-xs font-mono text-stone-200 hover:text-orange-400 transition-all"
              >
                <span>instagram.com/fatimahghani</span>
                <span className="text-orange-400">OPEN ↗</span>
              </a>
            </div>

            {/* Email me Button */}
            <div className="pt-2">
              <a
                href={`mailto:${TARGET_DESIGNER_EMAIL}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-orange-500/15 border border-orange-500/40 text-xs font-mono text-orange-400 hover:bg-orange-500 hover:text-black font-semibold transition-all shadow-[0_0_12px_rgba(234,88,12,0.15)]"
              >
                <Mail className="w-4 h-4" />
                <span>Email me</span>
              </a>
            </div>

          </div>

          {/* Quick Designer Snapshot Card */}
          <div className="p-6 sm:p-8 rounded bg-[#110e0c] border border-orange-500/20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5" />
              <span>PROFILE SNAPSHOT</span>
            </div>
            
            <div className="space-y-2.5 text-xs font-mono text-stone-300">
              <div className="p-3 rounded bg-[#16120e] border border-orange-500/15">
                <span className="text-[10px] text-orange-400 block">ROLE & EXPERTISE</span>
                <span className="text-white font-bold">Brand Identity, Packaging & Graphic Designer</span>
              </div>
              <div className="p-3 rounded bg-[#16120e] border border-orange-500/15">
                <span className="text-[10px] text-orange-400 block">DIRECT CONTACT</span>
                <span className="text-white font-bold">{TARGET_DESIGNER_EMAIL}</span>
              </div>
              <div className="p-3 rounded bg-[#16120e] border border-orange-500/15">
                <span className="text-[10px] text-orange-400 block">TOOLING & CRAFT</span>
                <span className="text-stone-300">Illustrator · Photoshop · Figma · After Effects · Indesign</span>
              </div>
            </div>
          </div>

          {/* Direct Email CTA */}
          <div className="p-6 sm:p-8 rounded bg-gradient-to-r from-orange-950/20 via-[#130f0d] to-[#130f0d] border border-orange-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" />
              <span>DIRECT INQUIRIES</span>
            </div>
            <h4 className="text-lg font-display font-bold text-white">READY TO DISCUSS YOUR PROJECT?</h4>
            <p className="text-xs text-stone-400 font-sans leading-relaxed">
              Looking for a dedicated designer who combines visual passion, structural packaging craft, and modern systems rigor? Let’s talk.
            </p>
            <div className="pt-2">
              <a
                href={`mailto:${TARGET_DESIGNER_EMAIL}?subject=Brand%20Design%20Opportunity%20%2F%20Project%20Inquiry`}
                className="inline-flex items-center gap-2 text-xs font-mono text-orange-400 hover:text-orange-300 underline"
              >
                Email {TARGET_DESIGNER_EMAIL} directly →
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
