import React, { useState, useMemo, useCallback } from 'react';
import * as AllExports from '@dava96/osrs-icons';
import { Copy, X, Trash2 } from 'lucide-react';
import { OsrsNavIcon } from './OsrsNavIcon';
import { useToast } from '../context/ToastContext';
import './PackBuilder.css';

/** The CSS cursor states users can assign icons to. */
const CURSOR_STATES = [
  'default',
  'pointer',
  'wait',
  'text',
  'move',
  'grab',
  'grabbing',
  'not-allowed',
  'crosshair',
  'help',
  'progress',
] as const;

type CursorState = (typeof CURSOR_STATES)[number];

/** Extracts the data URL from a CSS cursor value for rendering in an <img>. */
function extractDataUrl(cursorValue: string): string {
  const match = cursorValue.match(/url\('(.*?)'\)/);
  return match ? match[1] : '';
}

/**
 * All icon string exports from the package. With unified exports, this
 * includes both main and category icons automatically.
 */
const ICON_ENTRIES: [string, string][] = Object.entries(AllExports).filter(
  ([key, value]) =>
    typeof value === 'string' &&
    (value as string).startsWith("url('data:image/png;base64,") &&
    !key.endsWith('Pack') &&
    key !== 'iconNames'
) as [string, string][];

// ── Icon Picker Modal ──────────────────────────────────────────────

interface IconPickerProps {
  targetState: CursorState;
  onSelect: (iconName: string, cursorValue: string) => void;
  onClose: () => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ targetState, onSelect, onClose }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return ICON_ENTRIES.slice(0, 200);
    const lower = search.toLowerCase();
    return ICON_ENTRIES.filter(([name]) => name.toLowerCase().includes(lower)).slice(0, 200);
  }, [search]);

  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="picker-header">
          <h3>
            Pick icon for <strong>{targetState}</strong>
          </h3>
          <input
            className="picker-search"
            type="text"
            placeholder="Search 17,000+ icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <button className="picker-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="picker-grid">
          {filtered.length === 0 && (
            <div className="picker-empty">No icons match &quot;{search}&quot;</div>
          )}
          {filtered.map(([name, cursor]) => (
            <div
              key={name}
              className="picker-item"
              style={{ cursor }}
              onClick={() => onSelect(name, cursor)}
              title={name}
            >
              <img src={extractDataUrl(cursor)} alt={name} />
              <span className="picker-item-name">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────

interface SlotAssignment {
  iconName: string;
  cursorValue: string;
}

export const PackBuilder: React.FC = () => {
  const { addToast } = useToast();
  const [assignments, setAssignments] = useState<Partial<Record<CursorState, SlotAssignment>>>({});
  const [pickerTarget, setPickerTarget] = useState<CursorState | null>(null);

  const assignedCount = Object.keys(assignments).length;

  const handleSelect = useCallback(
    (iconName: string, cursorValue: string) => {
      if (!pickerTarget) return;
      setAssignments((prev) => ({
        ...prev,
        [pickerTarget]: { iconName, cursorValue },
      }));
      setPickerTarget(null);
      addToast(`Assigned ${iconName} to ${pickerTarget}`, 'success');
    },
    [pickerTarget, addToast]
  );

  const handleRemove = useCallback((state: CursorState) => {
    setAssignments((prev) => {
      const next = { ...prev };
      delete next[state];
      return next;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setAssignments({});
    addToast('All assignments cleared', 'success');
  }, [addToast]);

  const exportCode = useMemo(() => {
    if (assignedCount === 0) return '';

    const imports = new Set<string>();
    const mappingLines: string[] = [];

    for (const state of CURSOR_STATES) {
      const slot = assignments[state];
      if (!slot) continue;
      imports.add(slot.iconName);
      mappingLines.push(`  '${state}': ${slot.iconName},`);
    }

    const importList = [...imports].sort().join(', ');
    return [
      `import { ${importList}, applyCursors } from '@dava96/osrs-icons';`,
      '',
      'const cleanup = applyCursors({',
      ...mappingLines,
      '});',
      '',
      '// Call cleanup() to revert cursors',
    ].join('\n');
  }, [assignments, assignedCount]);

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportCode);
    addToast('Copied to clipboard!', 'success');
  };

  return (
    <section className="pack-builder">
      <h2>
        <OsrsNavIcon name="builder" size={24} /> Pack Builder
      </h2>
      <p>Assign OSRS icons to CSS cursor states, preview them live, then export the code.</p>

      <div className="builder-layout">
        {/* ── Left: Cursor state slots ──────────────────────────── */}
        <div className="slots-panel">
          <h3>Cursor States</h3>
          {CURSOR_STATES.map((state) => {
            const slot = assignments[state];
            return (
              <div key={state} className="cursor-slot">
                <span className="slot-label">{state}</span>
                {slot ? (
                  <>
                    <img
                      className="slot-icon-preview"
                      src={extractDataUrl(slot.cursorValue)}
                      alt={slot.iconName}
                    />
                    <span className="slot-icon-name">{slot.iconName}</span>
                    <div className="slot-actions">
                      <button
                        className="slot-btn"
                        onClick={() => setPickerTarget(state)}
                        title="Change icon"
                      >
                        Change
                      </button>
                      <button
                        className="slot-btn remove"
                        onClick={() => handleRemove(state)}
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="slot-icon-name empty">none</span>
                    <button className="slot-btn" onClick={() => setPickerTarget(state)}>
                      Assign
                    </button>
                  </>
                )}
              </div>
            );
          })}

          {assignedCount > 0 && (
            <div className="builder-actions">
              <button className="clear-all-btn" onClick={handleClearAll}>
                <Trash2 size={14} /> Clear All
              </button>
            </div>
          )}
        </div>

        {/* ── Right: Preview & Export ───────────────────────────── */}
        <div className="preview-panel">
          <h3>Live Preview</h3>
          {assignedCount > 0 ? (
            <div className="preview-grid">
              {CURSOR_STATES.map((state) => {
                const slot = assignments[state];
                if (!slot) return null;
                return (
                  <div key={state} className="preview-tile" style={{ cursor: slot.cursorValue }}>
                    <img
                      className="preview-tile-icon"
                      src={extractDataUrl(slot.cursorValue)}
                      alt={slot.iconName}
                    />
                    <span className="preview-tile-state">{state}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="preview-zone">
              Assign icons to cursor states on the left, then preview and export your pack here.
            </div>
          )}

          <h3>Export Code</h3>
          {assignedCount > 0 ? (
            <div className="export-block">
              <pre className="export-code">{exportCode}</pre>
              <button className="export-btn" onClick={handleCopyExport}>
                <Copy size={14} /> Copy
              </button>
            </div>
          ) : (
            <p className="empty-export">Assign at least one icon to generate export code.</p>
          )}
        </div>
      </div>

      {/* ── Icon Picker Modal ────────────────────────────────────── */}
      {pickerTarget && (
        <IconPicker
          targetState={pickerTarget}
          onSelect={handleSelect}
          onClose={() => setPickerTarget(null)}
        />
      )}
    </section>
  );
};
