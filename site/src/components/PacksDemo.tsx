import React from 'react';
import { OsrsNavIcon } from './OsrsNavIcon';
import {
    coinsPack,
    bucketPack,
} from '@dava96/osrs-icons';
import './PacksDemo.css';

/** Extracts the raw data URL for an <img> src from a CSS cursor string. */
function extractDataUrl(cursorValue: string): string {
    const match = cursorValue.match(/url\('(.*?)'\)/);
    return match ? match[1] : '';
}

interface PackState {
    label: string;
    cursor: string;
}

interface PackInfo {
    name: string;
    importName: string;
    description: string;
    states: PackState[];
}

const PACKS: PackInfo[] = [
    {
        name: '💰 Coins',
        importName: 'coinsPack',
        description: 'Stack grows from 1gp to 10,000gp — great for progress or score displays',
        states: coinsPack.stages.map((cursor, i) => ({
            label: ['1', '2', '3', '4', '5', '25', '100', '250', '1K', '10K'][i],
            cursor,
        })),
    },
    {
        name: '🪣 Bucket',
        importName: 'bucketPack',
        description: 'Empty → Full — perfect for loading indicators or upload progress',
        states: bucketPack.stages.map((cursor, i) => ({
            label: ['Empty', '1/5', '2/5', '3/5', '4/5', 'Full'][i],
            cursor,
        })),
    },
];

export const PacksDemo: React.FC = () => {
    return (
        <section className="packs-demo">
            <h2>
                <OsrsNavIcon name="packs" size={24} /> Cursor Packs
            </h2>
            <p>Pre-assembled icon progressions. Hover each step to preview the cursor, click to copy the import.</p>

            <div className="packs-grid">
                {PACKS.map((pack) => (
                    <PackCard key={pack.name} pack={pack} />
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
    const copyImport = () => {
        navigator.clipboard.writeText(
            `import { ${pack.importName} } from '@dava96/osrs-icons';`
        );
    };

    return (
        <div className="pack-card">
            <h3>{pack.name}</h3>
            <p className="pack-description">{pack.description}</p>
            <div className="progression-track">
                {pack.states.map((state, i) => (
                    <React.Fragment key={state.label}>
                        {i > 0 && <span className="stage-arrow">→</span>}
                        <div
                            className="stage-step"
                            style={{ cursor: state.cursor }}
                            title={state.label}
                            onClick={copyImport}
                        >
                            <img src={extractDataUrl(state.cursor)} alt={state.label} />
                        </div>
                    </React.Fragment>
                ))}
            </div>
            <span className="hover-hint">Hover to preview cursor</span>
        </div>
    );
};
