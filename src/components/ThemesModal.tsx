import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { THEME_ITEMS, BOOTHS_DATA } from '../data/boothsData';
import { playSelectSound } from '../utils/sound';

interface ThemesModalProps {
  onSelectThemeAndClose: (themeKey: string) => void;
  onClose: () => void;
}

export const ThemesModal: React.FC<ThemesModalProps> = ({
  onSelectThemeAndClose,
  onClose
}) => {
  return (
    <div className="wf-modal-backdrop" onClick={onClose}>
      <motion.div
        className="wf-modal-dialog wf-themes-dialog"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        <div className="wf-modal-header">
          <div className="wf-modal-header-left">
            <div className="wf-shortlist-title-wrap">
              <Sparkles size={20} className="wf-text-red" />
              <h2>Strategic Themes Portfolio</h2>
            </div>
            <p className="wf-modal-sub">
              6 core pillars driving innovation, productivity, and enterprise growth
            </p>
          </div>
          <button className="wf-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="wf-themes-grid">
          {THEME_ITEMS.map((item) => {
            const relatedBooths = BOOTHS_DATA.filter((b) => b.theme === item.key);
            return (
              <div
                key={item.key}
                className="wf-theme-card"
                style={{ borderTop: `4px solid ${item.dotColor}` }}
              >
                <div className="wf-theme-card-head">
                  <span className="wf-theme-card-dot" style={{ backgroundColor: item.dotColor }} />
                  <h3>{item.label}</h3>
                </div>

                <p className="wf-theme-card-desc">
                  Featuring booths {relatedBooths.map((b) => b.id).join(', ')} focused on {item.label.toLowerCase()} initiatives.
                </p>

                <div className="wf-theme-card-foot">
                  <span>{relatedBooths.length} {relatedBooths.length === 1 ? 'Booth' : 'Booths'}</span>
                  <button
                    className="wf-theme-filter-btn"
                    onClick={() => {
                      playSelectSound();
                      onSelectThemeAndClose(item.key);
                    }}
                  >
                    <span>Filter Hall</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
