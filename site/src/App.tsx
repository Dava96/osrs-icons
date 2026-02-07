import { useState } from 'react';
import { Search } from './components/Search';
import { IconGrid } from './components/IconGrid';
import { Usage } from './components/Usage';
import { useRandomCursor } from './hooks/useRandomCursor';
import './App.css';

import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeToggle } from './components/ThemeToggle';
import { ToastContainer } from './components/Toast';

function AppContent() {
  const [search, setSearch] = useState('');
  const { randomIcon } = useRandomCursor(); // Apply random OSRS cursor to body

  return (
    <div className="app">
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

      <main>
        <Search value={search} onChange={setSearch} placeholderExample={randomIcon?.name} />
        <IconGrid key={search} search={search} />
        <Usage />
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
