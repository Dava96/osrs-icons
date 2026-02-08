import React from 'react';
import { Package } from 'lucide-react';
import {
    sharkPack,
    herringPack,
    anglerfishPack,
    dragonDaggerPack,
    goldPack,
    ironPack,
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
    description: string;
    states: PackState[];
    isProgression?: boolean;
}

const PACKS: PackInfo[] = [
    {
        name: '🦈 Shark',
        description: 'Raw → Cooked → Burnt',
        states: [
            { label: 'Raw', cursor: sharkPack.raw },
            { label: 'Cooked', cursor: sharkPack.cooked },
            { label: 'Burnt', cursor: sharkPack.burnt },
        ],
    },
    {
        name: '🐟 Herring',
        description: 'Includes the Red Herring easter egg!',
        states: [
            { label: 'Raw', cursor: herringPack.raw },
            { label: 'Cooked', cursor: herringPack.cooked },
            { label: 'Burnt', cursor: herringPack.burnt },
            { label: '🚨 Error', cursor: herringPack.error },
        ],
    },
    {
        name: '🐡 Anglerfish',
        description: 'Raw → Cooked → Burnt',
        states: [
            { label: 'Raw', cursor: anglerfishPack.raw },
            { label: 'Cooked', cursor: anglerfishPack.cooked },
            { label: 'Burnt', cursor: anglerfishPack.burnt },
        ],
    },
    {
        name: '🗡️ Dragon Dagger',
        description: 'Base through poisoned++ variants',
        states: [
            { label: 'Base', cursor: dragonDaggerPack.base },
            { label: 'Poison', cursor: dragonDaggerPack.poisoned },
            { label: 'P+', cursor: dragonDaggerPack.poisonedPlus },
            { label: 'P++', cursor: dragonDaggerPack.poisonedPlusPlus },
        ],
    },
    {
        name: '🥇 Gold',
        description: 'Ore → Bar smelting progression',
        states: [
            { label: 'Ore', cursor: goldPack.ore },
            { label: 'Bar', cursor: goldPack.bar },
        ],
    },
    {
        name: '⚒️ Iron',
        description: 'Ore → Bar smelting progression',
        states: [
            { label: 'Ore', cursor: ironPack.ore },
            { label: 'Bar', cursor: ironPack.bar },
        ],
    },
    {
        name: '💰 Coins',
        description: 'Stack grows from 1gp to 10,000gp',
        states: coinsPack.stages.map((cursor, i) => ({
            label: ['1', '2', '3', '4', '5', '25', '100', '250', '1K', '10K'][i],
            cursor,
        })),
        isProgression: true,
    },
    {
        name: '🪣 Bucket',
        description: 'Perfect for loading states',
        states: bucketPack.stages.map((cursor, i) => ({
            label: ['Empty', '1/5', '2/5', '3/5', '4/5', 'Full'][i],
            cursor,
        })),
        isProgression: true,
    },
];

export const PacksDemo: React.FC = () => {
    return (
        <section className="packs-demo">
            <h2>
                <Package size={24} /> Cursor Packs
            </h2>
            <p>Hover over each state to preview the cursor. Click to copy the import code.</p>

            <div className="packs-grid">
                {PACKS.map((pack) => (
                    <PackCard key={pack.name} pack={pack} />
                ))}
            </div>
        </section>
    );
};

const PackCard: React.FC<{ pack: PackInfo }> = ({ pack }) => {
    const copyImport = () => {
        const packName = pack.name.replace(/^[^\w]+\s*/, '').toLowerCase() + 'Pack';
        navigator.clipboard.writeText(
            `import { ${packName} } from '@dava96/osrs-icons';`
        );
    };

    if (pack.isProgression) {
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
    }

    return (
        <div className="pack-card">
            <h3>{pack.name}</h3>
            <p className="pack-description">{pack.description}</p>
            <div className="pack-states">
                {pack.states.map((state) => (
                    <button
                        key={state.label}
                        className="state-button"
                        style={{ cursor: state.cursor }}
                        onClick={copyImport}
                    >
                        <img
                            className="state-icon"
                            src={extractDataUrl(state.cursor)}
                            alt={state.label}
                        />
                        <span className="state-label">{state.label}</span>
                    </button>
                ))}
            </div>
            <span className="hover-hint">Hover to preview cursor</span>
        </div>
    );
};
