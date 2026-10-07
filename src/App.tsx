import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, LayoutGrid, Layers, Clock } from 'lucide-react';
import rawTopics from './data/event_themes.json';
import { BOOTHS_DATA, THEME_ITEMS } from './data/boothsData';
import type { BoothDefinition } from './data/boothsData';
import type { InnovationTopic, Status, Theme } from './types/innovation';

import { TopBar } from './components/TopBar';
import { LeftFilterPanel } from './components/LeftFilterPanel';
import { BoothView } from './components/BoothView';
import { RightTray } from './components/RightTray';
import { BottomDock } from './components/BottomDock';
import { BoothModal } from './components/BoothModal';
import { FloorPlanView } from './components/FloorPlanView';
import { AboutModal } from './components/AboutModal';
import { ShortlistModal } from './components/ShortlistModal';
import { ThemesModal } from './components/ThemesModal';
import { SearchModal } from './components/SearchModal';
import { ScheduleView } from './components/ScheduleView';
import { JsonUploadModal } from './components/JsonUploadModal';
import { PrototypeSimulatorModal } from './components/PrototypeSimulatorModal';

// ─── Topic normalizer ─────────────────────────────────────────────────────────
function normalizeTopics(raw: Record<string, unknown>[]): InnovationTopic[] {
  return raw.map(value => {
    const text = (key: string, fallback = 'N/A') => String(value[key] ?? fallback);
    const themeList = text('Themes').split(',').map(t => t.trim()).filter(Boolean) as Theme[];
    return {
      id: text('id'),
      topicName: text('Topic Name'),
      themes: themeList,
      category: text('Category'),
      subCategory: text('Sub Category'),
      lob: text('LOB'),
      portfolio: text('Portfolio'),
      businessOpportunity: text('Business Opportunity / Problem Statement'),
      innovativeApproach: text('Innovative Approach / Technology'),
      currentAdoptionStage: text('Current adoption stage'),
      adoptionScalingNarrative: text('Adoption and scaling narrative'),
      businessProductivityImpact: text('Business / Productivity Impact'),
      enterpriseInfluenceRecognition: text('Enterprise Influence & Recognition'),
      demoPrototype: text('Demo / Prototype'),
      reusability: text('Reusabilty of the Idea'),
      whyFeatured: text('Why should this Idea be featured'),
      spocName: text('SPOC Name Representing the Topic'),
      status: (['YES', 'MAYBE', 'WAITLIST'].includes(text('Status')) ? text('Status') : 'WAITLIST') as Status,
      score: Number(value.Score) || 0,
      comments: text('Comments'),
      additionalNotes: text('Additional Notes')
    };
  });
}

// ─── Auto-assign booths from topics list ──────────────────────────────────────
function buildBoothsFromTopics(topics: InnovationTopic[], base: BoothDefinition[]): BoothDefinition[] {
  const ids = topics.map(t => t.id);
  return base.map((booth, bi) => {
    const aSlot = bi * 2;
    const bSlot = bi * 2 + 1;
    const aTopics = ids.filter((_, i) => i % (base.length * 2) === aSlot || i % (base.length * 2) === aSlot + base.length * 2);
    const bTopics = ids.filter((_, i) => i % (base.length * 2) === bSlot || i % (base.length * 2) === bSlot + base.length * 2);
    const resolvedA = aTopics.length ? aTopics : [ids[aSlot % Math.max(1, ids.length)] || 'i1'];
    const resolvedB = bTopics.length ? bTopics : [ids[bSlot % Math.max(1, ids.length)] || 'i2'];
    return {
      ...booth,
      monitorA: { topicIds: resolvedA, label: booth.monitorA.label },
      monitorB: { topicIds: resolvedB, label: 'RIGHT MONITOR' },
      topicIds: [...resolvedA, ...resolvedB]
    };
  });
}

export function App() {
  const [rawData, setRawData] = useState<Record<string, unknown>[]>(rawTopics as Record<string, unknown>[]);
  const topics = useMemo(() => normalizeTopics(rawData), [rawData]);
  const [booths, setBooths] = useState<BoothDefinition[]>(BOOTHS_DATA);

  // All 6x8 Mode toggle (2 monitors everywhere)
  const [all6x8Mode, setAll6x8Mode] = useState(false);

  // Rebuild booths whenever topics change from upload
  const handleDataLoaded = (newRaw: Record<string, unknown>[]) => {
    setRawData(newRaw);
    const newTopics = normalizeTopics(newRaw);
    setBooths(buildBoothsFromTopics(newTopics, BOOTHS_DATA));
  };

  const [selectedBooth, setSelectedBooth] = useState<BoothDefinition | null>(booths[0]);
  const [isTrayOpen, setIsTrayOpen] = useState(true);
  const [selectedDemoTopic, setSelectedDemoTopic] = useState<InnovationTopic | null>(null);

  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({ YES: true, MAYBE: true, WAITLIST: true });
  const [sizeFilter, setSizeFilter] = useState<'ALL' | '6x6' | '6x8'>('ALL');
  const [currentView, setCurrentView] = useState<'booth' | 'floorplan' | 'schedule'>('booth');
  const [activeModal, setActiveModal] = useState<'details' | 'about' | 'shortlist' | 'themes' | 'search' | 'upload' | null>(null);
  const [shortlist, setShortlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('wf-showcase-shortlist') || '[]'); } catch { return []; }
  });

  // Clock tick every 30s to refresh slot calculations
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    localStorage.setItem('wf-showcase-shortlist', JSON.stringify(shortlist));
  }, [shortlist]);

  const toggleShortlist = (id: string) =>
    setShortlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const isShortlisted = (id: string) => shortlist.includes(id);

  const shortlistedTopics = useMemo(() => topics.filter(t => shortlist.includes(t.id)), [shortlist, topics]);

  const handleToggleStatus = (status: 'YES' | 'MAYBE' | 'WAITLIST') =>
    setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));

  // Dynamic THEME_ITEMS from actual data
  const dynamicThemeItems = useMemo(() => {
    const seen = new Set<string>();
    return THEME_ITEMS.filter(ti => {
      if (seen.has(ti.key)) return false;
      seen.add(ti.key);
      return topics.some(t => t.themes.includes(ti.key as Theme));
    });
  }, [topics]);

  const handleBoothSelect = (booth: BoothDefinition) => {
    setSelectedBooth(booth);
    setIsTrayOpen(true);
  };

  return (
    <div className="wf-app-root">
      <TopBar
        shortlistCount={shortlist.length}
        onOpenShortlist={() => setActiveModal('shortlist')}
        onOpenThemes={() => setActiveModal('themes')}
        onOpenSearch={() => setActiveModal('search')}
        onOpenUpload={() => setActiveModal('upload')}
        all6x8Mode={all6x8Mode}
        onToggleAll6x8Mode={() => setAll6x8Mode(v => !v)}
        currentView={currentView}
        onHomeClick={() => {
          setCurrentView('booth');
          setSelectedTheme(null);
          setSelectedBooth(booths[0]);
          setIsTrayOpen(true);
        }}
      />

      <main className="wf-main-stage">
        {currentView === 'booth' && (
          <div className="wf-showcase-hall-container">
            <LeftFilterPanel
              selectedTheme={selectedTheme}
              onSelectTheme={setSelectedTheme}
              statusFilters={statusFilters}
              onToggleStatus={handleToggleStatus}
              sizeFilter={sizeFilter}
              onSelectSizeFilter={setSizeFilter}
              themeItems={dynamicThemeItems}
            />

            <BoothView
              booths={booths}
              selectedBooth={selectedBooth}
              onSelectBooth={handleBoothSelect}
              selectedTheme={selectedTheme}
              statusFilters={statusFilters}
              topics={topics}
              all6x8Mode={all6x8Mode}
              onOpenThemes={() => setActiveModal('themes')}
              onOpenShortlist={() => setActiveModal('shortlist')}
              onOpenSearch={() => setActiveModal('search')}
            />

            {/* Right Slide-out Tray with Distributed Apps & 20-min Presentation Pipeline */}
            <RightTray
              booth={selectedBooth}
              topics={topics}
              isOpen={isTrayOpen}
              onClose={() => setIsTrayOpen(false)}
              isShortlisted={isShortlisted}
              onToggleShortlist={toggleShortlist}
              all6x8Mode={all6x8Mode}
              onToggleAll6x8Mode={() => setAll6x8Mode(v => !v)}
              onOpenDemo={t => setSelectedDemoTopic(t)}
            />
          </div>
        )}

        {currentView === 'floorplan' && (
          <FloorPlanView
            selectedBooth={selectedBooth}
            onSelectBooth={b => { setSelectedBooth(b); setIsTrayOpen(true); }}
            onBackToBoothView={() => setCurrentView('booth')}
          />
        )}

        {currentView === 'schedule' && (
          <ScheduleView
            booths={booths}
            topics={topics}
            onSelectBooth={b => { setSelectedBooth(b); setIsTrayOpen(true); setCurrentView('booth'); }}
          />
        )}
      </main>

      <BottomDock
        currentView={currentView === 'schedule' ? 'about' : currentView}
        onChangeView={view => {
          if (view === 'about') {
            setActiveModal('about');
          } else if (view === 'booth') {
            setCurrentView('booth');
          } else if (view === 'floorplan') {
            setCurrentView('floorplan');
          }
        }}
        onScheduleClick={() => setCurrentView('schedule')}
      />

      {/* Modals & Overlays */}
      <AnimatePresence>
        {activeModal === 'details' && selectedBooth && (
          <BoothModal
            booth={selectedBooth}
            topics={topics}
            isShortlisted={isShortlisted}
            onToggleShortlist={toggleShortlist}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'about' && <AboutModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'shortlist' && (
          <ShortlistModal
            shortlistedTopics={shortlistedTopics}
            booths={booths}
            onRemove={toggleShortlist}
            onSelectTopic={(_t, booth) => { setSelectedBooth(booth); setIsTrayOpen(true); setActiveModal(null); }}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'themes' && (
          <ThemesModal
            onSelectThemeAndClose={themeKey => {
              setSelectedTheme(themeKey);
              setCurrentView('booth');
              setActiveModal(null);
            }}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'search' && (
          <SearchModal
            topics={topics}
            booths={booths}
            onSelectTopic={(_t, booth) => { setSelectedBooth(booth); setIsTrayOpen(true); setActiveModal(null); }}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'upload' && (
          <JsonUploadModal
            onDataLoaded={handleDataLoaded}
            onClose={() => setActiveModal(null)}
            currentCount={topics.length}
          />
        )}
        {selectedDemoTopic && (
          <PrototypeSimulatorModal
            topic={selectedDemoTopic}
            onClose={() => setSelectedDemoTopic(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
