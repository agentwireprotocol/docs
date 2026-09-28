// The docs' social cards, drawn to match awp.fly.dev's: the hero's waves
// and dots (src/og/background.png, from the landing page's scripts/og.py,
// run with --background), the wordmark, and the page's section, title and
// description in Inter. Rendered by Takumi at build time.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'takumi-js/response';

const DIR = join(process.cwd(), 'src/og');
const INK = '#f4f3f6';
const INK2 = '#a8a4b0';
const INK3 = '#6b6675';

let cache: { background: string; fonts: { name: string; data: Buffer; weight: number; style: 'normal' }[] } | undefined;

function assets() {
  cache ??= {
    background: `data:image/png;base64,${readFileSync(join(DIR, 'background.png')).toString('base64')}`,
    fonts: [400, 500, 600].map((weight) => ({
      name: 'Inter',
      data: readFileSync(join(DIR, `fonts/inter-${weight}.ttf`)),
      weight,
      style: 'normal' as const,
    })),
  };
  return cache;
}

function clip(text: string, max: number) {
  return text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

export function docsCard({ title, description, section }: { title: string; description?: string; section?: string }) {
  const { background, fonts } = assets();
  const titleSize = title.length > 34 ? 60 : title.length > 22 ? 70 : 80;

  return new ImageResponse(
    <div style={{ display: 'flex', position: 'relative', width: '100%', height: '100%', fontFamily: 'Inter', color: INK, backgroundColor: '#120f17' }}>
      <img src={background} width={1200} height={630} style={{ position: 'absolute', top: 0, left: 0 }} />
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '62px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundImage: 'radial-gradient(circle at 34% 30%, #ffffff 0%, #b4b4bb 40%, #3f3f46 100%)',
              }}
            />
            <div style={{ marginLeft: 12, fontSize: 30, fontWeight: 600, letterSpacing: '-0.03em' }}>awp</div>
            <div style={{ marginLeft: 16, fontSize: 30, fontWeight: 400, color: INK3 }}>/</div>
            <div style={{ marginLeft: 16, fontSize: 30, fontWeight: 500, color: INK2, letterSpacing: '-0.02em' }}>docs</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 500, color: INK3 }}>awp-docs.fly.dev</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 96 }}>
          {section && (
            <div style={{ fontSize: 20, fontWeight: 500, color: INK2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{section}</div>
          )}
          <div style={{ marginTop: section ? 18 : 0, fontSize: titleSize, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.04em', maxWidth: 1000 }}>
            {clip(title, 60)}
          </div>
          {description && (
            <div style={{ marginTop: 26, fontSize: 27, lineHeight: 1.4, color: INK2, maxWidth: 900 }}>{clip(description, 120)}</div>
          )}
        </div>
      </div>
    </div>,
    { width: 1200, height: 630, format: 'webp', fonts },
  );
}

/** A folder's title from its meta.json ("getting-started" is "Getting started"). */
export function sectionTitle(slug?: string) {
  if (!slug) return undefined;
  try {
    const meta = JSON.parse(readFileSync(join(process.cwd(), 'content/docs', slug, 'meta.json'), 'utf8'));
    return typeof meta.title === 'string' ? meta.title : undefined;
  } catch {
    return undefined;
  }
}
