export default function Spinner({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-ink/15 border-t-ink ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
