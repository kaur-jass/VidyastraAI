const AnalyticsMetric = require('./AnalyticsModel');

// Seeding helper to create initial analytics database if empty
const seedAnalyticsIfEmpty = async () => {
  const count = await AnalyticsMetric.countDocuments({});
  if (count === 0) {
    const defaultData = [
      { date: '2026-06-09', activeSessions: 150, geminiCalls: 650, whisperCalls: 250, summarizerCalls: 100 },
      { date: '2026-06-10', activeSessions: 120, geminiCalls: 500, whisperCalls: 200, summarizerCalls: 80 },
      { date: '2026-06-11', activeSessions: 80, geminiCalls: 400, whisperCalls: 150, summarizerCalls: 60 },
      { date: '2026-06-12', activeSessions: 130, geminiCalls: 550, whisperCalls: 220, summarizerCalls: 90 },
      { date: '2026-06-13', activeSessions: 60, geminiCalls: 300, whisperCalls: 100, summarizerCalls: 40 },
      { date: '2026-06-14', activeSessions: 140, geminiCalls: 600, whisperCalls: 240, summarizerCalls: 95 },
      { date: '2026-06-15', activeSessions: 195, geminiCalls: 800, whisperCalls: 310, summarizerCalls: 125 }
    ];
    await AnalyticsMetric.insertMany(defaultData);
  }
};

// @desc    Get daily sessions for last 7 days
// @route   GET /api/admin/analytics/sessions
// @access  Private/Admin
const getDailySessions = async (req, res, next) => {
  try {
    await seedAnalyticsIfEmpty();
    const metrics = await AnalyticsMetric.find({}).sort({ date: 1 }).limit(7);
    
    // Format response in simplified chart data structure
    const formattedData = metrics.map(m => ({
      date: m.date,
      activeSessions: m.activeSessions
    }));
    
    res.status(200).json(formattedData);
  } catch (err) {
    next(err);
  }
};

// @desc    Get AI model API call ratios
// @route   GET /api/admin/analytics/model-ratios
// @access  Private/Admin
const getModelRatios = async (req, res, next) => {
  try {
    await seedAnalyticsIfEmpty();
    const metrics = await AnalyticsMetric.find({});
    
    let totalGemini = 0;
    let totalWhisper = 0;
    let totalSummarizer = 0;
    
    metrics.forEach(m => {
      totalGemini += m.geminiCalls;
      totalWhisper += m.whisperCalls;
      totalSummarizer += m.summarizerCalls;
    });
    
    const totalCalls = totalGemini + totalWhisper + totalSummarizer;
    
    res.status(200).json({
      totalCalls,
      ratios: {
        gemini: totalCalls > 0 ? parseFloat(((totalGemini / totalCalls) * 100).toFixed(1)) : 0,
        whisper: totalCalls > 0 ? parseFloat(((totalWhisper / totalCalls) * 100).toFixed(1)) : 0,
        summarizer: totalCalls > 0 ? parseFloat(((totalSummarizer / totalCalls) * 100).toFixed(1)) : 0
      },
      counts: {
        gemini: totalGemini,
        whisper: totalWhisper,
        summarizer: totalSummarizer
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDailySessions,
  getModelRatios
};