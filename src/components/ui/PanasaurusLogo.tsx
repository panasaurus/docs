export default function PanasaurusLogo({ className }: { className?: string } = {}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="20"
      height="20"
      className={className}
      aria-label="Panasaurus logo"
    >
      <defs>
        <linearGradient id="panasaurus-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3EE6A0" />
          <stop offset="1" stopColor="#0E9F6E" />
        </linearGradient>
      </defs>
      <g fill="url(#panasaurus-logo-gradient)">
        <path d="M4 41 L13 31.5 L18.5 37 L11 45 Q6.5 46.5 4 41 Z" />
        <rect x="11.5" y="21" width="22.5" height="15.5" rx="7.75" />
        <circle cx="18" cy="30.5" r="6" />
        <rect x="27.5" y="11.5" width="10.5" height="17" rx="5.25" />
        <rect x="30.5" y="10.5" width="14" height="9.5" rx="4.25" />
        <rect x="38" y="16" width="6.5" height="4.5" rx="2.25" />
        <rect x="14" y="33" width="5" height="10.5" rx="2.5" />
        <rect x="24.5" y="33" width="5" height="10.5" rx="2.5" />
      </g>
      <circle cx="37.8" cy="14.4" r="1.35" fill="#0B1220" />
    </svg>
  );
}
