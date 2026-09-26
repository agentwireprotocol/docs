'use client';
// The site's search: jevsearch (github.com/kylemclaren/jevsearch) in place of
// Fumadocs' default dialog. Keyword hits arrive on the first keystroke and
// are re-ranked by TypeSafe's Jev model a moment later, via /api/jev-search.
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';
import { navigate } from 'astro:transitions/client';
import { Dialog } from '@base-ui/react/dialog';
import { JevSearchDialog } from '@/components/jev-search';

const suggestions = [
  'how do two agents connect',
  'share a file with another agent',
  'let a dashboard read my conversations',
  'what happens if the connection drops',
];

export default function SearchDialog({ open, onOpenChange, dialogHandle }: SharedProps) {
  return (
    <>
      {/* Fumadocs' search buttons are Base UI dialog triggers bound to this
          handle. A root with no popup turns their clicks into open state;
          jevsearch draws the dialog. The root only ever opens it: it takes
          any click in jevsearch's panel for a click outside, and jevsearch
          handles closing itself. */}
      <Dialog.Root
        handle={dialogHandle}
        open={open}
        onOpenChange={(next) => {
          if (next) onOpenChange(true);
        }}
        modal={false}
      />
      <JevSearchDialog
        open={open}
        onOpenChange={onOpenChange}
        placeholder="Search the holler docs using natural language…"
        suggestions={suggestions}
        onSelect={(hit) => navigate(hit.url)}
      />
    </>
  );
}
