import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Monitor, Clock, Bookmark, Play, CheckCircle2, User, Building,
  TrendingUp, Award, Layers, Sparkles, ChevronRight, BarChart3,
  Lightbulb, Zap, Shield, ToggleLeft, ToggleRight
} from 'lucide-react';
import type { BoothDefinition } from '../data/boothsData';
import { TOTAL_SLOTS, slotTimeRange, currentSlotIndex } from '../data/boothsData';
import type { InnovationTopic } from '../types/innovation';
import { playSelectSound } from '../utils/sound';

interface RightTrayProps {
  booth: BoothDefinition | null;
  topics: InnovationTopic[];
  isOpen: boolean;
  onClose: () => void;
  isShortlisted: (topicId: string) => boolean;
  onToggleShortlist: (topicId: string) => void;
  all6x8Mode: boolean;
  onToggleAll6x8Mode: () => void;
  onOpenDemo: (topic: InnovationTopic) => void;
}

export const RightTray: React.FC<RightTrayProps> = ({
  booth,
  topics,
  isOpen,
  onClose,
  isShortlisted,
  onToggleShortlist,
  all6x8Mode,
  onToggleAll6x8Mode,
  onOpenDemo
}) => {
  const [selectedSlot, setSelectedSlot] = useState<number>(() => currentSlotIndex());
  const [activeMonitorTab, setActiveMonitorTab] = useState<'A' | 'B'>('A');

  if (!isOpen || !booth) return null;

  // Compute effective size and monitor count (in all-6x8 mode, every booth is 6x8 with 2 monitors)
  const effectiveSize = all6x8Mode ? '6x8' : booth.size;
  const isDualMonitor = effectiveSize === '6x8';

  // Monitor A topics
  const aTopicIds = booth.monitorA.topicIds;
  const currentATopic = topics.find(t => t.id === aTopicIds[selectedSlot % aTopicIds.length]) || null;
  const nextATopic = topics.find(t => t.id === aTopicIds[(selectedSlot + 1) % aTopicIds.length]) || null;

  // Monitor B topics (if dual monitor, fallback to booth.monitorB or second topic of A)
  const bTopicIds = booth.monitorB?.topicIds && booth.monitorB.topicIds.length > 0
    ? booth.monitorB.topicIds
    : (aTopicIds.length > 1 ? [aTopicIds[1]] : [aTopicIds[0]]);
  const currentBTopic = topics.find(t => t.id === bTopicIds[selectedSlot % bTopicIds.length]) || null;
  const nextBTopic = topics.find(t => t.id === bTopicIds[(selectedSlot + 1) % bTopicIds.length]) || null;

  // All distinct topics distributed to this booth
  const allBoothTopicIds = Array.from(new Set([...aTopicIds, ...(isDualMonitor ? bTopicIds : [])]));
  const allBoothTopics = allBoothTopicIds.map(id => topics.find(t => t.id === id)).filter(Boolean) as InnovationTopic[];

  const activeTopic = activeMonitorTab === 'A' ? currentATopic : currentBTopic;
  const activeNextTopic = activeMonitorTab === 'A' ? nextATopic : nextBTopic;

  return (
    <AnimatePresence>
      <motion.aside
        className="wf-right-tray-container"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        aria-label={`${booth.id} Details Tray`}
      >
        {/* Tray Header */}
        <div className="wf-tray-header" style={{ borderTop: `4px solid ${booth.color}` }}>
          <div className="wf-tray-header-main">
            <div className="wf-tray-badges">
              <span className="wf-tray-id-badge" style={{ backgroundColor: booth.color }}>
                {booth.id}
              </span>
              <span className="wf-tray-size-badge">
                <Layers size={13} />
                {effectiveSize} Booth
              </span>
              <span className={`wf-tray-monitor-badge ${isDualMonitor ? 'dual' : 'single'}`}>
                <Monitor size={13} />
                {isDualMonitor ? '2 Simultaneous Monitors' : '1 Presentation Monitor'}
              </span>
            </div>
            <h2 className="wf-tray-title">{booth.name}</h2>
            <p className="wf-tray-theme-sub">{booth.themeDisplay}</p>
          </div>

          <div className="wf-tray-header-actions">
            <button
              className="wf-tray-close-btn"
              onClick={() => { playSelectSound(); onClose(); }}
              aria-label="Close tray"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Global Layout Mode Toggle Banner */}
        <div className="wf-tray-mode-banner">
          <div className="wf-mode-info">
            <Sparkles size={14} className="wf-sparkle-icon" />
            <span>Layout: <strong>{all6x8Mode ? 'All 6×8 Mode (2 Monitors Everywhere)' : 'Default Floorplan (Hybrid 6×6 & 6×8)'}</strong></span>
          </div>
          <button
            className={`wf-mode-toggle-btn ${all6x8Mode ? 'active' : ''}`}
            onClick={() => { playSelectSound(); onToggleAll6x8Mode(); }}
            title="Toggle between All 6x8 booths or Original hybrid"
          >
            {all6x8Mode ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
            <span>{all6x8Mode ? 'All 6×8 ON' : 'Make All 6×8'}</span>
          </button>
        </div>

        {/* 20-Minute Rotation Timeline Scrubber */}
        <div className="wf-tray-schedule-calc">
          <div className="wf-calc-header">
            <div className="wf-calc-title">
              <Clock size={15} />
              <span>20-Min Presentation Rotation Scrubber</span>
            </div>
            <div className="wf-calc-time-badge">
              <span className="wf-live-dot" />
              <span>{slotTimeRange(selectedSlot)} (Slot {selectedSlot + 1} of {TOTAL_SLOTS})</span>
            </div>
          </div>

          {/* Quick slot chips */}
          <div className="wf-calc-slot-chips">
            {Array.from({ length: TOTAL_SLOTS }).map((_, s) => (
              <button
                key={s}
                className={`wf-calc-slot-chip ${selectedSlot === s ? 'active' : ''}`}
                onClick={() => { playSelectSound(); setSelectedSlot(s); }}
                title={slotTimeRange(s)}
              >
                {s + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Dual Monitor Selection Tabs (if 6x8) */}
        {isDualMonitor ? (
          <div className="wf-tray-monitor-tabs">
            <button
              className={`wf-monitor-tab ${activeMonitorTab === 'A' ? 'active' : ''}`}
              onClick={() => { playSelectSound(); setActiveMonitorTab('A'); }}
            >
              <Monitor size={15} />
              <div className="wf-mon-tab-text">
                <strong>Monitor 1 (Left Screen)</strong>
                <span>{currentATopic ? currentATopic.topicName : 'Empty'}</span>
              </div>
            </button>
            <button
              className={`wf-monitor-tab ${activeMonitorTab === 'B' ? 'active' : ''}`}
              onClick={() => { playSelectSound(); setActiveMonitorTab('B'); }}
            >
              <Monitor size={15} />
              <div className="wf-mon-tab-text">
                <strong>Monitor 2 (Right Screen)</strong>
                <span>{currentBTopic ? currentBTopic.topicName : 'Empty'}</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="wf-tray-single-monitor-bar">
            <Monitor size={15} />
            <span>Single Display Screen · Continuous 20-min Presentation Pipeline</span>
          </div>
        )}

        {/* Scrollable Tray Content */}
        <div className="wf-tray-scroll-body">
          {activeTopic ? (
            <div className="wf-tray-topic-card">
              {/* Live Status Header */}
              <div className="wf-topic-live-bar">
                <div className="wf-live-tag">
                  <span className="wf-live-pulse" />
                  <span>NOW PRESENTING (20 MIN)</span>
                </div>
                <div className="wf-topic-header-actions">
                  <button
                    className={`wf-topic-shortlist-btn ${isShortlisted(activeTopic.id) ? 'bookmarked' : ''}`}
                    onClick={() => { playSelectSound(); onToggleShortlist(activeTopic.id); }}
                  >
                    <Bookmark size={14} />
                    <span>{isShortlisted(activeTopic.id) ? 'Shortlisted' : 'Shortlist'}</span>
                  </button>
                  <button
                    className="wf-topic-demo-btn"
                    onClick={() => { playSelectSound(); onOpenDemo(activeTopic); }}
                  >
                    <Play size={13} fill="currentColor" />
                    <span>Launch Demo</span>
                  </button>
                </div>
              </div>

              {/* Title & Category */}
              <h3 className="wf-topic-name">{activeTopic.topicName}</h3>
              <div className="wf-topic-meta-row">
                <span className="wf-topic-cat">{activeTopic.category} • {activeTopic.subCategory}</span>
                <span className={`wf-status-tag status-${activeTopic.status.toLowerCase()}`}>
                  {activeTopic.status}
                </span>
                <span className="wf-score-pill">
                  <Award size={13} />
                  <strong>{activeTopic.score}</strong> / 100
                </span>
              </div>

              {/* SPOC & Team */}
              <div className="wf-spoc-card">
                <div className="wf-spoc-avatar">
                  <User size={16} />
                </div>
                <div className="wf-spoc-info">
                  <div className="wf-spoc-name">{activeTopic.spocName}</div>
                  <div className="wf-spoc-sub"><Building size={12} /> {activeTopic.lob} • {activeTopic.portfolio}</div>
                </div>
              </div>

              {/* Approach & Technology */}
              <div className="wf-section-box">
                <div className="wf-section-label">
                  <Zap size={14} />
                  <span>Innovative Approach & Technology</span>
                </div>
                <p className="wf-section-text">{activeTopic.innovativeApproach}</p>
              </div>

              {/* Business Opportunity / Problem Statement */}
              <div className="wf-section-box">
                <div className="wf-section-label">
                  <Lightbulb size={14} />
                  <span>Business Opportunity & Problem Statement</span>
                </div>
                <p className="wf-section-text">{activeTopic.businessOpportunity}</p>
              </div>

              {/* Business & Productivity Impact */}
              <div className="wf-section-box">
                <div className="wf-section-label">
                  <TrendingUp size={14} />
                  <span>Business & Productivity Impact</span>
                </div>
                <p className="wf-section-text">{activeTopic.businessProductivityImpact}</p>
              </div>

              {/* Adoption & Prototype */}
              <div className="wf-section-grid">
                <div className="wf-mini-box">
                  <span className="wf-mini-lbl">Adoption Stage</span>
                  <strong>{activeTopic.currentAdoptionStage}</strong>
                </div>
                <div className="wf-mini-box">
                  <span className="wf-mini-lbl">Demo / Prototype</span>
                  <strong>{activeTopic.demoPrototype}</strong>
                </div>
                <div className="wf-mini-box">
                  <span className="wf-mini-lbl">Reusability</span>
                  <strong>{activeTopic.reusability}</strong>
                </div>
                <div className="wf-mini-box">
                  <span className="wf-mini-lbl">Enterprise Recognition</span>
                  <strong>{activeTopic.enterpriseInfluenceRecognition}</strong>
                </div>
              </div>

              {/* Why Featured */}
              <div className="wf-why-featured-callout">
                <strong>Why Featured:</strong> {activeTopic.whyFeatured}
              </div>

              {/* Next Planned Presentation (20 Mins Ahead) */}
              {activeNextTopic && activeNextTopic.id !== activeTopic.id && (
                <div className="wf-next-up-card">
                  <div className="wf-next-up-header">
                    <ChevronRight size={15} />
                    <span>PLANNED FOR NEXT 20-MIN SLOT ({slotTimeRange(selectedSlot + 1)})</span>
                  </div>
                  <div className="wf-next-up-body">
                    <h4>{activeNextTopic.topicName}</h4>
                    <p>{activeNextTopic.innovativeApproach}</p>
                    <div className="wf-next-up-meta">
                      <span>SPOC: {activeNextTopic.spocName} ({activeNextTopic.lob})</span>
                      <span className="wf-score-pill sm">Score: {activeNextTopic.score}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="wf-tray-empty">
              <p>No solution scheduled for this slot.</p>
            </div>
          )}

          {/* All Distributed Solutions in this Booth */}
          <div className="wf-booth-all-apps-section">
            <h4 className="wf-apps-section-title">
              <BarChart3 size={15} />
              <span>All Distributed Solutions at {booth.id} ({allBoothTopics.length})</span>
            </h4>
            <div className="wf-apps-list">
              {allBoothTopics.map(t => (
                <div key={t.id} className="wf-app-item">
                  <div className="wf-app-item-info">
                    <h5>{t.topicName}</h5>
                    <span>{t.spocName} • {t.lob}</span>
                  </div>
                  <div className="wf-app-item-actions">
                    <span className={`wf-status-mini-tag status-${t.status.toLowerCase()}`}>
                      {t.status}
                    </span>
                    <button
                      className={`wf-app-short-btn ${isShortlisted(t.id) ? 'bookmarked' : ''}`}
                      onClick={() => { playSelectSound(); onToggleShortlist(t.id); }}
                    >
                      <Bookmark size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tray Footer */}
        <div className="wf-tray-footer">
          <div className="wf-tray-capacity-info">
            <span>20 Min / Pres. • 15 Slots / Day</span>
            <strong>{isDualMonitor ? '30 Solution Presentations / Day' : '15 Solution Presentations / Day'}</strong>
          </div>
          <button
            className="wf-tray-done-btn"
            onClick={() => { playSelectSound(); onClose(); }}
          >
            Done
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
