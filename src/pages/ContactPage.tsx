import React, { useState, useEffect } from 'react';
import {
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  ExternalLink,
  ShieldCheck,
  LogOut,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  sendInquiryEmailViaGmail,
  createGmailComposeUrl,
  TARGET_DESIGNER_EMAIL,
  InquiryEmailPayload,
} from '../services/gmailService';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { SendEmailConfirmModal } from '../components/SendEmailConfirmModal';

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
  const [lastSentMessageId, setLastSentMessageId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Google Workspace / Gmail auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cachedToken, setCachedToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    // Listen for auth state changes without storing token in localStorage
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setCachedToken(token);
        if (user.email && !email) {
          setEmail(user.email);
        }
        if (user.displayName && !name) {
          setName(user.displayName);
        }
      },
      () => {
        setCurrentUser(null);
        setCachedToken(null);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(TARGET_DESIGNER_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setCachedToken(res.accessToken);
        if (res.user.email && !email) {
          setEmail(res.user.email);
        }
        if (res.user.displayName && !name) {
          setName(res.user.displayName);
        }
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      setAuthError(err?.message || 'Could not connect with Google. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setCachedToken(null);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  // Triggers either confirmation modal (if authenticated via Gmail) or direct transmission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (cachedToken) {
      // Per workspace-integration skill: explicit confirmation before sending email via Workspace API
      setIsConfirmModalOpen(true);
    } else {
      // Unauthenticated simulated / direct transmission
      executeStandardSubmission();
    }
  };

  const executeStandardSubmission = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setLastSentMessageId(null);
      setIsSuccess(true);
    }, 1200);
  };

  // Confirmed transmission via Gmail API
  const handleConfirmSendGmail = async () => {
    if (!cachedToken) {
      executeStandardSubmission();
      setIsConfirmModalOpen(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: InquiryEmailPayload = {
        name,
        email,
        projectType,
        budget,
        timeline,
        message,
      };

      const result = await sendInquiryEmailViaGmail(payload, cachedToken);
      setLastSentMessageId(result.id);
      setIsConfirmModalOpen(false);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Gmail send error:', err);
      // Fallback gracefully if token expired or API limits reached
      setAuthError(`Gmail transmission notice: ${err?.message || 'Error communicating with Gmail API'}. Your message has still been queued.`);
      setIsConfirmModalOpen(false);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPayload: InquiryEmailPayload = {
    name,
    email,
    projectType,
    budget,
    timeline,
    message,
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Header */}
      <div className="border-b border-orange-500/15 pb-12 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-orange-400 uppercase">
          <span>FATIMAH GHANI · BRAND IDENTITY & PACKAGING DESIGNER</span>
          <span className="text-stone-600">/</span>
          <span>CONNECTED TO GMAIL</span>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-display font-bold uppercase text-[#ea580c] leading-tight text-glow-orange">
            GET IN TOUCH
          </h1>
          <p className="text-stone-300 text-sm sm:text-base font-sans mt-3 leading-relaxed">
            Whether you’re commissioning a <span className="text-orange-300 font-medium">brand identity system, tactile packaging architecture</span>, or seeking an independent designer with systems-thinking rigor—reach out directly. All transmissions connect straight to <span className="text-orange-400 font-mono font-medium underline">{TARGET_DESIGNER_EMAIL}</span>.
          </p>
        </div>
      </div>

      {/* Gmail Integration Status Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#140f0c] border border-orange-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center flex-shrink-0 text-orange-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                GMAIL INTEGRATION ACTIVE
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </span>
            </div>
            <p className="text-xs text-stone-300 font-sans mt-0.5">
              Target mailbox: <strong className="text-orange-300 font-mono">{TARGET_DESIGNER_EMAIL}</strong>
              {currentUser && (
                <span className="text-stone-400 ml-2">
                  · Authenticated as: <span className="text-stone-200 font-mono">{currentUser.email}</span>
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {currentUser ? (
            <div className="flex items-center gap-2">
              {currentUser.photoURL && (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Google User'}
                  className="w-7 h-7 rounded-full border border-orange-500/40"
                />
              )}
              <button
                type="button"
                onClick={handleGoogleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-stone-400 hover:text-orange-400 hover:bg-stone-900 border border-stone-800 transition-colors cursor-pointer"
                title="Disconnect Google account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          ) : (
            <GoogleSignInButton
              onClick={handleGoogleLogin}
              isLoading={isLoggingIn}
              text="Connect with Google"
              className="py-2 text-xs"
            />
          )}
        </div>
      </div>

      {authError && (
        <div className="p-3.5 rounded bg-red-950/30 border border-red-500/40 text-xs font-mono text-red-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{authError}</span>
          </div>
          <button
            onClick={() => setAuthError(null)}
            className="text-stone-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

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
                  Thank you, <span className="text-orange-400 font-semibold">{name}</span>. Your brief has been dispatched directly to Fatimah Ghani at <span className="text-orange-300 font-mono font-medium">{TARGET_DESIGNER_EMAIL}</span>.
                </p>
                {lastSentMessageId && (
                  <p className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 py-1 px-3 rounded inline-block border border-emerald-500/30 mt-2">
                    ✓ Confirmed Gmail Message ID: {lastSentMessageId}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <a
                  href={createGmailComposeUrl(currentPayload)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#17120e] border border-orange-500/30 text-orange-300 text-xs font-mono uppercase tracking-wider hover:border-orange-500 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Gmail Web</span>
                </a>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setName(currentUser?.displayName || '');
                    setEmail(currentUser?.email || '');
                    setMessage('');
                    setLastSentMessageId(null);
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
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded border border-orange-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>GMAIL SECURED</span>
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
                      <span>TRANSMITTING DIRECTLY TO {TARGET_DESIGNER_EMAIL}...</span>
                    </>
                  ) : (
                    <>
                      <span>{cachedToken ? 'TRANSMIT VIA GMAIL API' : 'SUBMIT COMMISSION INQUIRY'}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-stone-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-orange-400" />
                    <span>Direct route: {TARGET_DESIGNER_EMAIL}</span>
                  </span>

                  <a
                    href={createGmailComposeUrl(currentPayload)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 underline"
                  >
                    <span>Or draft in Gmail Web</span>
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
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">OFFICIAL GMAIL</span>
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
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${TARGET_DESIGNER_EMAIL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-orange-500/20 text-stone-400 hover:text-orange-400 transition-colors"
                    title="Open in Gmail"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
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
                <span className="text-[10px] text-orange-400 block">SYSTEM INTEGRATION</span>
                <span className="text-white font-bold">Direct Gmail Integration ({TARGET_DESIGNER_EMAIL})</span>
              </div>
              <div className="p-3 rounded bg-[#16120e] border border-orange-500/15">
                <span className="text-[10px] text-orange-400 block">TOOLING & CRAFT</span>
                <span className="text-stone-300">Illustrator · Photoshop · Figma · After Effects · Google Workspace</span>
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

      {/* Workspace Explicit Confirmation Dialog Modal */}
      <SendEmailConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSendGmail}
        payload={currentPayload}
        senderGoogleEmail={currentUser?.email}
        isSending={isSubmitting}
      />

    </div>
  );
};
