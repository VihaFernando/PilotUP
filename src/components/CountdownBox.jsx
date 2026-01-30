export default function CountdownBox({ value, label, className = '', style }) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-w-[4rem] sm:min-w-[5rem] md:min-w-[5.5rem] lg:min-w-[6rem] py-4 sm:py-5 px-3 sm:px-4 rounded-xl border-2 border-[#E21339]/30 bg-white/80 shadow-sm ${className}`}
      style={style}
    >
      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tabular-nums">
        {value}
      </span>
      <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">
        {label}
      </span>
    </div>
  );
}
