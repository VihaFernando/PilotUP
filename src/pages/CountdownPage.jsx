import { useCountdown } from '../hooks/useCountdown';
import CountdownBox from '../components/CountdownBox';
import CountdownEmailForm from '../components/CountdownEmailForm';
import CountdownSocialIcons from '../components/CountdownSocialIcons';

// Target: 31st January 2026, 4:00 PM IST (UTC+5:30) = 10:30 AM UTC
const TARGET_DATE = new Date('2026-01-31T10:30:00.000Z');

export default function CountdownPage() {
  const timeLeft = useCountdown(TARGET_DATE);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#fdfffc]">
      {/* Decorative red accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#E21339]" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center px-6 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8">
          <div className="text-[#E21339] font-sans text-2xl sm:text-3xl tracking-wider">
            <img src="/Logo-full-black.png" alt="PilotUP" className="w-auto h-6 sm:h-7" />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8">
          <h1 className="text-lg sm:text-xl md:text-2xl text-center text-gray-900 font-semibold mb-3 sm:mb-4 animate-fadeIn">
            We&apos;re almost there!
          </h1>
          <div
            className="w-16 h-0.5 bg-[#E21339] mb-10 sm:mb-12 md:mb-16 animate-fadeIn"
            style={{ animationDelay: '0.1s' }}
          />
          <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-12 sm:mb-16 md:mb-20">
            <CountdownBox
              value={timeLeft.days}
              label="Days"
              className="animate-fadeIn"
              style={{ animationDelay: '0.2s' }}
            />
            <CountdownBox
              value={timeLeft.hours}
              label="Hours"
              className="animate-fadeIn"
              style={{ animationDelay: '0.3s' }}
            />
            <CountdownBox
              value={timeLeft.minutes}
              label="Minutes"
              className="animate-fadeIn"
              style={{ animationDelay: '0.4s' }}
            />
            <CountdownBox
              value={timeLeft.seconds}
              label="Seconds"
              className="animate-fadeIn"
              style={{ animationDelay: '0.5s' }}
            />
          </div>
          {/* <div className="w-full max-w-sm mb-8 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <CountdownEmailForm />
          </div> */}
        </main>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-6 gap-4">
          <div className="text-xs tracking-[0.15em] uppercase text-gray-500 font-medium">
            PilotUP
          </div>
          <CountdownSocialIcons />
        </footer>
      </div>
    </div>
  );
}
