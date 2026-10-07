import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import { BOOTHS_DATA } from '../data/boothsData';
import type { BoothDefinition } from '../data/boothsData';
import { playSelectSound } from '../utils/sound';

interface FloorPlanViewProps {
  selectedBooth: BoothDefinition | null;
  onSelectBooth: (booth: BoothDefinition) => void;
  onBackToBoothView: () => void;
}

export const FloorPlanView: React.FC<FloorPlanViewProps> = ({
  selectedBooth,
  onSelectBooth,
  onBackToBoothView
}) => {
  return (
    <div className="wf-floorplan-page">
      <div className="wf-floorplan-header">
        <div>
          <span className="wf-floorplan-eyebrow">EXHIBITION LAYOUT</span>
          <h2>Showcase Architectural Floor Plan</h2>
          <p>Interactive 2D schematic of the main hall and innovation wings</p>
        </div>
        <button className="wf-back-to-hall-btn" onClick={onBackToBoothView}>
          <ArrowLeft size={16} />
          <span>Return to 3D Booth View</span>
        </button>
      </div>

      <div className="wf-floorplan-canvas">
        {/* Stage Area */}
        <div className="wf-fp-stage">
          <div className="wf-fp-stage-title">MAIN KEYNOTE STAGE & EXECUTIVE ADDRESS</div>
        </div>

        {/* Booths Grid */}
        <div className="wf-fp-grid">
          {BOOTHS_DATA.map((booth) => {
            const isSelected = selectedBooth?.id === booth.id;
            return (
              <motion.button
                key={booth.id}
                className={`wf-fp-booth ${booth.size} ${isSelected ? 'selected' : ''}`}
                style={{ '--accent-color': booth.color } as React.CSSProperties}
                whileHover={{ scale: 1.03 }}
                onClick={() => {
                  playSelectSound();
                  onSelectBooth(booth);
                  onBackToBoothView();
                }}
              >
                <div className="wf-fp-booth-id" style={{ backgroundColor: booth.color }}>
                  {booth.id}
                </div>
                <div className="wf-fp-booth-info">
                  <strong>{booth.themeDisplay}</strong>
                  <span>{booth.size.replace('x', ' × ')} • {booth.teams} {booth.teams === 1 ? 'Team' : 'Teams'}</span>
                  <div className="wf-fp-tags">
                    {booth.tags.map((t, idx) => (
                      <span key={idx}>{t}</span>
                    ))}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Central Lounge Area */}
        <div className="wf-fp-lounge">
          <MapPin size={16} />
          <span>EXECUTIVE NETWORKING & CONNECTIVITY LOUNGE</span>
        </div>
      </div>
    </div>
  );
};
