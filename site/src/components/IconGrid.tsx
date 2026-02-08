import React, { useState, useMemo } from 'react';
import * as AllExports from '@dava96/osrs-icons';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import './IconGrid.css';

interface IconGridProps {
  search: string;
}

const ITEMS_PER_PAGE = 100;

/** Extracts the data URL from a CSS cursor value like `url('data:...'), auto`. */
function extractDataUrl(cursorValue: string): string {
  const match = cursorValue.match(/url\('(.*)'\)/);
  return match ? match[1] : cursorValue;
}

/**
 * Collects only the icon string exports (skipping functions, arrays, etc.)
 * from the wildcard import.
 */
const iconEntries = Object.entries(AllExports).filter(
  ([, value]) => typeof value === 'string'
) as [string, string][];

export const IconGrid: React.FC<IconGridProps> = ({ search }) => {
  const { addToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);

  const filteredIcons = useMemo(() => {
    return iconEntries.filter(([name]) =>
      name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredIcons.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedIcons = filteredIcons.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCopy = (name: string) => {
    const text = `import { ${name} } from '@dava96/osrs-icons';`;
    navigator.clipboard.writeText(text);
    addToast(`Copied import for ${name}`, 'success');
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="icon-grid-container">
      <div className="icon-grid">
        {paginatedIcons.map(([name, url]) => (
          <div
            key={name}
            className="icon-card"
            onClick={() => handleCopy(name)}
            title="Click to copy import"
            style={{ cursor: url }}
          >
            <div className="icon-preview">
              <img src={extractDataUrl(url)} alt={name} />
            </div>
            <div className="icon-name">{name}</div>
          </div>
        ))}
        {filteredIcons.length === 0 && (
          <div className="no-results">No icons found matching "{search}"</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
