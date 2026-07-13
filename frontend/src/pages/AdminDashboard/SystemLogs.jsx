import React from 'react';
import { Terminal, HardDrive, Database } from 'lucide-react';

const SystemLogs = ({
  terminalLogs,
  terminalEndRef,
  isBackupRunning,
  triggerManualBackup
}) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Database and terminal stdout grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }} className="settings-layout">
        {/* Console card */}
        <div className="terminal-container">
          <div className="terminal-header">
            <span className="terminal-header-title">
              <Terminal className="h-4 w-4" />
              <span>vidyastra-server-logs-stdout</span>
            </span>
            <div className="terminal-dots">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
            </div>
          </div>

          <div className="terminal-body">
            {terminalLogs.map((log, index) => (
              <div key={index} className="terminal-log-line">{log}</div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Storage and backup trigger */}
        <div className="gorgeous-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="section-header-title" style={{ marginBottom: '16px' }}>
              <HardDrive className="h-5 w-5 text-indigo-600" />
              <span>Storage Allocation Ratios</span>
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold' }}>
              <span style={{ color: 'var(--text-muted)' }}>Disk Usage</span>
              <span style={{ color: 'var(--text)' }}>— / — (N/A)</span>
            </div>

            <div className="progress-bar-fancy-container" style={{ margin: '8px 0 16px 0' }}>
              <div className="progress-bar-fancy-fill" style={{ width: '0%', background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Video Archives:</span>
                <strong style={{ color: 'var(--text)' }}>N/A</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Database Snapshots:</span>
                <strong style={{ color: 'var(--text)' }}>N/A</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Logs & Diagnostics:</span>
                <strong style={{ color: 'var(--text)' }}>N/A</strong>
              </div>
            </div>
          </div>

          <button 
            className="btn-primary-rect" 
            style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
            onClick={triggerManualBackup}
            disabled={isBackupRunning}
          >
            <Database className="h-4 w-4" />
            <span>{isBackupRunning ? 'Creating Backup...' : 'Create Backup Snapshot'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
