import React from 'react';
import './Usage.css';
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
          onClick={() => copyToClipboard("import { AbyssalWhip } from '@dava96/osrs-icons';")}
        >
          <code>import &#123; AbyssalWhip &#125; from '@dava96/osrs-icons';</code>
          <Copy size={16} />
        </div>
      </div>

      <div className="usage-step">
        <h3>3. Alternative: Use via CDN</h3>
        <p>No build step required — works directly in the browser.</p>
        <div
          className="code-block"
          onClick={() => copyToClipboard("import { AbyssalWhip } from 'https://esm.sh/@dava96/osrs-icons';")}
        >
          <code>import &#123; AbyssalWhip &#125; from 'https://esm.sh/@dava96/osrs-icons';</code>
          <Copy size={16} />
        </div>
      </div>

      <div className="usage-step">
        <h3>4. Apply as Cursor</h3>
        <div className="code-block">
          <code>&lt;div style=&#123;&#123; cursor: AbyssalWhip &#125;&#125; /&gt;</code>
        </div>
      </div>

      <div className="usage-step">
        <h3>5. Use as Image</h3>
        <p>Extract the data URL with <code>toDataUrl</code> — works with one or many icons.</p>
        <div
          className="code-block"
          onClick={() => copyToClipboard("const urls = toDataUrl({ whip: AbyssalWhip, sword: DragonScimitar });")}
        >
          <code>const urls = toDataUrl(&#123; whip: AbyssalWhip, sword: DragonScimitar &#125;);</code>
          <Copy size={16} />
        </div>
      </div>
    </div>
  );
};
