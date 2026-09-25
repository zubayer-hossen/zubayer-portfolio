export default function Tooltip({ label, children }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span role="tooltip" className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-surface2 px-2.5 py-1 text-xs text-ink opacity-0 shadow-lift transition group-focus-within:opacity-100 group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
}
