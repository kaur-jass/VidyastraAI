import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';
import api from '../../services/api';

const AIManager = ({
  aiSettings,
  handleToggleAISetting,
  triggerToast
}) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {!aiSettings ? (
        <div className="gorgeous-card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          Loading AI Engine settings...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }} className="settings-layout">
          {/* Latency & Token utilization panel */}
          <div className="gorgeous-card">
            <h3 className="section-header-title">
              <Cpu className="h-5 w-5 text-indigo-600" />
              <span>Inference Consumption Meter</span>
            </h3>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold' }}>
                <span style={{ color: 'var(--text-muted)' }}>Monthly Token Allocation Usage</span>
                <span style={{ color: 'var(--text)' }}>
                  {aiSettings.tokensUsed?.toLocaleString() || 0} / {aiSettings.maxTokenLimit?.toLocaleString() || 0} ({aiSettings.maxTokenLimit > 0 ? Math.round((aiSettings.tokensUsed / aiSettings.maxTokenLimit) * 100) : 0}%)
                </span>
              </div>

              <div className="progress-bar-fancy-container">
                <div className="progress-bar-fancy-fill" style={{ width: `${aiSettings.maxTokenLimit > 0 ? Math.round((aiSettings.tokensUsed / aiSettings.maxTokenLimit) * 100) : 0}%` }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                <span>Billing cycle resets: {(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); })()}</span>
                <span>Estimated charge: ${(aiSettings.tokensUsed ? (aiSettings.tokensUsed / 100000).toFixed(2) : '0.00')} USD</span>
              </div>
            </div>

            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
              Model API Endpoints Latency (24h Average)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Gemini 1.5 Flash</span>
                  <strong style={{ fontSize: '20px', color: 'var(--text)', display: 'block', margin: '4px 0' }}>{aiSettings.avgLatency || '—'} ms</strong>
                  <span style={{ fontSize: '11px', color: aiSettings.geminiStatus === 'Operational' ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>
                    {aiSettings.geminiStatus === 'Operational' ? '✓ Normal' : '✗ Offline'}
                  </span>
                </div>
                <button 
                  className="btn-action-small" 
                  style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
                  onClick={async () => {
                    triggerToast("Testing connection to Gemini 1.5 Flash...");
                    try {
                      const res = await api.testAIConnection('gemini');
                      if (res.success) {
                        triggerToast(`Gemini: ${res.status || 'Connected'} (${res.latencyMs || 0}ms)`, 'success');
                      } else {
                        triggerToast("Gemini connection test failed", 'error');
                      }
                    } catch (err) {
                      triggerToast("Gemini connection test failed", 'error');
                    }
                  }}
                >
                  Test Connection
                </button>
              </div>

              <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Whisper Voice ASR</span>
                  <strong style={{ fontSize: '20px', color: 'var(--text)', display: 'block', margin: '4px 0' }}>{aiSettings.whisperLatency || aiSettings.avgLatency || '—'} ms</strong>
                  <span style={{ fontSize: '11px', color: aiSettings.whisperStatus === 'Operational' ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>
                    {aiSettings.whisperStatus === 'Operational' ? '✓ Operational' : '✗ Offline'}
                  </span>
                </div>
                <button 
                  className="btn-action-small" 
                  style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
                  onClick={async () => {
                    triggerToast("Testing connection to Whisper ASR...");
                    try {
                      const res = await api.testAIConnection('whisper');
                      if (res.success) {
                        triggerToast(`Whisper: ${res.status || 'Connected'} (${res.latencyMs || 0}ms)`, 'success');
                      } else {
                        triggerToast("Whisper connection test failed", 'error');
                      }
                    } catch (err) {
                      triggerToast("Whisper connection test failed", 'error');
                    }
                  }}
                >
                  Test Connection
                </button>
              </div>

              <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Syllabus Summarizer</span>
                  <strong style={{ fontSize: '20px', color: 'var(--text)', display: 'block', margin: '4px 0' }}>{aiSettings.summarizerLatency || aiSettings.avgLatency || '—'} ms</strong>
                  <span style={{ fontSize: '11px', color: aiSettings.summarizerStatus === 'Operational' ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>
                    {aiSettings.summarizerStatus === 'Operational' ? '✓ Excellent' : '✗ Offline'}
                  </span>
                </div>
                <button 
                  className="btn-action-small" 
                  style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
                  onClick={async () => {
                    triggerToast("Testing connection to Summarizer...");
                    try {
                      const res = await api.testAIConnection('summarizer');
                      if (res.success) {
                        triggerToast(`Summarizer: ${res.status || 'Connected'} (${res.latencyMs || 0}ms)`, 'success');
                      } else {
                        triggerToast("Summarizer connection test failed", 'error');
                      }
                    } catch (err) {
                      triggerToast("Summarizer connection test failed", 'error');
                    }
                  }}
                >
                  Test Connection
                </button>
              </div>
            </div>
          </div>

          {/* AI Tuning Settings */}
          <div className="gorgeous-card">
            <h3 className="section-header-title">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span>AI Model Switching Controls</span>
            </h3>

            <div className="toggle-switch-row">
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text)', display: 'block' }}>Fallback to Gemini Pro</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Use Gemini 1.5 Pro if Flash rate limits trigger</span>
              </div>
              <button 
                className={`toggle-switch-btn ${aiSettings.fallbackToPro ? 'active' : ''}`}
                onClick={() => handleToggleAISetting('fallbackToPro')}
              >
                <div className="toggle-switch-handle" />
              </button>
            </div>

            <div className="toggle-switch-row">
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text)', display: 'block' }}>Semantic Query Cache</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cache student queries to minimize API cost</span>
              </div>
              <button 
                className={`toggle-switch-btn ${aiSettings.cacheResponses ? 'active' : ''}`}
                onClick={() => handleToggleAISetting('cacheResponses')}
              >
                <div className="toggle-switch-handle" />
              </button>
            </div>

            <button 
              className="btn-primary-rect" 
              style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
              onClick={() => {
                triggerToast("Cache flush is not available — backend not configured.", "info");
              }}
            >
              <span>Flush Cache Memory</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIManager;
