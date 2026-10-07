// ─── Booth Schedule Logic & Definitions ───────────────────────────────────────
// Event: 10:00 – 15:00 | Slot = 20 min | 15 slots total
// Each 20-min presentation rotates through assigned topics per monitor

export const EVENT_START_HOUR = 10; // 10:00 AM
export const SLOT_DURATION_MINS = 20;
export const TOTAL_SLOTS = 15; // 10:00 to 15:00 (15 slots of 20 mins)

/** Generate HH:MM string from slot index (0-based) */
export function slotTime(slotIndex: number): string {
  const totalMins = EVENT_START_HOUR * 60 + slotIndex * SLOT_DURATION_MINS;
  const hh = Math.floor(totalMins / 60);
  const mm = String(totalMins % 60).padStart(2, '0');
  const ampm = hh >= 12 ? 'PM' : 'AM';
  const displayHh = hh > 12 ? hh - 12 : hh;
  return `${String(displayHh).padStart(2, '0')}:${mm} ${ampm}`;
}

export function slotTimeRange(slotIndex: number): string {
  return `${slotTime(slotIndex)} – ${slotTime(slotIndex + 1)}`;
}

/** Get which slot index is "current" based on real clock time */
export function currentSlotIndex(): number {
  const now = new Date();
  const minutesSinceStart = (now.getHours() - EVENT_START_HOUR) * 60 + now.getMinutes();
  const idx = Math.floor(minutesSinceStart / SLOT_DURATION_MINS);
  return Math.max(0, Math.min(idx, TOTAL_SLOTS - 1));
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MonitorData {
  topicIds: string[];
  label: 'LEFT MONITOR' | 'RIGHT MONITOR' | 'MAIN DISPLAY';
}

export interface BoothDefinition {
  id: string; // 'B-01' to 'B-09'
  name: string; // 'Digital Banking', 'Customer Experience', etc.
  size: '6x6' | '6x8';
  monitorsCount: 1 | 2;
  asset: string; // 'b01.png', 'b02.png', etc.
  monitorA: MonitorData;
  monitorB?: MonitorData;
  topicIds: string[]; // Helper for all topics assigned to this booth
  color: string;
  colorB?: string;
  theme: string;
  themeA: string;
  themeB?: string;
  themeDisplay: string;
  teams: number;
  tags: string[];
  iconName: 'Shield' | 'TrendingUp' | 'Settings' | 'Cloud' | 'Lightbulb' | 'Cpu' | 'Smartphone' | 'Users' | 'Leaf' | 'Layers';
  coords: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

// ─── Master Booth Registry ───────────────────────────────────────────────────
// Pixel-accurate coordinates extracted from assets.json and index.html:
// Canvas: 1536 x 1024

export const BOOTHS_DATA: BoothDefinition[] = [
  {
    id: 'B-01',
    name: 'Digital Banking',
    size: '6x6',
    monitorsCount: 1,
    asset: 'b01.png',
    monitorA: { topicIds: ['i1', 'i16'], label: 'MAIN DISPLAY' },
    topicIds: ['i1', 'i16'],
    color: '#e31b23',
    theme: 'Data / Security',
    themeA: 'Data / Security',
    themeDisplay: 'Digital Banking & Trust',
    teams: 1,
    tags: ['Fraud Prevention', 'Accessibility', 'Digital Journeys'],
    iconName: 'Smartphone',
    coords: {
      left: 2.279948,
      top: 60.058594,
      width: 20.182292,
      height: 27.832031
    }
  },
  {
    id: 'B-02',
    name: 'Customer Experience',
    size: '6x8',
    monitorsCount: 2,
    asset: 'b02.png',
    monitorA: { topicIds: ['i3', 'i4'], label: 'LEFT MONITOR' },
    monitorB: { topicIds: ['i18', 'i9'], label: 'RIGHT MONITOR' },
    topicIds: ['i3', 'i4', 'i18', 'i9'],
    color: '#7c3aed',
    colorB: '#a855f7',
    theme: 'Emerging Trends',
    themeA: 'Emerging Trends',
    themeB: 'Tech 4 Business',
    themeDisplay: 'Customer Experience & Gen AI',
    teams: 2,
    tags: ['Signal Studio', 'Next Best Conversation', 'Case Summary'],
    iconName: 'Users',
    coords: {
      left: 22.460938,
      top: 61.035156,
      width: 27.669271,
      height: 27.832031
    }
  },
  {
    id: 'B-03',
    name: 'Automation & Gen AI',
    size: '6x8',
    monitorsCount: 2,
    asset: 'b03.png',
    monitorA: { topicIds: ['i6', 'i7'], label: 'LEFT MONITOR' },
    monitorB: { topicIds: ['i13', 'i14'], label: 'RIGHT MONITOR' },
    topicIds: ['i6', 'i7', 'i13', 'i14'],
    color: '#f97316',
    colorB: '#ea580c',
    theme: 'Engineering Efficiency & Enhancements',
    themeA: 'Engineering Efficiency & Enhancements',
    themeB: 'Tech 4 Tech',
    themeDisplay: 'Automation & Developer Guardrails',
    teams: 2,
    tags: ['Policy-as-Code', 'Test Signals', 'Workflow Composer'],
    iconName: 'Settings',
    coords: {
      left: 3.580729,
      top: 37.109375,
      width: 26.692708,
      height: 23.925781
    }
  },
  {
    id: 'B-04',
    name: 'Cloud & Infrastructure',
    size: '6x6',
    monitorsCount: 1,
    asset: 'b04.png',
    monitorA: { topicIds: ['i8', 'i10'], label: 'MAIN DISPLAY' },
    topicIds: ['i8', 'i10'],
    color: '#8b5cf6',
    theme: 'Modernization and Transformation',
    themeA: 'Modernization and Transformation',
    themeDisplay: 'Cloud & Resilient Platforms',
    teams: 1,
    tags: ['Lift Lab', 'Release Radar', 'Cloud Architecture'],
    iconName: 'Cloud',
    coords: {
      left: 15.950521,
      top: 20.019531,
      width: 16.927083,
      height: 20.019531
    }
  },
  {
    id: 'B-05',
    name: 'AI & Data Analytics',
    size: '6x8',
    monitorsCount: 2,
    asset: 'b05.png',
    monitorA: { topicIds: ['i2', 'i5'], label: 'LEFT MONITOR' },
    monitorB: { topicIds: ['i15', 'i17'], label: 'RIGHT MONITOR' },
    topicIds: ['i2', 'i5', 'i15', 'i17'],
    color: '#2563eb',
    colorB: '#3b82f6',
    theme: 'Tech 4 Business',
    themeA: 'Data / Security',
    themeB: 'Tech 4 Tech',
    themeDisplay: 'Enterprise AI & Data Platform',
    teams: 2,
    tags: ['Privacy Center', 'Knowledge Lens', 'Model Ops', 'Data Exchange'],
    iconName: 'Cpu',
    coords: {
      left: 38.411458,
      top: 20.019531,
      width: 21.484375,
      height: 20.019531
    }
  },
  {
    id: 'B-06',
    name: 'Sustainability & ESG',
    size: '6x8',
    monitorsCount: 2,
    asset: 'b06.png',
    monitorA: { topicIds: ['i22'], label: 'LEFT MONITOR' },
    monitorB: { topicIds: ['i12'], label: 'RIGHT MONITOR' },
    topicIds: ['i22', 'i12'],
    color: '#16a34a',
    colorB: '#15803d',
    theme: 'Engineering Efficiency & Enhancements',
    themeA: 'Engineering Efficiency & Enhancements',
    themeB: 'Tech 4 Business',
    themeDisplay: 'Green Compute & Sustainable Growth',
    teams: 2,
    tags: ['Green Compute', 'Small Business Pulse', 'Responsible Tech'],
    iconName: 'Leaf',
    coords: {
      left: 66.080729,
      top: 14.160156,
      width: 19.205729,
      height: 25.878906
    }
  },
  {
    id: 'B-07',
    name: 'Modernization & Transformation',
    size: '6x8',
    monitorsCount: 2,
    asset: 'b07.png',
    monitorA: { topicIds: ['i21'], label: 'LEFT MONITOR' },
    monitorB: { topicIds: ['i19'], label: 'RIGHT MONITOR' },
    topicIds: ['i21', 'i19'],
    color: '#0891b2',
    colorB: '#06b6d4',
    theme: 'Modernization and Transformation',
    themeA: 'Modernization and Transformation',
    themeB: 'Tech 4 Business',
    themeDisplay: 'Enterprise Architecture & Twin',
    teams: 2,
    tags: ['Digital Twin', 'Decision Briefs', 'Strategic Roadmaps'],
    iconName: 'Layers',
    coords: {
      left: 69.661458,
      top: 36.132813,
      width: 27.018229,
      height: 24.902344
    }
  },
  {
    id: 'B-08',
    name: 'Tech 4 Tech (Gen AI)',
    size: '6x6',
    monitorsCount: 1,
    asset: 'b08.png',
    monitorA: { topicIds: ['i20'], label: 'MAIN DISPLAY' },
    topicIds: ['i20'],
    color: '#f59e0b',
    theme: 'Tech 4 Tech',
    themeA: 'Tech 4 Tech',
    themeDisplay: 'Engineering Intelligence & SRE',
    teams: 1,
    tags: ['Operations Translator', 'Telemetry AI', 'Automated SRE'],
    iconName: 'Lightbulb',
    coords: {
      left: 54.361979,
      top: 61.035156,
      width: 22.135417,
      height: 27.832031
    }
  },
  {
    id: 'B-09',
    name: 'Risk & Compliance',
    size: '6x6',
    monitorsCount: 1,
    asset: 'b09.png',
    monitorA: { topicIds: ['i11'], label: 'MAIN DISPLAY' },
    topicIds: ['i11'],
    color: '#db2777',
    theme: 'Data / Security',
    themeA: 'Data / Security',
    themeDisplay: 'Associate Copilot & Governed AI',
    teams: 1,
    tags: ['Associate Copilot', 'Risk Controls', 'Compliance Intelligence'],
    iconName: 'Shield',
    coords: {
      left: 76.171875,
      top: 61.035156,
      width: 23.437500,
      height: 27.832031
    }
  }
];

// ─── Schedule builder ─────────────────────────────────────────────────────────

export interface ScheduleEntry {
  slotIndex: number;
  timeStart: string;
  timeEnd: string;
  boothId: string;
  boothName: string;
  monitor: 'A' | 'B';
  topicId: string;
  monitorLabel: string;
}

export function buildSchedule(): ScheduleEntry[] {
  const entries: ScheduleEntry[] = [];
  for (let s = 0; s < TOTAL_SLOTS; s++) {
    for (const booth of BOOTHS_DATA) {
      const aId = booth.monitorA.topicIds[s % booth.monitorA.topicIds.length];
      entries.push({
        slotIndex: s,
        timeStart: slotTime(s),
        timeEnd: slotTime(s + 1),
        boothId: booth.id,
        boothName: booth.name,
        monitor: 'A',
        topicId: aId,
        monitorLabel: booth.monitorA.label
      });

      if (booth.monitorB && booth.monitorB.topicIds.length > 0) {
        const bId = booth.monitorB.topicIds[s % booth.monitorB.topicIds.length];
        entries.push({
          slotIndex: s,
          timeStart: slotTime(s),
          timeEnd: slotTime(s + 1),
          boothId: booth.id,
          boothName: booth.name,
          monitor: 'B',
          topicId: bId,
          monitorLabel: booth.monitorB.label
        });
      }
    }
  }
  return entries;
}

// ─── Theme metadata ────────────────────────────────────────────────────────────

export const THEME_ITEMS = [
  { label: 'Data / Security',                       dotColor: '#e31b23', key: 'Data / Security' },
  { label: 'Emerging Trends',                       dotColor: '#7c3aed', key: 'Emerging Trends' },
  { label: 'Engineering Efficiency & Enhancements', dotColor: '#f97316', key: 'Engineering Efficiency & Enhancements' },
  { label: 'Modernization and Transformation',      dotColor: '#0891b2', key: 'Modernization and Transformation' },
  { label: 'Tech 4 Business (Gen AI)',              dotColor: '#2563eb', key: 'Tech 4 Business' },
  { label: 'Tech 4 Tech (Gen AI)',                  dotColor: '#f59e0b', key: 'Tech 4 Tech' }
];
