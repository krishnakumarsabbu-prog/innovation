import React from 'react';
import { MapPin, LayoutGrid, Info, CalendarClock } from 'lucide-react';
import { playSelectSound } from '../utils/sound';

interface BottomDockProps {
  currentView: 'booth' | 'floorplan' | 'about';
  onChangeView: (view: 'booth' | 'floorplan' | 'about') => void;
  onScheduleClick: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  currentView,
  onChangeView,
  onScheduleClick
}) => {
  return (
    <div className="wf-bottom-dock-wrapper">
      <div className="wf-bottom-dock">
        <button
          className={`wf-dock-item ${currentView === 'floorplan' ? 'active' : ''}`}
          onClick={() => { playSelectSound(); onChangeView('floorplan'); }}
        >
          <MapPin size={17} />
          <span>Floor Plan</span>
        </button>

        <button
          className={`wf-dock-item ${currentView === 'booth' ? 'active' : ''}`}
          onClick={() => { playSelectSound(); onChangeView('booth'); }}
        >
          <LayoutGrid size={17} />
          <span>Booth View</span>
        </button>

        <button
          className="wf-dock-item"
          onClick={() => { playSelectSound(); onScheduleClick(); }}
        >
          <CalendarClock size={17} />
          <span>Schedule</span>
        </button>

        <button
          className={`wf-dock-item ${currentView === 'about' ? 'active' : ''}`}
          onClick={() => { playSelectSound(); onChangeView('about'); }}
        >
          <Info size={17} />
          <span>About</span>
        </button>
      </div>
    </div>
  );
};
