import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Sparkles, Layers, Users, Clock, ArrowRight,
  Info, Coffee, CheckCircle2
} from 'lucide-react';
import type { BoothDefinition } from '../data/boothsData';
import { currentSlotIndex, slotTimeRange } from '../data/boothsData';
import type { InnovationTopic } from '../types/innovation';
import { playSelectSound } from '../utils/sound';

interface BoothViewProps {
  booths: BoothDefinition[];
  selectedBooth: BoothDefinition | null;
  onSelectBooth: (booth: BoothDefinition) => void;
  selectedTheme: string | null;
  statusFilters: Record<string, boolean>;
  topics: InnovationTopic[];
  all6x8Mode: boolean;
  onOpenThemes: () => void;
  onOpenShortlist: () => void;
  onOpenSearch: () => void;
}

export const BoothView: React.FC<BoothViewProps> = ({
  booths,
  selectedBooth,
  onSelectBooth,
  selectedTheme,
  statusFilters,
  topics,
  all6x8Mode,
  onOpenThemes,
  onOpenShortlist,
  onOpenSearch
}) => {
  const [hoveredBoothId, setHoveredBoothId] = useState<string | null>(null);
  const [showLoungeCard, setShowLoungeCard] = useState(false);
  const slot = currentSlotIndex();

  const isBoothMatching = (booth: BoothDefinition): boolean => {
    if (selectedTheme) {
      if (booth.theme !== selectedTheme && booth.themeA !== selectedTheme && booth.themeB !== selectedTheme) {
        return false;
      }
    }
    const allIds = booth.topicIds || [];
    const boothTopics = allIds.map(id => topics.find(t => t.id === id)).filter(Boolean) as InnovationTopic[];
    if (boothTopics.length > 0 && !boothTopics.some(t => statusFilters[t.status])) {
      return false;
    }
    return true;
  };

  const getTopic = (id?: string) => topics.find(t => t.id === id) || null;

  return (
    <div className="wf-showcase-master-canvas">
      <div className="wf-canvas-stage">
        {/* Master Showcase Artwork */}
        <img
          src="/main-showcase.png"
          alt="Wells Fargo Innovation Showcase Main Floor"
          className="wf-master-image"
          draggable={false}
        />


        {/* Central Circular Collaboration Lounge Hotspot */}
        <div
          className="wf-lounge-hotspot"
          onClick={() => { playSelectSound(); setShowLoungeCard(v => !v); }}
          title="Executive Collaboration Lounge"
        >
          <div className="wf-lounge-pulse" />
          <AnimatePresence>
            {showLoungeCard && (
              <motion.div
                className="wf-lounge-popover"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="wf-lounge-popover-header">
                  <Coffee size={16} />
                  <h4>Executive Networking & Collaboration Lounge</h4>
                  <button className="wf-popover-close" onClick={() => setShowLoungeCard(false)}>×</button>
                </div>
                <p>
                  Connect with technology architects, sponsors, and domain experts.
                  Informal fireside discussions occur here during every 20-min session transition.
                </p>
                <div className="wf-lounge-stats">
                  <span>9 Active Innovation Booths</span> • <span>15 Presentation Rotations Today</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 9 Interactive Booth Overlays with User PNG Assets */}
        {booths.map((booth) => {
          const matching = isBoothMatching(booth);
          const isSelected = selectedBooth?.id === booth.id;
          const isHovered = hoveredBoothId === booth.id;

          const effectiveSize = all6x8Mode ? '6x8' : booth.size;
          const isDual = effectiveSize === '6x8';

          const currentTopicA = getTopic(booth.monitorA.topicIds[slot % booth.monitorA.topicIds.length]);
          const nextTopicA = getTopic(booth.monitorA.topicIds[(slot + 1) % booth.monitorA.topicIds.length]);

          const bIds = booth.monitorB?.topicIds && booth.monitorB.topicIds.length > 0
            ? booth.monitorB.topicIds
            : booth.monitorA.topicIds;
          const currentTopicB = isDual ? getTopic(bIds[slot % bIds.length]) : null;

          return (
            <button
              key={booth.id}
              className={`wf-booth-interactive-element ${isSelected ? 'is-selected' : ''} ${!matching ? 'is-dimmed' : ''}`}
              style={{
                left: `${booth.coords.left}%`,
                top: `${booth.coords.top}%`,
                width: `${booth.coords.width}%`,
                height: `${booth.coords.height}%`,
                '--booth-accent': booth.color
              } as React.CSSProperties}
              onMouseEnter={() => setHoveredBoothId(booth.id)}
              onMouseLeave={() => setHoveredBoothId(null)}
              onClick={() => {
                playSelectSound();
                onSelectBooth(booth);
              }}
              aria-label={`${booth.id} - ${booth.name}`}
            >
              {/* High-res booth PNG crop */}
              <img
                src={`/${booth.asset}`}
                alt={`${booth.id} - ${booth.name}`}
                className="wf-booth-asset-image"
                draggable={false}
              />

              {/* Glowing Aura & Selection Border */}
              <div className="wf-booth-border-aura" />

              {/* Floating Head Tag Badge */}
              <div className="wf-booth-head-tag" style={{ backgroundColor: booth.color }}>
                <span className="wf-head-tag-id">{booth.id}</span>
                <span className="wf-head-tag-size">{effectiveSize}</span>
                {isDual && <Monitor size={10} className="wf-head-tag-icon" />}
              </div>

              {/* Selected Beacon Ring */}
              {isSelected && (
                <div className="wf-booth-selected-beacon">
                  <div className="wf-beacon-pulse-ring" />
                  <div className="wf-beacon-label" style={{ backgroundColor: booth.color }}>
                    <CheckCircle2 size={12} />
                    <span>Selected • Inspecting</span>
                  </div>
                </div>
              )}

              {/* Hover Floating HUD Card */}
              <AnimatePresence>
                {isHovered && !isSelected && (
                  <motion.div
                    className="wf-booth-hover-hud"
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="wf-hud-header" style={{ borderBottom: `2px solid ${booth.color}` }}>
                      <div className="wf-hud-title-group">
                        <span className="wf-hud-badge" style={{ backgroundColor: booth.color }}>{booth.id}</span>
                        <strong>{booth.name}</strong>
                      </div>
                      <span className="wf-hud-size">{effectiveSize} • {isDual ? '2 Monitors' : '1 Monitor'}</span>
                    </div>

                    <div className="wf-hud-live-info">
                      <div className="wf-hud-now-row">
                        <span className="wf-hud-now-pill">● LIVE NOW (20 MIN)</span>
                        <span className="wf-hud-time">{slotTimeRange(slot)}</span>
                      </div>
                      <div className="wf-hud-topic-title">
                        {currentTopicA?.topicName ?? 'Solution Showcase'}
                      </div>
                      {isDual && currentTopicB && (
                        <div className="wf-hud-topic-sub">
                          + {currentTopicB.topicName} (Monitor 2)
                        </div>
                      )}
                    </div>

                    <div className="wf-hud-cta">
                      <span>Click to open Right Tray</span>
                      <ArrowRight size={12} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </div>
  );
};
