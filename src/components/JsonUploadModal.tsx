import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle2, AlertCircle, FileJson, X, RefreshCw } from 'lucide-react';

interface JsonUploadModalProps {
  onDataLoaded: (data: Record<string, unknown>[]) => void;
  onClose: () => void;
  currentCount: number;
}

type UploadState = 'idle' | 'parsing' | 'preview' | 'error';

export const JsonUploadModal: React.FC<JsonUploadModalProps> = ({
  onDataLoaded,
  onClose,
  currentCount
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [previewData, setPreviewData] = useState<Record<string, unknown>[] | null>(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const requiredFields = [
    'id', 'Topic Name', 'Themes', 'Status', 'Score',
    'SPOC Name Representing the Topic', 'Business Opportunity / Problem Statement',
    'Innovative Approach / Technology'
  ];

  const validateAndParse = (text: string, name: string) => {
    setState('parsing');
    setFileName(name);
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error('JSON must be an array of topic objects.');
      if (parsed.length === 0) throw new Error('JSON array is empty.');

      // Validate required fields on first record
      const missing = requiredFields.filter(f => !(f in parsed[0]));
      if (missing.length > 0) throw new Error(`Missing required fields: ${missing.join(', ')}`);

      // Validate Status values
      const badStatus = parsed.filter((r: Record<string,unknown>) =>
        !['YES','MAYBE','WAITLIST'].includes(String(r.Status ?? ''))
      );
      if (badStatus.length > 0) {
        throw new Error(`${badStatus.length} records have invalid Status (must be YES, MAYBE, or WAITLIST).`);
      }

      setPreviewData(parsed as Record<string, unknown>[]);
      setState('preview');
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Unknown parse error');
      setState('error');
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.json')) {
      setErrorMsg('Please upload a .json file.');
      setState('error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => validateAndParse(e.target?.result as string, file.name);
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleConfirm = () => {
    if (previewData) {
      onDataLoaded(previewData);
      onClose();
    }
  };

  const reset = () => {
    setState('idle');
    setPreviewData(null);
    setErrorMsg('');
    setFileName('');
  };

  // Get status distribution for preview
  const statusCount = previewData ? {
    YES: previewData.filter(r => r.Status === 'YES').length,
    MAYBE: previewData.filter(r => r.Status === 'MAYBE').length,
    WAITLIST: previewData.filter(r => r.Status === 'WAITLIST').length,
  } : null;

  // Theme distribution
  const themes = previewData
    ? [...new Set(previewData.map(r => String(r.Themes ?? '').split(',')[0].trim()))]
    : [];

  return (
    <div className="wf-modal-backdrop" onClick={onClose}>
      <motion.div
        className="wf-modal-dialog wf-upload-dialog"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        {/* Header */}
        <div className="wf-modal-header">
          <div className="wf-modal-header-left">
            <div className="wf-shortlist-title-wrap">
              <Upload size={20} className="wf-text-red" />
              <h2>Upload Innovation Topics JSON</h2>
            </div>
            <p className="wf-modal-sub">
              Replace the showcase topics by uploading a new JSON file — booths and schedule update automatically
            </p>
          </div>
          <button className="wf-modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="wf-upload-body">
          {/* Schema reference */}
          <div className="wf-upload-schema">
            <h4>Required JSON Schema</h4>
            <pre className="wf-schema-block">{`[
  {
    "id": "i1",
    "Topic Name": "...",
    "Themes": "Data / Security",
    "Category": "...",
    "Sub Category": "...",
    "LOB": "...",
    "Portfolio": "...",
    "Business Opportunity / Problem Statement": "...",
    "Innovative Approach / Technology": "...",
    "Current adoption stage": "Pilot|Prototype|Scaling",
    "Adoption and scaling narrative": "...",
    "Business / Productivity Impact": "...",
    "Enterprise Influence & Recognition": "...",
    "Demo / Prototype": "...",
    "Reusabilty of the Idea": "...",
    "Why should this Idea be featured": "...",
    "SPOC Name Representing the Topic": "...",
    "Status": "YES|MAYBE|WAITLIST",
    "Score": 90,
    "Comments": "...",
    "Additional Notes": "..."
  }
]`}</pre>
            <div className="wf-schema-note">
              <strong>Tip:</strong> Themes must match one of the 6 strategic pillars.
              Status must be YES, MAYBE, or WAITLIST. Score is a number 0–100.
            </div>
          </div>

          {/* Drop Zone / States */}
          {state === 'idle' || state === 'parsing' ? (
            <div
              className={`wf-drop-zone ${isDragging ? 'dragging' : ''} ${state === 'parsing' ? 'loading' : ''}`}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".json"
                className="wf-file-input-hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
              {state === 'parsing' ? (
                <div className="wf-parsing-indicator">
                  <RefreshCw size={32} className="wf-spin" />
                  <span>Parsing &amp; validating {fileName}…</span>
                </div>
              ) : (
                <>
                  <FileJson size={40} className="wf-drop-icon" />
                  <h3>Drop your JSON file here</h3>
                  <p>or <span className="wf-link">click to browse files</span></p>
                  <div className="wf-current-note">
                    Currently loaded: <strong>{currentCount} topics</strong>
                  </div>
                </>
              )}
            </div>
          ) : state === 'error' ? (
            <div className="wf-upload-error">
              <AlertCircle size={32} className="wf-error-icon" />
              <h3>Validation Failed</h3>
              <p>{errorMsg}</p>
              <button className="wf-retry-btn" onClick={reset}>
                <RefreshCw size={15} /> Try Again
              </button>
            </div>
          ) : state === 'preview' && previewData ? (
            <div className="wf-upload-preview">
              <div className="wf-preview-success-bar">
                <CheckCircle2 size={20} className="wf-success-icon" />
                <span><strong>{fileName}</strong> — {previewData.length} topics validated</span>
              </div>

              <div className="wf-preview-stats">
                <div className="wf-prev-stat">
                  <span className="wf-prev-label">Total Topics</span>
                  <strong>{previewData.length}</strong>
                </div>
                <div className="wf-prev-stat">
                  <span className="wf-prev-label">YES</span>
                  <strong className="wf-yes-color">{statusCount?.YES}</strong>
                </div>
                <div className="wf-prev-stat">
                  <span className="wf-prev-label">MAYBE</span>
                  <strong className="wf-maybe-color">{statusCount?.MAYBE}</strong>
                </div>
                <div className="wf-prev-stat">
                  <span className="wf-prev-label">WAITLIST</span>
                  <strong className="wf-wait-color">{statusCount?.WAITLIST}</strong>
                </div>
                <div className="wf-prev-stat">
                  <span className="wf-prev-label">Themes</span>
                  <strong>{themes.length}</strong>
                </div>
                <div className="wf-prev-stat">
                  <span className="wf-prev-label">Booths Needed</span>
                  <strong>{Math.ceil(previewData.length / 2)}</strong>
                </div>
              </div>

              <div className="wf-preview-list">
                <div className="wf-preview-list-head">
                  <span>#</span><span>ID</span><span>Topic Name</span><span>Theme</span><span>SPOC</span><span>Status</span><span>Score</span>
                </div>
                {previewData.slice(0, 8).map((r, i) => (
                  <div key={i} className="wf-preview-row">
                    <span className="wf-muted">{i + 1}</span>
                    <span className="wf-mono">{String(r.id)}</span>
                    <span className="wf-bold">{String(r['Topic Name'] ?? '').substring(0, 28)}</span>
                    <span className="wf-muted">{String(r.Themes ?? '').split(',')[0].trim().substring(0, 16)}</span>
                    <span className="wf-muted">{String(r['SPOC Name Representing the Topic'] ?? '').split(' ')[0]}</span>
                    <span className={`wf-status-mini-tag status-${String(r.Status ?? '').toLowerCase()}`}>{String(r.Status)}</span>
                    <span className="wf-bold">{String(r.Score)}</span>
                  </div>
                ))}
                {previewData.length > 8 && (
                  <div className="wf-preview-more">+{previewData.length - 8} more topics…</div>
                )}
              </div>

              <div className="wf-preview-actions">
                <button className="wf-retry-btn" onClick={reset}>
                  <RefreshCw size={14} /> Upload Different File
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="wf-modal-footer">
          <span className="wf-upload-footer-note">
            Upload replaces live data instantly — no page reload needed
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="wf-modal-close-btn" style={{ borderRadius: '8px', width: 'auto', padding: '9px 18px', fontSize: '13px' }} onClick={onClose}>
              Cancel
            </button>
            {state === 'preview' && (
              <button className="wf-inspector-cta-btn" style={{ width: 'auto', padding: '9px 24px' }} onClick={handleConfirm}>
                <CheckCircle2 size={16} /> Apply {previewData?.length} Topics
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
