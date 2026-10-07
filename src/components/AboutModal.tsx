import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, MapPin, Sparkles, Award, Users, Layers } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="wf-modal-backdrop" onClick={onClose}>
      <motion.div
        className="wf-modal-dialog wf-about-dialog"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        <div className="wf-about-hero">
          <div className="wf-brand-mark wf-brand-mark-lg">
            <span className="wf-brand-name">WELLS</span>
            <span className="wf-brand-name">FARGO</span>
          </div>
          <h2>Innovation Showcase 2026</h2>
          <p className="wf-about-tagline">Ideas Today. Impact Tomorrow.</p>
          <button className="wf-modal-close-btn wf-about-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="wf-about-content">
          <p className="wf-about-intro">
            Welcome to the Wells Fargo Innovation Showcase — a premier exhibition bringing together cross-enterprise
            breakthroughs across artificial intelligence, cloud modernization, data trust, and engineering excellence.
          </p>

          <div className="wf-about-stats-grid">
            <div className="wf-about-stat-card">
              <Sparkles size={24} className="wf-stat-icon" />
              <strong>22</strong>
              <span>Featured Innovations</span>
            </div>
            <div className="wf-about-stat-card">
              <Layers size={24} className="wf-stat-icon" />
              <strong>6</strong>
              <span>Strategic Themes</span>
            </div>
            <div className="wf-about-stat-card">
              <MapPin size={24} className="wf-stat-icon" />
              <strong>9</strong>
              <span>Physical Booths</span>
            </div>
            <div className="wf-about-stat-card">
              <Award size={24} className="wf-stat-icon" />
              <strong>94+</strong>
              <span>Top Evaluation Scores</span>
            </div>
          </div>

          <div className="wf-about-guidelines">
            <h3>How to Explore</h3>
            <ul>
              <li><strong>Interactive 3D Hall:</strong> Hover over any illuminated booth on the atrium floor and click to inspect its live showcase details.</li>
              <li><strong>Theme Filtering:</strong> Use the left navigation to highlight specific strategic priorities like Gen AI, Security, or Modernization.</li>
              <li><strong>Curate Your Shortlist:</strong> Save the most impactful initiatives for follow-up and collaboration.</li>
            </ul>
          </div>
        </div>

        <div className="wf-modal-footer">
          <span className="wf-about-time"><Calendar size={14} /> Full Day Showcase · Main Campus Atrium</span>
          <button className="wf-modal-done-btn" onClick={onClose}>Got it</button>
        </div>
      </motion.div>
    </div>
  );
};
