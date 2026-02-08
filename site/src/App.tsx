import { useState, useEffect } from 'react';
import { Search } from './components/Search';
import { IconGrid } from './components/IconGrid';
import { Usage } from './components/Usage';
import { PacksDemo } from './components/PacksDemo';
import { PackBuilder } from './components/PackBuilder';
import { FlipDemo } from './components/FlipDemo';
import { AnimateDemo } from './components/AnimateDemo';
import { SectionNav } from './components/SectionNav';
import { LoadingScreen } from './components/LoadingScreen';
import { useRandomCursor } from './hooks/useRandomCursor';
import './App.css';

import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeToggle } from './components/ThemeToggle';
import { ToastContainer } from './components/Toast';

function AppContent() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { randomIcon } = useRandomCursor();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      <LoadingScreen visible={loading} />
      <header className="app-header">
        <div className="header-top">
          <ThemeToggle />
        </div>
        <h1>OSRS Icons</h1>
        <p>A collection of Old School RuneScape icons as CSS cursors.</p>
        <div className="badges">
          <img src="https://img.shields.io/npm/v/@dava96/osrs-icons" alt="npm version" />
          <img src="https://img.shields.io/badge/Tree_Shaking-Supported-green" alt="Tree Shaking" />
        </div>
      </header>

      <SectionNav />

      <main>
        <section id="browse" className="app-section">
          <Search value={search} onChange={setSearch} placeholderExample={randomIcon?.name} />
          <IconGrid key={search} search={search} />
        </section>

        <section id="packs" className="app-section">
          <PacksDemo />
        </section>

        <section id="flip" className="app-section">
          <FlipDemo />
        </section>

        <section id="animate" className="app-section">
          <AnimateDemo />
        </section>

        <section id="builder" className="app-section">
          <PackBuilder />
        </section>

        <section id="usage" className="app-section">
          <Usage />
        </section>
      </main>

      <footer className="app-footer">
        <p>Not affiliated with Jagex or Old School RuneScape.</p>
        <p>Icons sourced from the OSRS Wiki.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
        <ToastContainer />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
