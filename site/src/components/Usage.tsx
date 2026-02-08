import React from 'react';
import './Usage.css';
import { toDataUrl, errorCursor } from '@dava96/osrs-icons';
import { Copy, Terminal } from 'lucide-react';

export const Usage: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="usage-container">
      <h2>
        <Terminal size={24} /> Installation & Usage
      </h2>

      <div className="usage-step">
        <h3>1. Install</h3>
        <div
          className="code-block"
          onClick={() => copyToClipboard('npm install @dava96/osrs-icons')}
        >
          <code>npm install @dava96/osrs-icons</code>
          <Copy size={16} />
        </div>
      </div>

      <div className="usage-step">
        <h3>2. Import (Tree Shaking Supported)</h3>
        <p>Import only the icons you need to keep your bundle size small.</p>
        <div
          className="code-block"
          onClick={() => copyToClipboard("import { abyssalWhip } from '@dava96/osrs-icons';")}
        >
          <code>import &#123; abyssalWhip &#125; from '@dava96/osrs-icons';</code>
          <Copy size={16} />
        </div>
      </div>

      <div className="usage-step">
        <h3>3. Alternative: Use via CDN</h3>
        <p>No build step required. Works directly in the browser.</p>
        <div
          className="code-block"
          onClick={() =>
            copyToClipboard("import { abyssalWhip } from 'https://esm.sh/@dava96/osrs-icons';")
          }
        >
          <code>import &#123; abyssalWhip &#125; from 'https://esm.sh/@dava96/osrs-icons';</code>
          <Copy size={16} />
        </div>
      </div>

      <div className="usage-step">
        <h3>4. Apply as Cursor</h3>
        <div className="code-block">
          <code>&lt;div style=&#123;&#123; cursor: abyssalWhip &#125;&#125; /&gt;</code>
        </div>
      </div>

      <div className="usage-step">
        <h3>5. Use as Image</h3>
        <p>
          Extract the data URL with <code>toDataUrl</code>. Works with one or many icons.
        </p>
        <div
          className="code-block"
          onClick={() =>
            copyToClipboard('const urls = toDataUrl({ whip: abyssalWhip, sword: dragonScimitar });')
          }
        >
          <code>
            const urls = toDataUrl(&#123; whip: abyssalWhip, sword: dragonScimitar &#125;);
          </code>
          <Copy size={16} />
        </div>
      </div>

      <div className="usage-step">
        <h3>6. Category Icons</h3>
        <p>
          UI icons (skills, prayers, spells, etc.) are imported the same way as inventory icons.
        </p>
        <div
          className="code-block"
          onClick={() =>
            copyToClipboard("import { combatIcon, prayerAugury } from '@dava96/osrs-icons';")
          }
        >
          <code>import &#123; combatIcon, prayerAugury &#125; from '@dava96/osrs-icons';</code>
          <Copy size={16} />
        </div>
        <div className="code-block">
          <code>element.style.cursor = combatIcon;</code>
        </div>
      </div>

      <div className="usage-step">
        <h3>7. Cursor Packs</h3>
        <p>Pre-built thematic groups with stages for sequential use.</p>
        <div
          className="code-block"
          onClick={() =>
            copyToClipboard("import { runePack, bucketPack, coinsPack } from '@dava96/osrs-icons';")
          }
        >
          <code>
            import &#123; runePack, bucketPack, coinsPack &#125; from '@dava96/osrs-icons';
          </code>
          <Copy size={16} />
        </div>
        <div className="code-block">
          <code>element.style.cursor = runePack.air;</code>
        </div>
        <div className="code-block">
          <code>{'// Loading indicator: bucketPack.stages[0..5]'}</code>
        </div>
      </div>

      <div className="usage-step">
        <h3>8. Flip Cursor</h3>
        <p>Mirror icons horizontally. Works with one icon, an array, or an entire pack.</p>
        <div
          className="code-block"
          onClick={() => copyToClipboard('const left = await flipCursor(abyssalWhip);')}
        >
          <code>const left = await flipCursor(abyssalWhip);</code>
          <Copy size={16} />
        </div>
        <div
          className="code-block"
          onClick={() =>
            copyToClipboard('const [a, b] = await flipCursor([runePack.air, runePack.fire]);')
          }
        >
          <code>const [a, b] = await flipCursor([runePack.air, runePack.fire]);</code>
          <Copy size={16} />
        </div>
        <div
          className="code-block"
          onClick={() => copyToClipboard('const flipped = await flipCursor(runePack);')}
        >
          <code>const flipped = await flipCursor(runePack);</code>
          <Copy size={16} />
        </div>
      </div>

      <div className="usage-step">
        <h3>9. Apply Cursors</h3>
        <p>Map OSRS icons to CSS cursor states. Returns a cleanup function.</p>
        <div
          className="code-block"
          onClick={() =>
            copyToClipboard(
              'const cleanup = applyCursors({ default: abyssalWhip, pointer: dragonScimitar });'
            )
          }
        >
          <code>
            const cleanup = applyCursors(&#123; default: abyssalWhip, pointer: dragonScimitar
            &#125;);
          </code>
          <Copy size={16} />
        </div>
      </div>

      <div className="usage-step">
        <h3>10. Animate Cursor</h3>
        <p>Cycle through icons as an animated cursor using CSS keyframes — no timers required.</p>
        <div
          className="code-block"
          onClick={() =>
            copyToClipboard('const stop = animateCursor(coinsPack.stages, { duration: 1200 });')
          }
        >
          <code>const stop = animateCursor(coinsPack.stages, &#123; duration: 1200 &#125;);</code>
          <Copy size={16} />
        </div>
        <div className="code-block">
          <code>{'// Call stop() to remove the animation'}</code>
        </div>
      </div>

      <div className="usage-step">
        <h3>
          11. Error Cursor{' '}
          <img src={toDataUrl(errorCursor)} alt="Red Herring" className="inline-icon" />
        </h3>
        <p>The iconic red herring. A fun easter egg for error states.</p>
        <div
          className="code-block"
          onClick={() => copyToClipboard("import { errorCursor } from '@dava96/osrs-icons';")}
        >
          <code>import &#123; errorCursor &#125; from '@dava96/osrs-icons';</code>
          <Copy size={16} />
        </div>
      </div>
    </div>
  );
};
