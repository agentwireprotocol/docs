// The mark: the orb (see .orb in global.css, as the dashboard draws it)
// and the protocol's name, which collapses to AWP where there is no room.
export function Logo() {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="orb size-[22px] shrink-0" aria-hidden="true" />
      <span className="truncate text-[17px] font-semibold tracking-[-0.03em] text-fd-foreground">
        <span className="hidden sm:inline">Agent Wire Protocol</span>
        <span className="sm:hidden">AWP</span>
      </span>
    </span>
  );
}
