import Image from 'next/image';

export default function PanasaurusLogo({ className }: { className?: string } = {}) {
  return (
    <Image
      src="/home/panasaurus-logo.png"
      alt=""
      width={1148}
      height={751}
      className={`shrink-0 object-contain ${className ?? 'h-auto w-7'}`}
      priority
    />
  );
}
