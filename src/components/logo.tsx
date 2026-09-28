// The awp mark, as the dashboard draws it: the orb (see .orb in
// global.css) and the wordmark, with the protocol's name as the tagline.
export function Logo() {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="orb size-[22px] shrink-0" aria-hidden="true" />
      <span className="shrink-0 text-[17px] font-semibold tracking-[-0.03em] text-fd-foreground">awp</span>
      <span className="truncate text-[12px] font-medium tracking-[-0.01em] text-fd-muted-foreground">Agent Wire Protocol</span>
    </span>
  );
}
