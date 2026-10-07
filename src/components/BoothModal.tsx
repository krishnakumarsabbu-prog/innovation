import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Bookmark, Monitor, Clock, ArrowRight, User, Building, Layers, BarChart3, Lightbulb, TrendingUp, CheckCircle2, Award, ExternalLink } from 'lucide-react';
import type { BoothDefinition } from '../data/boothsData';
import { currentSlotIndex, slotTime } from '../data/boothsData';
import type { InnovationTopic } from '../types/innovation';
import { playSelectSound } from '../utils/sound';

interface BoothModalProps {
  booth: BoothDefinition;
  topics: InnovationTopic[];
  isShortlisted: (id: string) => boolean;
  onToggleShortlist: (id: string) => void;
  onClose: () => void;
}

export const BoothModal: React.FC<BoothModalProps> = ({ booth, topics, isShortlisted, onToggleShortlist, onClose }) => {
  const slot = currentSlotIndex();

  // Get current + next topics for each monitor
  const getForMonitor = (ids: string[], s: number) => {
    if (!ids || ids.length === 0) return null;
    return topics.find(t => t.id === ids[s % ids.length]) ?? null;
  };

  const bIds = booth.monitorB?.topicIds ?? [];
  const curA  = getForMonitor(booth.monitorA.topicIds, slot);
  const curB  = getForMonitor(bIds, slot);
  const nextA = getForMonitor(booth.monitorA.topicIds, slot + 1);
  const nextB = getForMonitor(bIds, slot + 1);

  // All unique topics for this booth
  const allBoothTopicIds = [...new Set([...booth.monitorA.topicIds, ...bIds])];
  const allBoothTopics = allBoothTopicIds.map(id => topics.find(t => t.id === id)).filter((t): t is InnovationTopic => Boolean(t));

  // Active topic for detail view — user can switch
  const [activeTopicId, setActiveTopicId] = useState(curA?.id ?? allBoothTopics[0]?.id ?? '');
  const activeTopic = allBoothTopics.find(t => t.id === activeTopicId) ?? allBoothTopics[0];

  const shortlisted = activeTopic ? isShortlisted(activeTopic.id) : false;

  return (
    <div className="wf-modal-backdrop" onClick={onClose}>
      <motion.div
        className="wf-modal-dialog wf-booth-modal"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        transition={{ duration: 0.22 }}
      >
        {/* Top accent bar */}
        <div className="wf-booth-modal-accent" style={{ background: `linear-gradient(90deg, ${booth.color}, ${booth.colorB})` }} />

        {/* Header */}
        <div className="wf-modal-header">
          <div className="wf-modal-header-left">
            <div className="wf-modal-booth-badge" style={{ backgroundColor: `${booth.color}15`, color: booth.color, borderColor: `${booth.color}35` }}>
              <span>{booth.id}</span><span className="dot">•</span><span>6 × 8 Booth</span><span className="dot">•</span><span>2 Simultaneous Monitors</span>
            </div>
            <h2 className="wf-modal-title">Booth {booth.id} — Live Programme</h2>
          </div>
          <div className="wf-modal-header-actions">
            {activeTopic && (
              <button className={`wf-shortlist-btn ${shortlisted ? 'saved' : ''}`}
                onClick={() => { playSelectSound(); onToggleShortlist(activeTopic.id); }}>
                <Bookmark size={15} fill={shortlisted ? 'currentColor' : 'none'} />
                <span>{shortlisted ? 'Shortlisted' : 'Shortlist'}</span>
              </button>
            )}
            <button className="wf-modal-close-btn" onClick={onClose}><X size={20} /></button>
          </div>
        </div>

        {/* ── DUAL MONITOR LIVE STATUS ── */}
        <div className="wf-booth-dual-monitor-section">
          <div className="wf-dual-slot-header">
            <Clock size={14} />
            <span>Current Slot: <strong>{slotTime(slot)}</strong> – <strong>{slotTime(slot + 1)}</strong></span>
            <span className="wf-live-badge">LIVE NOW</span>
            <span className="wf-next-slot-text">Next: {slotTime(slot + 1)} – {slotTime(slot + 2)}</span>
          </div>

          <div className="wf-dual-monitors-live">
            {/* LEFT monitor */}
            <div className="wf-live-monitor-card" style={{ borderTopColor: booth.color }}>
              <div className="wf-live-mon-badge" style={{ backgroundColor: booth.color }}>
                <Monitor size={13} /> LEFT MONITOR
              </div>

              <div className="wf-live-mon-section">
                <div className="wf-live-now-label">▶ NOW PRESENTING</div>
                {curA ? (
                  <button className={`wf-live-topic-btn ${activeTopicId === curA.id ? 'active-topic' : ''}`}
                    onClick={() => { playSelectSound(); setActiveTopicId(curA.id); }}
                    style={{ '--accent': booth.color } as React.CSSProperties}>
                    <strong>{curA.topicName}</strong>
                    <div className="wf-live-meta">
                      <span className={`wf-status-mini-tag status-${curA.status.toLowerCase()}`}>{curA.status}</span>
                      <span className="wf-score-mini">{curA.score} pts</span>
                      <span className="wf-muted" style={{ fontSize: 10 }}><User size={9} /> {curA.spocName}</span>
                    </div>
                  </button>
                ) : <div className="wf-muted" style={{ padding: '8px 0', fontSize: 12 }}>No topic</div>}
              </div>

              <div className="wf-live-mon-section wf-next-section">
                <div className="wf-live-next-label"><ArrowRight size={10} /> UP NEXT</div>
                {nextA ? (
                  <button className={`wf-live-topic-btn next-topic ${activeTopicId === nextA.id ? 'active-topic' : ''}`}
                    onClick={() => { playSelectSound(); setActiveTopicId(nextA.id); }}
                    style={{ '--accent': booth.color } as React.CSSProperties}>
                    <strong>{nextA.topicName}</strong>
                    <div className="wf-live-meta">
                      <span className={`wf-status-mini-tag status-${nextA.status.toLowerCase()}`}>{nextA.status}</span>
                      <span className="wf-score-mini">{nextA.score} pts</span>
                    </div>
                  </button>
                ) : <span className="wf-muted" style={{ fontSize: 11, padding: '4px 0', display: 'block' }}>Same as current</span>}
              </div>
            </div>

            {/* Divider */}
            <div className="wf-live-monitor-divider">
              <div className="wf-live-div-line" />
              <div className="wf-live-div-badge">SIMULTANEOUS</div>
              <div className="wf-live-div-line" />
            </div>

            {/* RIGHT monitor */}
            <div className="wf-live-monitor-card" style={{ borderTopColor: booth.colorB }}>
              <div className="wf-live-mon-badge" style={{ backgroundColor: booth.colorB }}>
                <Monitor size={13} /> RIGHT MONITOR
              </div>

              <div className="wf-live-mon-section">
                <div className="wf-live-now-label">▶ NOW PRESENTING</div>
                {curB ? (
                  <button className={`wf-live-topic-btn ${activeTopicId === curB.id ? 'active-topic' : ''}`}
                    onClick={() => { playSelectSound(); setActiveTopicId(curB.id); }}
                    style={{ '--accent': booth.colorB } as React.CSSProperties}>
                    <strong>{curB.topicName}</strong>
                    <div className="wf-live-meta">
                      <span className={`wf-status-mini-tag status-${curB.status.toLowerCase()}`}>{curB.status}</span>
                      <span className="wf-score-mini">{curB.score} pts</span>
                      <span className="wf-muted" style={{ fontSize: 10 }}><User size={9} /> {curB.spocName}</span>
                    </div>
                  </button>
                ) : <div className="wf-muted" style={{ padding: '8px 0', fontSize: 12 }}>No topic</div>}
              </div>

              <div className="wf-live-mon-section wf-next-section">
                <div className="wf-live-next-label"><ArrowRight size={10} /> UP NEXT</div>
                {nextB ? (
                  <button className={`wf-live-topic-btn next-topic ${activeTopicId === nextB.id ? 'active-topic' : ''}`}
                    onClick={() => { playSelectSound(); setActiveTopicId(nextB.id); }}
                    style={{ '--accent': booth.colorB } as React.CSSProperties}>
                    <strong>{nextB.topicName}</strong>
                    <div className="wf-live-meta">
                      <span className={`wf-status-mini-tag status-${nextB.status.toLowerCase()}`}>{nextB.status}</span>
                      <span className="wf-score-mini">{nextB.score} pts</span>
                    </div>
                  </button>
                ) : <span className="wf-muted" style={{ fontSize: 11, padding: '4px 0', display: 'block' }}>Same as current</span>}
              </div>
            </div>
          </div>
        </div>

        {/* ── ACTIVE TOPIC DETAIL ── */}
        {activeTopic && (
          <>
            {/* Tab strip for all booth topics */}
            <div className="wf-modal-tabs">
              {allBoothTopics.map(t => (
                <button key={t.id}
                  className={`wf-modal-tab ${activeTopicId === t.id ? 'active' : ''}`}
                  onClick={() => { playSelectSound(); setActiveTopicId(t.id); }}>
                  <span>{t.topicName}</span>
                  <span className="wf-tab-score">{t.score}</span>
                  {(curA?.id === t.id || curB?.id === t.id) && <span className="wf-tab-live-dot" />}
                </button>
              ))}
            </div>

            {/* Metrics bar */}
            <div className="wf-modal-metrics-bar">
              <div className="wf-metric-item">
                <span className="wf-metric-label">STATUS</span>
                <span className={`wf-inspector-status-pill status-${activeTopic.status.toLowerCase()}`}>{activeTopic.status}</span>
              </div>
              <div className="wf-metric-item">
                <span className="wf-metric-label">EVALUATION SCORE</span>
                <div className="wf-metric-score-group">
                  <span className="wf-score-number">{activeTopic.score}</span>
                  <span className="wf-score-max">/ 100</span>
                </div>
              </div>
              <div className="wf-metric-item">
                <span className="wf-metric-label">LEAD SPOC</span>
                <div className="wf-spoc-info"><User size={13} /><span>{activeTopic.spocName}</span></div>
              </div>
              <div className="wf-metric-item">
                <span className="wf-metric-label">ADOPTION STAGE</span>
                <span className="wf-stage-pill">{activeTopic.currentAdoptionStage}</span>
              </div>
              <div className="wf-metric-item">
                <span className="wf-metric-label">LOB / PORTFOLIO</span>
                <div className="wf-spoc-info"><Building size={13} /><span>{activeTopic.lob}</span></div>
              </div>
            </div>

            {/* Tags row */}
            <div className="wf-modal-tags" style={{ padding: '12px 28px', borderBottom: '1px solid #EEF1F4', gap: 7 }}>
              <span className="wf-theme-chip" style={{ backgroundColor: booth.color }}>{activeTopic.themes[0]}</span>
              <span className="wf-meta-chip"><Layers size={11} />{activeTopic.category}</span>
              <span className="wf-meta-chip">{activeTopic.subCategory}</span>
              <span className="wf-meta-chip">{activeTopic.portfolio}</span>
            </div>

            {/* Detail grid */}
            <div className="wf-modal-body">
              <div className="wf-detail-card">
                <div className="wf-card-title"><Lightbulb size={15} style={{ color: booth.color }} /><h4>Business Opportunity</h4></div>
                <p>{activeTopic.businessOpportunity}</p>
              </div>
              <div className="wf-detail-card">
                <div className="wf-card-title"><TrendingUp size={15} style={{ color: booth.color }} /><h4>Innovative Approach & Technology</h4></div>
                <p>{activeTopic.innovativeApproach}</p>
              </div>
              <div className="wf-detail-card">
                <div className="wf-card-title"><BarChart3 size={15} style={{ color: booth.color }} /><h4>Business & Productivity Impact</h4></div>
                <p>{activeTopic.businessProductivityImpact}</p>
              </div>
              <div className="wf-detail-card">
                <div className="wf-card-title"><Award size={15} style={{ color: booth.color }} /><h4>Enterprise Influence & Recognition</h4></div>
                <p>{activeTopic.enterpriseInfluenceRecognition}</p>
              </div>
              <div className="wf-detail-card">
                <div className="wf-card-title"><CheckCircle2 size={15} style={{ color: booth.color }} /><h4>Adoption & Scaling Narrative</h4></div>
                <p>{activeTopic.adoptionScalingNarrative}</p>
              </div>
              <div className="wf-detail-card">
                <div className="wf-card-title"><ExternalLink size={15} style={{ color: booth.color }} /><h4>Demo / Prototype & Reusability</h4></div>
                <p><strong>Prototype:</strong> {activeTopic.demoPrototype}</p>
                <p style={{ marginTop: 8 }}><strong>Reusability:</strong> {activeTopic.reusability}</p>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="wf-modal-footer">
          <div className="wf-modal-footer-note">
            <span>Portfolio: <strong>{activeTopic?.portfolio}</strong></span>
            {activeTopic?.comments && <span className="wf-reviewer-note">• {activeTopic.comments}</span>}
          </div>
          <button className="wf-modal-done-btn" onClick={onClose}>Close</button>
        </div>
      </motion.div>
    </div>
  );
};
