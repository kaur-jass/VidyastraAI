import React from 'react';
import { Users, Cpu } from 'lucide-react';

const AnalyticsReports = ({
  dailySessions,
  sessionsPointsList,
  modelRatios,
  geminiPercent,
  whisperPercent,
  summarizerPercent
}) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="settings-layout">
        {/* Chart 1: Daily Active Users */}
        <div className="gorgeous-card">
          <h3 className="section-header-title">
            <Users className="h-5 w-5 text-indigo-600" />
            <span>Daily Active Sessions</span>
          </h3>
          <div style={{ width: '100%', height: '220px', margin: '20px 0' }}>
            {dailySessions && dailySessions.length > 0 ? (
              <svg viewBox="0 0 500 220" width="100%" height="100%">
                <line x1="40" y1="20" x2="480" y2="20" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="40" y1="70" x2="480" y2="70" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="40" y1="120" x2="480" y2="120" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="40" y1="170" x2="480" y2="170" stroke="#E2E8F0" strokeWidth="1" />

                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={sessionsPointsList.join(' ')}
                />
                {dailySessions.map((m, idx) => {
                  const x = 40 + idx * 73;
                  const y = 170 - (m.activeSessions / 250) * 150;
                  return <circle key={idx} cx={x} cy={y} r="4" fill="#10B981" />;
                })}
                {dailySessions.map((m, idx) => {
                  const x = 40 + idx * 73;
                  const dateObj = new Date(m.date);
                  const formattedDate = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
                  return (
                    <text key={idx} x={x} y="195" fill="#64748B" fontSize="9" textAnchor="middle">
                      {formattedDate}
                    </text>
                  );
                })}
              </svg>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                Loading platform activity analytics...
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: API Calls Count */}
        <div className="gorgeous-card">
          <h3 className="section-header-title">
            <Cpu className="h-5 w-5 text-indigo-600" />
            <span>AI Model API Call Ratios</span>
          </h3>
          <div style={{ width: '100%', height: '220px', margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {modelRatios ? (
              <>
                <svg viewBox="0 0 200 200" width="160" height="160">
                  {/* Pie segments (Circle Dasharray math) */}
                  {/* Segment 1: Gemini */}
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#4F46E5" strokeWidth="30" strokeDasharray="439.8" strokeDashoffset="0" transform="rotate(-90 100 100)" />
                  {/* Segment 2: Whisper */}
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#10B981" strokeWidth="30" strokeDasharray="439.8" strokeDashoffset={- (geminiPercent / 100) * 439.8} transform="rotate(-90 100 100)" />
                  {/* Segment 3: Summarizer */}
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#F59E0B" strokeWidth="30" strokeDasharray="439.8" strokeDashoffset={- ((geminiPercent + whisperPercent) / 100) * 439.8} transform="rotate(-90 100 100)" />
                </svg>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', marginLeft: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4F46E5' }} />
                    <span>Gemini Flash ({geminiPercent}%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <span>Whisper ASR ({whisperPercent}%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                    <span>Summarizer ({summarizerPercent}%)</span>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>
                Loading model API ratio metrics...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;
