import { useState } from 'react';
import { submitToWaitlist } from '../lib/loops';
import WaitlistSuccessModal from './WaitlistSuccessModal';

function getSourceFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('source');
}

export default function CountdownEmailForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const sourceFromUrl = getSourceFromUrl();
      const { ok, error: apiError } = await submitToWaitlist(email, sourceFromUrl);

      if (!ok) {
        setStatus('error');
        return;
      }

      setEmail('');
      setStatus('idle');
      setShowSuccessModal(true);
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <WaitlistSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
        <div className="flex gap-2 rounded-full border-2 border-gray-200 focus-within:border-[#E21339] bg-white p-1.5 transition-colors">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 min-w-0 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-transparent outline-none rounded-full"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="shrink-0 px-5 py-2.5 rounded-full bg-[#E21339] text-white font-semibold text-sm hover:bg-[#c41030] transition-colors disabled:opacity-60"
          >
            {status === 'loading' ? '...' : 'Notify me'}
          </button>
        </div>
        {status === 'error' && (
          <p className="mt-2 text-sm text-red-600 text-center">Something went wrong. Try again.</p>
        )}
      </form>
    </>
  );
}
