import React from 'react';
import { Check } from 'lucide-react';
import type { BoothDefinition } from '../data/boothsData';
import { BOOTHS_DATA } from '../data/boothsData';
import { playSelectSound } from '../utils/sound';

interface ThemeItem { label: string; dotColor: string; key: string; }

interface LeftFilterPanelProps {
  selectedTheme: string | null;
  onSelectTheme: (theme: string | null) => void;
  statusFilters: Record<string, boolean>;
  onToggleStatus: (status: 'YES' | 'MAYBE' | 'WAITLIST') => void;
  sizeFilter: 'ALL' | '6x6' | '6x8';
  onSelectSizeFilter: (size: 'ALL' | '6x6' | '6x8') => void;
  themeItems: ThemeItem[];
}

export const LeftFilterPanel: React.FC<LeftFilterPanelProps> = ({
  selectedTheme,
  onSelectTheme,
  statusFilters,
  onToggleStatus,
  themeItems
}) => {
  return (
    <aside className="wf-filter-card">
      {/* Themes */}
      <div className="wf-filter-section">
        <h3 className="wf-filter-heading">Themes</h3>
        <div className="wf-theme-list">
          {themeItems.map(item => {
            const isSelected = selectedTheme === item.key;
            return (
              <button
                key={item.key}
                className={`wf-theme-row ${isSelected ? 'selected' : ''}`}
                onClick={() => { playSelectSound(); onSelectTheme(isSelected ? null : item.key); }}
              >
                <span className="wf-theme-dot" style={{ backgroundColor: item.dotColor, boxShadow: isSelected ? `0 0 10px ${item.dotColor}` : 'none' }} />
                <span className="wf-theme-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="wf-filter-separator" />

      {/* Status */}
      <div className="wf-filter-section">
        <h3 className="wf-filter-heading">Status</h3>
        <div className="wf-status-list">
          {(['YES', 'MAYBE', 'WAITLIST'] as const).map(status => (
            <button
              key={status}
              className={`wf-status-checkbox-row ${statusFilters[status] ? 'checked' : ''}`}
              onClick={() => { playSelectSound(); onToggleStatus(status); }}
            >
              <div className={`wf-checkbox wf-checkbox-${status.toLowerCase()} ${statusFilters[status] ? 'active' : ''}`}>
                {statusFilters[status] && <Check size={13} strokeWidth={3} />}
              </div>
              <span>{status === 'YES' ? 'Yes' : status === 'MAYBE' ? 'Maybe' : 'Waitlist'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="wf-filter-separator" />

      {/* View – all booths are 6x8 now, just show info */}
      <div className="wf-filter-section">
        <h3 className="wf-filter-heading">Booth Layout</h3>
        <div className="wf-all-6x8-badge">
          <div className="wf-booth-size-badge">6 × 8</div>
          <div className="wf-all6x8-info">
            <strong>All {BOOTHS_DATA.length} Booths</strong>
            <span>Dual monitors · 2 simultaneous</span>
            <span>20 min per slot</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
