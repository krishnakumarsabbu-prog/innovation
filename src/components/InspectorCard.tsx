import {
  Shield, TrendingUp, Settings, Cloud, Lightbulb, Cpu, ArrowRight,
  Monitor, Clock, Smartphone, Users, Leaf, Layers
} from 'lucide-react';
import type { BoothDefinition } from '../data/boothsData';
import { currentSlotIndex, slotTime } from '../data/boothsData';
import type { InnovationTopic } from '../types/innovation';
import { playOpenModalSound } from '../utils/sound';

interface InspectorCardProps {
  booth: BoothDefinition | null;
  topics: InnovationTopic[];
  onOpenDetails: (booth: BoothDefinition) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Shield, TrendingUp, Settings, Cloud, Lightbulb, Cpu,
  Smartphone, Users, Leaf, Layers
};

function statusLabel(s: string) {
  return s === 'YES' ? 'Yes' : s === 'MAYBE' ? 'Maybe' : 'Waitlist';
}
function statusCls(s: string) {
  return s === 'YES' ? 'status-yes' : s === 'MAYBE' ? 'status-maybe' : 'status-waitlist';
}

export const InspectorCard: React.FC<InspectorCardProps> = ({ booth, topics, onOpenDetails }) => {
  if (!booth) return null;

  const slot = currentSlotIndex();
  const nextSlot = slot + 1;

  const aIds = booth.monitorA.topicIds;
  const bIds = booth.monitorB?.topicIds ?? [];

  // Resolve topics for current and next slots
  const curAId  = aIds[slot % aIds.length];
  const curBId  = bIds.length > 0 ? bIds[slot % bIds.length] : undefined;
  const nextAId = aIds[nextSlot % aIds.length];
  const nextBId = bIds.length > 0 ? bIds[nextSlot % bIds.length] : undefined;

  const curA  = topics.find(t => t.id === curAId)  ?? null;
  const curB  = curBId ? topics.find(t => t.id === curBId) ?? null : null;
  const nextA = topics.find(t => t.id === nextAId) ?? null;
  const nextB = nextBId ? topics.find(t => t.id === nextBId) ?? null : null;

  const IconA = ICON_MAP[booth.iconName] || Shield;
  const IconB = booth.colorB ? (ICON_MAP[booth.iconName] || Shield) : IconA;

  const timeNow  = slotTime(slot);
  const timeNext = slotTime(nextSlot);

  return (
    <div className="wf-inspector-floating-card">
      {/* Booth badge */}
      <div className="wf-inspector-top">
        <div className="wf-inspector-theme-badge">
          <div className="wf-theme-icon-circle" style={{ color: booth.color, backgroundColor: `${booth.color}18` }}>
            <IconA size={17} />
          </div>
          <div>
            <span className="wf-inspector-theme-title">{booth.id}</span>
            <span className="wf-inspector-size-badge">6 × 8 · 2 Monitors</span>
          </div>
        </div>
        <span className="wf-inspector-status-pill status-yes">LIVE</span>
      </div>

      {/* ── Current Slot ── */}
      <div className="wf-inspector-slot-label">
        <Clock size={11} />
        <span>NOW  {timeNow} – {slotTime(slot + 1)}</span>
        <span className="wf-live-dot-small" />
      </div>

      <div className="wf-inspector-dual-monitors">
        {/* Left monitor – current */}
        <div className="wf-insp-monitor" style={{ borderTopColor: booth.color }}>
          <div className="wf-insp-mon-head" style={{ color: booth.color }}>
            <Monitor size={11} /> <span>LEFT</span>
          </div>
          {curA ? (
            <>
              <div className="wf-insp-mon-topic">{curA.topicName}</div>
              <div className="wf-insp-mon-meta">
                <span className={`wf-inspector-status-pill ${statusCls(curA.status)}`}>{statusLabel(curA.status)}</span>
                <strong className="wf-insp-score">{curA.score}</strong>
              </div>
              <div className="wf-insp-spoc">{curA.spocName}</div>
            </>
          ) : <div className="wf-muted" style={{ fontSize: 11 }}>No topic assigned</div>}
        </div>

        {/* Right monitor – current */}
        <div className="wf-insp-monitor" style={{ borderTopColor: booth.colorB }}>
          <div className="wf-insp-mon-head" style={{ color: booth.colorB }}>
            <Monitor size={11} /> <span>RIGHT</span>
          </div>
          {curB ? (
            <>
              <div className="wf-insp-mon-topic">{curB.topicName}</div>
              <div className="wf-insp-mon-meta">
                <span className={`wf-inspector-status-pill ${statusCls(curB.status)}`}>{statusLabel(curB.status)}</span>
                <strong className="wf-insp-score">{curB.score}</strong>
              </div>
              <div className="wf-insp-spoc">{curB.spocName}</div>
            </>
          ) : <div className="wf-muted" style={{ fontSize: 11 }}>No topic assigned</div>}
        </div>
      </div>

      {/* ── Next Slot ── */}
      <div className="wf-inspector-slot-label wf-next-slot-label">
        <ArrowRight size={11} />
        <span>NEXT  {timeNext} – {slotTime(nextSlot + 1)}</span>
      </div>

      <div className="wf-inspector-next-row">
        <div className="wf-insp-next-item">
          <div className="wf-insp-mon-head" style={{ color: booth.color }}>
            <Monitor size={10} /> LEFT
          </div>
          <span>{nextA?.topicName ?? '—'}</span>
        </div>
        <div className="wf-insp-next-divider" />
        <div className="wf-insp-next-item">
          <div className="wf-insp-mon-head" style={{ color: booth.colorB }}>
            <Monitor size={10} /> RIGHT
          </div>
          <span>{nextB?.topicName ?? '—'}</span>
        </div>
      </div>

      {/* Dual-theme chips */}
      <div className="wf-inspector-theme-chips">
        <div className="wf-insp-theme-chip" style={{ color: booth.color, backgroundColor: `${booth.color}14`, borderColor: `${booth.color}30` }}>
          <IconA size={10} /> {booth.themeA.split(' ')[0]}
        </div>
        {booth.themeB && (
          <div className="wf-insp-theme-chip" style={{ color: booth.colorB || booth.color, backgroundColor: `${booth.colorB || booth.color}14`, borderColor: `${booth.colorB || booth.color}30` }}>
            <IconB size={10} /> {booth.themeB.split(' ')[0]}
          </div>
        )}
      </div>

      {/* CTA */}
      <button className="wf-inspector-cta-btn" onClick={() => { playOpenModalSound(); onOpenDetails(booth); }}>
        <span>View Booth Details</span>
        <ArrowRight size={15} />
      </button>
    </div>
  );
};
