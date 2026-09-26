// Copy buttons on code blocks (components/code-block.tsx). The blocks are
// static HTML, so one listener on the document serves every button, on every
// page the client router swaps in.
const COPIED_MS = 1400;
const timers = new WeakMap<HTMLElement, number>();

async function writeText(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  // Not a secure context (plain http on a remote host): the old way.
  const area = document.createElement('textarea');
  area.value = text;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  area.select();
  document.execCommand('copy');
  area.remove();
}

document.addEventListener('click', async (event) => {
  const button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-copy-code]');
  const pre = button?.closest('figure')?.querySelector('pre');
  if (!button || !pre) return;
  const clone = pre.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.nd-copy-ignore').forEach((node) => node.replaceWith('\n'));
  try {
    await writeText(clone.textContent ?? '');
  } catch {
    return;
  }
  button.dataset.state = 'copied';
  button.setAttribute('aria-label', 'Copied');
  clearTimeout(timers.get(button));
  timers.set(
    button,
    window.setTimeout(() => {
      button.dataset.state = 'idle';
      button.setAttribute('aria-label', 'Copy code');
    }, COPIED_MS),
  );
});
