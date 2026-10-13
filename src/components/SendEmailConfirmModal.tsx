import React from 'react';
import { Mail, AlertCircle, X, Check, ShieldCheck } from 'lucide-react';
import { TARGET_DESIGNER_EMAIL, InquiryEmailPayload } from '../services/gmailService';

interface SendEmailConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  payload: InquiryEmailPayload;
  senderGoogleEmail?: string | null;
  isSending: boolean;
}

export const SendEmailConfirmModal: React.FC<SendEmailConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  payload,
  senderGoogleEmail,
  isSending,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#14100d] border border-orange-500/40 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6 text-stone-200">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-orange-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white tracking-wide">
                CONFIRM GMAIL TRANSMISSION
              </h3>
              <p className="text-xs font-mono text-stone-400">
                Action requires your explicit confirmation before dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSending}
            className="p-1.5 rounded text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Card */}
        <div className="space-y-3 text-xs font-mono bg-[#1a1410] p-4 rounded-lg border border-orange-500/15">
          <div className="flex items-center justify-between py-1 border-b border-stone-800">
            <span className="text-stone-400">DESTINATION (RECIPIENT):</span>
            <span className="text-orange-300 font-semibold">{TARGET_DESIGNER_EMAIL}</span>
          </div>
          {senderGoogleEmail && (
            <div className="flex items-center justify-between py-1 border-b border-stone-800">
              <span className="text-stone-400">AUTHENTICATED GMAIL ACCOUNT:</span>
              <span className="text-stone-200">{senderGoogleEmail}</span>
            </div>
          )}
          <div className="flex items-center justify-between py-1 border-b border-stone-800">
            <span className="text-stone-400">CLIENT / SENDER NAME:</span>
            <span className="text-stone-200">{payload.name} ({payload.email})</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-stone-800">
            <span className="text-stone-400">DISCIPLINE:</span>
            <span className="text-orange-400">{payload.projectType}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-stone-800">
            <span className="text-stone-400">BUDGET & HORIZON:</span>
            <span className="text-stone-300">{payload.budget} · {payload.timeline}</span>
          </div>
          <div className="pt-2">
            <span className="text-stone-400 block mb-1">BRIEF EXCERPT:</span>
            <p className="font-sans text-xs text-stone-300 italic line-clamp-3 bg-[#110e0c] p-2.5 rounded border border-stone-800/70">
              "{payload.message || 'No additional project notes provided.'}"
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-start gap-2.5 text-xs text-stone-400 bg-orange-950/20 p-3 rounded border border-orange-500/20 font-sans">
          <ShieldCheck className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
          <p>
            An official message will be transmitted directly via Gmail to <strong className="text-orange-300">{TARGET_DESIGNER_EMAIL}</strong>. No passwords or sensitive tokens are stored on servers.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2 rounded text-xs font-mono text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(234,88,12,0.4)] cursor-pointer"
          >
            {isSending ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Transmitting via Gmail...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Confirm & Send via Gmail</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
