export function IndigoLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="indigo-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.22 295)" />
          <stop offset="100%" stopColor="oklch(0.55 0.24 320)" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="49" fill="url(#indigo-logo-grad)" />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="middle"
        dy="0.08em"
        fill="white"
        fontSize="38"
        fontWeight={700}
        fontFamily="Comfortaa, Inter, sans-serif"
        letterSpacing="-1"
      >
        IL
      </text>
    </svg>
  );
}

export default IndigoLogo;