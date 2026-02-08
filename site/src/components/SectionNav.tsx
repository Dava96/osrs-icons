import React, { useState, useEffect, useCallback } from 'react';
import { Package, Hammer, Code, Search as SearchIcon } from 'lucide-react';
import './SectionNav.css';

interface NavSection {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const SECTIONS: NavSection[] = [
    { id: 'browse', label: 'Browse', icon: <SearchIcon size={16} /> },
    { id: 'packs', label: 'Packs', icon: <Package size={16} /> },
    { id: 'builder', label: 'Pack Builder', icon: <Hammer size={16} /> },
    { id: 'usage', label: 'Usage', icon: <Code size={16} /> },
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
        const sectionElements = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];

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
