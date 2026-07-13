import React from 'react';
import { TrendingUp } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="view-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="gorgeous-card">
          <h3 className="section-header-title">
            <TrendingUp className="h-4 w-4 text-indigo-500" /> Attendance Engagement Metric
          </h3>
          
          <div className="chart-svg-container" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px' }}>
            {[
              { day: 'Mon', hrs: 88, height: '88%' },
              { day: 'Tue', hrs: 92, height: '92%' },
              { day: 'Wed', hrs: 85, height: '85%' },
              { day: 'Thu', hrs: 95, height: '95%' },
              { day: 'Fri', hrs: 90, height: '90%' },
              { day: 'Sat', hrs: 75, height: '75%' },
              { day: 'Sun', hrs: 82, height: '82%' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <span style={{ fontSize: '11px', fontWeight: '700', marginBottom: '8px' }}>{item.hrs}%</span>
                <div style={{ width: '100%', height: '110px', backgroundColor: '#E2E8F0', borderRadius: '4px', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%', height: item.height, background: 'linear-gradient(to top, var(--primary) 0%, #818CF8 100%)', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '500' }}>{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
