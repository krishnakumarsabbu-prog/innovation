import React from 'react';
import { motion } from 'framer-motion';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import type { InnovationTopic } from '../types/innovation';
import type { BoothDefinition } from '../data/boothsData';
import { playSelectSound } from '../utils/sound';

interface ShortlistModalProps {
  shortlistedTopics: InnovationTopic[];
  booths: BoothDefinition[];
  onRemove: (id: string) => void;
  onSelectTopic: (topic: InnovationTopic, booth: BoothDefinition) => void;
  onClose: () => void;
}

export const ShortlistModal: React.FC<ShortlistModalProps> = ({
  shortlistedTopics,
  booths,
  onRemove,
  onSelectTopic,
  onClose
}) => {
  return (
    <div className="wf-modal-backdrop" onClick={onClose}>
      <motion.div
        className="wf-modal-dialog wf-shortlist-dialog"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        <div className="wf-modal-header">
          <div className="wf-modal-header-left">
            <div className="wf-shortlist-title-wrap">
              <Bookmark size={20} className="wf-text-red" />
              <h2>My Saved Shortlist</h2>
            </div>
            <p className="wf-modal-sub">
              {shortlistedTopics.length} {shortlistedTopics.length === 1 ? 'idea' : 'ideas'} curated for follow-up and collaboration
            </p>
          </div>
          <button className="wf-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="wf-shortlist-body">
          {shortlistedTopics.length === 0 ? (
            <div className="wf-empty-shortlist">
              <Bookmark size={40} strokeWidth={1.5} />
              <h3>No topics shortlisted yet</h3>
              <p>Explore any booth in the hall and click "Add to Shortlist" to collect priority innovations here.</p>
            </div>
          ) : (
            <div className="wf-shortlist-list">
              {shortlistedTopics.map((topic) => {
                const parentBooth = booths.find((b) => b.topicIds.includes(topic.id)) || booths[0];
                return (
                  <div key={topic.id} className="wf-shortlist-item">
                    <div className="wf-shortlist-item-left">
                      <div className="wf-shortlist-item-badge" style={{ backgroundColor: parentBooth.color }}>
                        {parentBooth.id}
                      </div>
                      <div className="wf-shortlist-item-info">
                        <h4>{topic.topicName}</h4>
                        <span className="wf-shortlist-item-spoc">SPOC: {topic.spocName} • {topic.lob}</span>
                        <p>{topic.innovativeApproach}</p>
                      </div>
                    </div>

                    <div className="wf-shortlist-item-actions">
                      <div className="wf-score-pill">
                        <strong>{topic.score}</strong> pts
                      </div>
                      <button
                        className="wf-shortlist-open-btn"
                        onClick={() => {
                          playSelectSound();
                          onSelectTopic(topic, parentBooth);
                        }}
                      >
                        <span>View</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        className="wf-shortlist-remove-btn"
                        onClick={() => {
                          playSelectSound();
                          onRemove(topic.id);
                        }}
                        title="Remove from shortlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="wf-modal-footer">
          <span>Shortlist saved in your browser session</span>
          <button className="wf-modal-done-btn" onClick={onClose}>Done</button>
        </div>
      </motion.div>
    </div>
  );
};
