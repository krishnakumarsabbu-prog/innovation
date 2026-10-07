import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Monitor, Users, ChevronRight, Zap, Timer } from 'lucide-react';
import { buildSchedule, slotTime, currentSlotIndex, TOTAL_SLOTS, SLOT_DURATION_MINS } from '../data/boothsData';
import type { BoothDefinition } from '../data/boothsData';
import type { InnovationTopic } from '../types/innovation';
import { playSelectSound } from '../utils/sound';

interface ScheduleViewProps {
  booths: BoothDefinition[];
  topics: InnovationTopic[];
  onSelectBooth: (booth: BoothDefinition) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ booths, topics, onSelectBooth }) => {
  const schedule = useMemo(() => buildSchedule(), []);
  const currentSlot = currentSlotIndex();

  const topicMap = useMemo(() => {
    const m: Record<string, InnovationTopic> = {};
    topics.forEach(t => { m[t.id] = t; });
    return m;
  }, [topics]);

  const boothMap = useMemo(() => {
    const m: Record<string, BoothDefinition> = {};
    booths.forEach(b => { m[b.id] = b; });
    return m;
  }, [booths]);

  // Group by slot
  const slotGroups = useMemo(() => {
    const groups: Record<number, typeof schedule> = {};
    schedule.forEach(e => {
      if (!groups[e.slotIndex]) groups[e.slotIndex] = [];
      groups[e.slotIndex].push(e);
    });
    return groups;
  }, [schedule]);

  const totalPresentations = booths.length * 2 * TOTAL_SLOTS;
  const uniqueTopics = new Set(schedule.map(e => e.topicId)).size;

  return (
    <div className="wf-schedule-page">
      {/* Header */}
      <div className="wf-schedule-header">
        <div>
          <span className="wf-floorplan-eyebrow">LIVE PROGRAMME</span>
          <h2>Dual-Monitor Presentation Schedule</h2>
          <p>
            All {booths.length} booths are 6×8 with 2 simultaneous monitors ·{' '}
            {booths.length * 2} live presentations per {SLOT_DURATION_MINS}-min slot ·{' '}
            {TOTAL_SLOTS} slots · {uniqueTopics} unique topics
          </p>
        </div>

        {/* Stats row */}
        <div className="wf-schedule-stats">
          <div className="wf-sched-stat">
            <Timer size={16} />
            <div>
              <strong>{SLOT_DURATION_MINS} min</strong>
              <span>per slot</span>
            </div>
          </div>
          <div className="wf-sched-stat">
            <Monitor size={16} />
            <div>
              <strong>{booths.length * 2}</strong>
              <span>simultaneous</span>
            </div>
          </div>
          <div className="wf-sched-stat">
            <Users size={16} />
            <div>
              <strong>{TOTAL_SLOTS}</strong>
              <span>time slots</span>
            </div>
          </div>
          <div className="wf-sched-stat">
            <Zap size={16} />
            <div>
              <strong>{totalPresentations}</strong>
              <span>total sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="wf-schedule-timeline">
        {Array.from({ length: TOTAL_SLOTS }, (_, s) => {
          const entries = slotGroups[s] || [];
          const isCurrentSlot = s === currentSlot;
          const isPast = s < currentSlot;

          return (
            <div
              key={s}
              className={`wf-slot-block ${isCurrentSlot ? 'current' : ''} ${isPast ? 'past' : ''}`}
            >
              {/* Slot time header */}
              <div className="wf-slot-time-header">
                <div className="wf-slot-time-label">
                  {isCurrentSlot && <span className="wf-live-ping" />}
                  <Clock size={14} />
                  <span className="wf-time-text">{slotTime(s)}</span>
                  <span className="wf-time-sep">–</span>
                  <span className="wf-time-text">{slotTime(s + 1)}</span>
                  {isCurrentSlot && <span className="wf-live-badge">LIVE NOW</span>}
                  {isPast && <span className="wf-past-badge">COMPLETED</span>}
                </div>
                <span className="wf-slot-count">{entries.length / 2} booths · {entries.length} presentations</span>
              </div>

              {/* Booth rows for this slot */}
              <div className="wf-slot-booths-grid">
                {/* Group entries by booth */}
                {booths.map(booth => {
                  const monA = entries.find(e => e.boothId === booth.id && e.monitor === 'A');
                  const monB = entries.find(e => e.boothId === booth.id && e.monitor === 'B');
                  const topicA = monA ? topicMap[monA.topicId] : null;
                  const topicB = monB ? topicMap[monB.topicId] : null;

                  return (
                    <motion.button
                      key={booth.id}
                      className={`wf-slot-booth-card ${isCurrentSlot ? 'current-card' : ''}`}
                      whileHover={{ scale: 1.015 }}
                      onClick={() => {
                        playSelectSound();
                        onSelectBooth(booth);
                      }}
                    >
                      {/* Booth ID + size badge */}
                      <div className="wf-slot-booth-head">
                        <div className="wf-slot-booth-id" style={{ backgroundColor: booth.color }}>
                          {booth.id}
                          <span className="wf-slot-size">6×8</span>
                        </div>
                        <ChevronRight size={14} className="wf-muted" />
                      </div>

                      {/* Two monitors side by side */}
                      <div className="wf-slot-monitors">
                        {/* Monitor A */}
                        <div className="wf-slot-monitor" style={{ borderLeftColor: booth.color }}>
                          <div className="wf-slot-mon-label">
                            <Monitor size={10} />
                            <span>LEFT</span>
                          </div>
                          {topicA ? (
                            <>
                              <div className="wf-slot-topic-name">{topicA.topicName}</div>
                              <div className="wf-slot-topic-meta">
                                <span className={`wf-status-mini-tag status-${topicA.status.toLowerCase()}`}>{topicA.status}</span>
                                <span className="wf-score-mini">{topicA.score}</span>
                              </div>
                            </>
                          ) : (
                            <div className="wf-slot-topic-name wf-muted">—</div>
                          )}
                        </div>

                        <div className="wf-slot-monitor-divider" />

                        {/* Monitor B */}
                        <div className="wf-slot-monitor" style={{ borderLeftColor: booth.colorB }}>
                          <div className="wf-slot-mon-label">
                            <Monitor size={10} />
                            <span>RIGHT</span>
                          </div>
                          {topicB ? (
                            <>
                              <div className="wf-slot-topic-name">{topicB.topicName}</div>
                              <div className="wf-slot-topic-meta">
                                <span className={`wf-status-mini-tag status-${topicB.status.toLowerCase()}`}>{topicB.status}</span>
                                <span className="wf-score-mini">{topicB.score}</span>
                              </div>
                            </>
                          ) : (
                            <div className="wf-slot-topic-name wf-muted">—</div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
