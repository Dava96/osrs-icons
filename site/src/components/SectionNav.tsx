import React, { useState, useEffect, useCallback } from 'react';
import { OsrsNavIcon } from './OsrsNavIcon';
import './SectionNav.css';

interface NavSection {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const SECTIONS: NavSection[] = [
  { id: 'browse', label: 'Browse', icon: <OsrsNavIcon name="search" size={16} /> },
  { id: 'packs', label: 'Packs', icon: <OsrsNavIcon name="packs" size={16} /> },
  { id: 'flip', label: 'Flip', icon: <OsrsNavIcon name="flip" size={16} /> },
  { id: 'animate', label: 'Animate', icon: <span style={{ fontSize: '14px' }}>🎞️</span> },
  { id: 'builder', label: 'Pack Builder', icon: <OsrsNavIcon name="builder" size={16} /> },
  { id: 'usage', label: 'Usage', icon: <OsrsNavIcon name="code" size={16} /> },
];

export const SectionNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState('browse');

  const handleClick = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const sectionElements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    for (const el of sectionElements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="section-nav">
      <div className="section-nav-inner">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            className={`nav-tab ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => handleClick(section.id)}
          >
            {section.icon}
            <span className="nav-label">{section.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
