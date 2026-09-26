// The holler mark, as the dashboard draws it: the orb (see .orb in
// global.css) and the wordmark.
export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="orb size-[22px]" aria-hidden="true" />
      <span className="text-[17px] font-semibold tracking-[-0.03em] text-fd-foreground">holler</span>
    </span>
  );
}
