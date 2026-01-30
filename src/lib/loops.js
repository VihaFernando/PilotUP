const BACKEND_URL = import.meta.env.VITE_WAITLIST_API_URL;

/**
 * Submit email to waitlist via your backend.
 * @param {string} email
 * @param {string} [sourceFromUrl] - e.g. from ?source=reddit
 * @returns {{ ok: boolean, error?: string }}
 */
export async function submitToWaitlist(email, sourceFromUrl = null) {
  if (!BACKEND_URL) {
    console.warn('VITE_WAITLIST_API_URL not set');
    return { ok: false, error: 'Missing API URL' };
  }

  const source = sourceFromUrl ? `pilotup.io, ${sourceFromUrl}` : 'pilotup.io';

  const body = {
    email: email.trim(),
    source,
    signedUpFor: 'waiting list',
  };

  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { ok: false, error: data?.message || `Request failed (${res.status})` };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message || 'Network error' };
  }
}
