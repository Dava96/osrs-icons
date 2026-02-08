import React from 'react';
import { OsrsNavIcon } from './OsrsNavIcon';
import { Copy } from 'lucide-react';
import { allPacks, toDataUrl } from '@dava96/osrs-icons';
import type { PackInfo } from '@dava96/osrs-icons';
import { useToast } from '../context/ToastContext';
import './PacksDemo.css';

export const PacksDemo: React.FC = () => {
    return (
        <section className="packs-demo">
            <h2>
                <OsrsNavIcon name="packs" size={24} /> Cursor Packs
            </h2>
            <p>Pre-assembled icon progressions. Hover each step to preview the cursor.</p>

            <div className="packs-grid">
                {allPacks.map((pack) => (
                    <PackCard key={pack.importName} pack={pack} />
                ))}
            </div>

            <p className="contribute-hint">
                Want to add a pack? Check the{' '}
                <a href="https://github.com/Dava96/osrs-icons/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer">
                    Contributing Guide
                </a>{' '}
                — it&rsquo;s easy to assemble and submit your own!
            </p>
        </section>
    );
};

const PackCard: React.FC<{ pack: PackInfo }> = ({ pack }) => {
    const { addToast } = useToast();

    const copyImport = () => {
        navigator.clipboard.writeText(
            `import { ${pack.importName} } from '@dava96/osrs-icons';`
        );
        addToast('Copied to clipboard!', 'success');
    };

    return (
        <div className="pack-card">
            <div className="pack-card-header">
                <div>
                    <h3>
                        <img
                            src={toDataUrl(pack.icon)}
                            alt=""
                            width={20}
                            height={20}
                            style={{ imageRendering: 'pixelated', verticalAlign: 'middle', marginRight: '0.4rem' }}
                        />
                        {pack.name}
                    </h3>
                    <p className="pack-description">{pack.description}</p>
                </div>
                <button className="copy-pack-btn" onClick={copyImport} title="Copy import">
                    <Copy size={14} /> Copy
                </button>
            </div>
            <div className="progression-track">
                {pack.stages.map((cursor, i) => (
                    <React.Fragment key={pack.stageLabels[i]}>
                        {i > 0 && <span className="stage-arrow">→</span>}
                        <div
                            className="stage-step"
                            style={{ cursor }}
                            title={pack.stageLabels[i]}
                        >
                            <img src={toDataUrl(cursor)} alt={pack.stageLabels[i]} />
                        </div>
                    </React.Fragment>
                ))}
            </div>
            <span className="hover-hint">Hover to preview cursor</span>
        </div>
    );
};
