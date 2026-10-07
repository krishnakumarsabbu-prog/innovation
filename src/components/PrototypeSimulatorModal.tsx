import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Play, RefreshCw, CheckCircle, Shield, Sparkles, Terminal, Activity, Layers } from 'lucide-react';
import type { InnovationTopic } from '../types/innovation';
import { playSelectSound } from '../utils/sound';

interface PrototypeSimulatorModalProps {
  topic: InnovationTopic | null;
  onClose: () => void;
}

export const PrototypeSimulatorModal: React.FC<PrototypeSimulatorModalProps> = ({ topic, onClose }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'System initialized with enterprise guardrails v4.2',
    'Streaming telemetry connected to Kafka topic: event_hub.prod',
    'Model baseline weights verified: 99.4% precision index'
  ]);

  if (!topic) return null;

  const handleRunSim = () => {
    setIsRunning(true);
    playSelectSound();
    setTimeout(() => {
      setLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Live payload dispatched to inference pipeline...`,
        `[${new Date().toLocaleTimeString()}] Feature extraction: 24 vector attributes scored.`,
        ...prev
      ]);
    }, 600);
    setTimeout(() => {
      setLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Output synthesized with ${topic.score}% confidence.`,
        `[${new Date().toLocaleTimeString()}] Governance compliance: AUDITED & SIGNED.`,
        ...prev
      ]);
      setIsRunning(false);
      setActiveStep(s => Math.min(s + 1, 3));
    }, 1400);
  };

  return (
    <div className="wf-modal-overlay" onClick={onClose}>
      <motion.div
        className="wf-modal-box wf-prototype-modal"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="wf-proto-header">
          <div className="wf-proto-header-left">
            <span className="wf-proto-badge">
              <Sparkles size={13} />
              INTERACTIVE DEMO SIMULATOR
            </span>
            <h2>{topic.topicName}</h2>
            <p>Live Prototype Sandbox • {topic.demoPrototype} • SPOC: {topic.spocName}</p>
          </div>
          <button className="wf-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="wf-proto-body">
          {/* Top pipeline stepper */}
          <div className="wf-proto-stepper">
            <div className={`wf-proto-step ${activeStep >= 1 ? 'completed' : ''}`}>
              <div className="wf-step-num">1</div>
              <span>Input & Telemetry</span>
            </div>
            <div className="wf-step-line" />
            <div className={`wf-proto-step ${activeStep >= 2 ? 'completed' : ''}`}>
              <div className="wf-step-num">2</div>
              <span>Intelligence Pipeline</span>
            </div>
            <div className="wf-step-line" />
            <div className={`wf-proto-step ${activeStep >= 3 ? 'completed' : ''}`}>
              <div className="wf-step-num">3</div>
              <span>Enterprise Outcome</span>
            </div>
          </div>

          {/* Interactive sandbox screen */}
          <div className="wf-proto-sandbox">
            <div className="wf-sandbox-topbar">
              <div className="wf-sandbox-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <span className="wf-sandbox-title">{topic.topicName.toLowerCase().replace(/\s+/g, '-')}-demo.wf.internal</span>
              <span className="wf-sandbox-status">
                <Activity size={12} />
                ONLINE
              </span>
            </div>

            <div className="wf-sandbox-content">
              <div className="wf-sandbox-left">
                <h4>Approach & Technology</h4>
                <p className="wf-sb-desc">{topic.innovativeApproach}</p>

                <div className="wf-sb-metrics">
                  <div className="wf-sb-metric">
                    <span>Performance Score</span>
                    <strong>{topic.score} / 100</strong>
                  </div>
                  <div className="wf-sb-metric">
                    <span>Target LOB</span>
                    <strong>{topic.lob}</strong>
                  </div>
                  <div className="wf-sb-metric">
                    <span>Current Stage</span>
                    <strong>{topic.currentAdoptionStage}</strong>
                  </div>
                </div>

                <div className="wf-sb-action-box">
                  <button
                    className={`wf-sb-run-btn ${isRunning ? 'running' : ''}`}
                    onClick={handleRunSim}
                    disabled={isRunning}
                  >
                    {isRunning ? <RefreshCw size={15} className="spin" /> : <Play size={15} fill="currentColor" />}
                    <span>{isRunning ? 'Processing Pipeline...' : 'Execute Live Simulation'}</span>
                  </button>
                  <span className="wf-sb-hint">Click to trigger simulated payload processing</span>
                </div>
              </div>

              <div className="wf-sandbox-right">
                <div className="wf-terminal-header">
                  <Terminal size={13} />
                  <span>Telemetry & Model Logs</span>
                </div>
                <div className="wf-terminal-window">
                  {logs.map((log, idx) => (
                    <div key={idx} className="wf-terminal-line">
                      <span className="wf-term-prompt">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="wf-proto-footer-narrative">
            <strong>Business & Productivity Impact:</strong> {topic.businessProductivityImpact}
          </div>
        </div>

        <div className="wf-proto-footer">
          <span className="wf-proto-reusability">
            <Layers size={13} />
            Reusability: {topic.reusability}
          </span>
          <button className="wf-proto-close-btn" onClick={onClose}>
            Close Simulator
          </button>
        </div>
      </motion.div>
    </div>
  );
};
