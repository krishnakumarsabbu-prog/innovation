import React from 'react';
import { Home, Sparkles, Bookmark, Search, Upload, LayoutGrid } from 'lucide-react';
import { playSelectSound } from '../utils/sound';

interface TopBarProps {
  shortlistCount: number;
  onOpenShortlist: () => void;
  onOpenThemes: () => void;
  onOpenSearch: () => void;
  onHomeClick: () => void;
  onOpenUpload: () => void;
  all6x8Mode: boolean;
  onToggleAll6x8Mode: () => void;
  currentView: 'booth' | 'floorplan' | 'schedule';
}

export const TopBar: React.FC<TopBarProps> = ({
  shortlistCount,
  onOpenShortlist,
  onOpenThemes,
  onOpenSearch,
  onHomeClick,
  onOpenUpload,
  all6x8Mode,
  onToggleAll6x8Mode,
  currentView
}) => {
  return (
    <header className="wf-topbar">
      <div className="wf-topbar-left" onClick={() => { playSelectSound(); onHomeClick(); }}>
        {/* Wells Fargo Brand Mark */}
        <div className="wf-brand-mark">
          <span className="wf-brand-name">WELLS</span>
          <span className="wf-brand-name">FARGO</span>
        </div>

        <div className="wf-divider" />

        <div className="wf-title-group">
          <h1 className="wf-main-title">Innovation Showcase</h1>
          <div className="wf-subtitle-row">
            <span className="wf-subtitle">Ideas Today. Impact Tomorrow.</span>
            <span className="wf-live-pill">
              <span className="wf-live-dot" />
              Live Atrium
            </span>
          </div>
        </div>
      </div>

      {/* Center Controls (Upload JSON & Layout Configuration) */}
      <div className="wf-topbar-center-tools">
        <button
          className="wf-topbar-tool-btn"
          onClick={() => { playSelectSound(); onOpenUpload(); }}
          title="Upload new JSON data to modify showcase booths"
        >
          <Upload size={14} />
          <span>Upload JSON</span>
        </button>

        <button
          className={`wf-topbar-tool-btn ${all6x8Mode ? 'active' : ''}`}
          onClick={() => { playSelectSound(); onToggleAll6x8Mode(); }}
          title="Toggle All 6x8 Booths (Dual monitors each)"
        >
          <Sparkles size={14} />
          <span>{all6x8Mode ? 'All 6×8 Active (Dual Monitors)' : 'Set All 6×8'}</span>
        </button>
      </div>

      {/* Main Navigation Actions */}
      <nav className="wf-nav-actions">
        <button
          className={`wf-nav-btn ${currentView === 'booth' ? 'active' : ''}`}
          onClick={() => { playSelectSound(); onHomeClick(); }}
        >
          <Home size={16} />
          <span>Home</span>
        </button>

        <button
          className="wf-nav-btn"
          onClick={() => { playSelectSound(); onOpenThemes(); }}
        >
          <Sparkles size={16} />
          <span>Themes</span>
        </button>

        <button
          className="wf-nav-btn"
          onClick={() => { playSelectSound(); onOpenShortlist(); }}
        >
          <Bookmark size={16} />
          <span>My Shortlist</span>
          {shortlistCount > 0 && (
            <span className="wf-nav-badge">{shortlistCount}</span>
          )}
        </button>

        <button
          className="wf-nav-btn"
          onClick={() => { playSelectSound(); onOpenSearch(); }}
        >
          <Search size={16} />
          <span>Search</span>
        </button>
      </nav>
    </header>
  );
};
