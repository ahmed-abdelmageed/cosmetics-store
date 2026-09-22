export default function Spinner({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-neutral-300 border-t-amber-600 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
