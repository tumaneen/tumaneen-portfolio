import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Official scope for sending email through Gmail
export const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
export const TARGET_DESIGNER_EMAIL = 'fatimahghani.2026@gmail.com';

// Initialize Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.setCustomParameters({
  prompt: 'select_account',
});

// Flag to indicate if sign-in is currently processing
let isSigningIn = false;
// In-memory token cache (NEVER stored in localStorage or sessionStorage per security guidelines)
let cachedAccessToken: string | null = null;

/**
 * Initialize auth state listener.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token not in memory; trigger user re-auth on explicit action
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Sign in with Google popup and obtain the Workspace access token.
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token with Gmail scopes from Google Auth.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Retrieve the current in-memory access token.
 */
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Sign out and clear in-memory credentials.
 */
export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Encodes a string into RFC 4648 URL-safe base64.
 */
function encodeRFC2822UrlSafe(str: string): string {
  // UTF-8 binary encoding
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export interface InquiryEmailPayload {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

/**
 * Sends a client commission inquiry to Fatimah Ghani (fatimahghani.2026@gmail.com)
 * using the Gmail API (https://gmail.googleapis.com/gmail/v1/users/me/messages/send).
 */
export const sendInquiryEmailViaGmail = async (
  payload: InquiryEmailPayload,
  accessToken: string
): Promise<{ id: string; threadId: string }> => {
  const subject = `[Design Inquiry] ${payload.projectType} — ${payload.name}`;
  
  const rawEmail = [
    `To: ${TARGET_DESIGNER_EMAIL}`,
    `Reply-To: ${payload.email}`,
    `Subject: =?utf-8?B?${btoa(new TextEncoder().encode(subject).reduce((acc, byte) => acc + String.fromCharCode(byte), ''))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    `NEW CLIENT COMMISSION INQUIRY`,
    `=============================`,
    `Recipient: Fatimah Ghani (${TARGET_DESIGNER_EMAIL})`,
    `Client Name: ${payload.name}`,
    `Client Email: ${payload.email}`,
    `Project Discipline: ${payload.projectType}`,
    `Budget: ${payload.budget}`,
    `Target Timeline: ${payload.timeline}`,
    `Date & Time: ${new Date().toUTCString()}`,
    ``,
    `PROJECT BRIEF & NOTES:`,
    `----------------------`,
    payload.message || '(No extra notes provided)',
    ``,
    `----------------------`,
    `Transmitted via Fatimah Ghani Portfolio (TUMANEEN Atelier) · Connected to ${TARGET_DESIGNER_EMAIL}`,
  ].join('\r\n');

  const base64UrlSafe = encodeRFC2822UrlSafe(rawEmail);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64UrlSafe,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.error?.message || `Gmail API error (status ${response.status}): Failed to transmit email.`
    );
  }

  return await response.json();
};

/**
 * Creates a pre-filled direct Gmail compose URL for the browser.
 */
export const createGmailComposeUrl = (payload: InquiryEmailPayload): string => {
  const subject = encodeURIComponent(`[Design Inquiry] ${payload.projectType} — ${payload.name}`);
  const body = encodeURIComponent(
    `Hi Fatimah,\n\nI am contacting you regarding a ${payload.projectType} project.\n\n` +
    `Client Name: ${payload.name}\n` +
    `Client Email: ${payload.email}\n` +
    `Budget: ${payload.budget}\n` +
    `Timeline: ${payload.timeline}\n\n` +
    `Project Brief:\n${payload.message}\n\n` +
    `Best regards,\n${payload.name}`
  );
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${TARGET_DESIGNER_EMAIL}&su=${subject}&body=${body}`;
};
