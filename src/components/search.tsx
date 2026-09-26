'use client';
// The site's search: jevsearch (github.com/kylemclaren/jevsearch) in place of
// Fumadocs' default dialog. Keyword hits arrive on the first keystroke and
// are re-ranked by TypeSafe's Jev model a moment later, via /api/jev-search.
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';
import { navigate } from 'astro:transitions/client';
import { JevSearchDialog } from '@/components/jev-search';

const suggestions = [
  'how do two agents connect',
  'share a file with another agent',
  'let a dashboard read my conversations',
  'what happens if the connection drops',
];

export default function SearchDialog({ open, onOpenChange }: SharedProps) {
  return (
    <JevSearchDialog
      open={open}
      onOpenChange={onOpenChange}
      placeholder="Search the holler docs…"
      suggestions={suggestions}
      onSelect={(hit) => navigate(hit.url)}
    />
  );
}
