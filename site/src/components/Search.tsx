import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import './Search.css';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholderExample?: string;
}

export const Search: React.FC<SearchProps> = ({ value, onChange, placeholderExample }) => {
  return (
    <div className="search-container">
      <SearchIcon className="search-icon" size={20} />
      <input
        type="text"
        className="search-input"
        placeholder={`Search for an icon... ${placeholderExample ? `e.g. ${placeholderExample}` : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
