export default function WingsLogo({ className }: { className?: string } = {}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      className={className}
      aria-label="Wings logo"
    >
      <defs>
        <linearGradient id="wings-logo-gradient" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0E9F6E" />
          <stop offset="1" stopColor="#3EE6A0" />
        </linearGradient>
      </defs>
      <path
        fill="url(#wings-logo-gradient)"
        d="M1 18.5 C6.5 18.5 10.8 16.8 13.8 13.2 C16 10.5 17.3 6.8 17.7 2.5 C14.2 3.5 11.3 5.4 9.3 8 C8.4 5.6 6.6 3.7 4.2 2.5 C4.8 5.4 5.8 7.9 7.4 9.9 C4.5 11.7 2.4 14.6 1 18.5 Z"
      />
      <path
        fill="url(#wings-logo-gradient)"
        opacity="0.55"
        d="M9.5 20.5 C13.5 20 16.6 18.4 18.8 15.6 C20.3 13.7 21.2 11.2 21.6 8.2 C19.9 12.4 17 15.6 13.1 17.7 C11.9 18.7 10.7 19.6 9.5 20.5 Z"
      />
    </svg>
  );
}
