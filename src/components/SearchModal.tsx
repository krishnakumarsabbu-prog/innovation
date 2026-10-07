import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Search, ArrowRight, User, Building } from 'lucide-react';
import type { InnovationTopic } from '../types/innovation';
import type { BoothDefinition } from '../data/boothsData';
import { playSelectSound } from '../utils/sound';

interface SearchModalProps {
  topics: InnovationTopic[];
  booths: BoothDefinition[];
  onSelectTopic: (topic: InnovationTopic, booth: BoothDefinition) => void;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  topics,
  booths,
  onSelectTopic,
  onClose
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return topics.slice(0, 8);
    const q = query.toLowerCase();
    return topics.filter((t) => {
      return (
        t.topicName.toLowerCase().includes(q) ||
        t.spocName.toLowerCase().includes(q) ||
        t.lob.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.innovativeApproach.toLowerCase().includes(q) ||
        t.businessOpportunity.toLowerCase().includes(q)
      );
    });
  }, [query, topics]);

  return (
    <div className="wf-modal-backdrop" onClick={onClose}>
      <motion.div
        className="wf-modal-dialog wf-search-dialog"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
      >
        <div className="wf-search-input-wrapper">
          <Search size={20} className="wf-search-icon" />
          <input
            type="text"
            className="wf-search-input"
            placeholder="Search by topic, SPOC, technology, keyword, or LOB..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="wf-clear-btn" onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
          <button className="wf-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="wf-search-results-list">
          <div className="wf-search-results-count">
            {query.trim() ? `Found ${results.length} results for "${query}"` : 'Featured Showcase Topics'}
          </div>

          {results.length === 0 ? (
            <div className="wf-search-no-results">
              <p>No matching topics found for "{query}". Try checking another keyword or SPOC name.</p>
            </div>
          ) : (
            results.map((topic) => {
              const booth = booths.find((b) => b.topicIds.includes(topic.id)) || booths[0];
              return (
                <button
                  key={topic.id}
                  className="wf-search-item"
                  onClick={() => {
                    playSelectSound();
                    onSelectTopic(topic, booth);
                  }}
                >
                  <div className="wf-search-item-badge" style={{ backgroundColor: booth.color }}>
                    {booth.id}
                  </div>
                  <div className="wf-search-item-body">
                    <h4>{topic.topicName}</h4>
                    <div className="wf-search-item-meta">
                      <span><User size={12} /> {topic.spocName}</span>
                      <span><Building size={12} /> {topic.lob}</span>
                      <span className={`wf-status-mini-tag status-${topic.status.toLowerCase()}`}>{topic.status}</span>
                      <span>Score: {topic.score}</span>
                    </div>
                  </div>
                  <div className="wf-search-item-go">
                    <ArrowRight size={16} />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};
