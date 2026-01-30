import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';

const DEFAULT_TITLE = "You're on the list!";
const DEFAULT_DESCRIPTION = "Thank you for joining our waiting list. We'll keep in touch with you on email so you don't miss out any updates.";

export default function WaitlistSuccessModal({
  open,
  onClose,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}) {
  useEffect(() => {
    if (!open) return;
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#E21339', '#fdfffc', '#1a1a1a'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#E21339', '#fdfffc', '#1a1a1a'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    const t1 = setTimeout(() => {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }, 200);
    const t2 = setTimeout(() => {
      confetti({ particleCount: 50, spread: 100, origin: { y: 0.5, x: 0.5 } });
    }, 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-success-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      />
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 p-6 sm:p-8 animate-fadeIn">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h2
          id="waitlist-success-title"
          className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 pr-10"
        >
          {title}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
          {description}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-[#E21339] text-white font-semibold hover:bg-[#c41030] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
