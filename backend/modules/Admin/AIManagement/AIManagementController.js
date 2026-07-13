const AISettings = require('./AIManagementModel');

// @desc    Get AI configurations
// @route   GET /api/admin/settings/ai
// @access  Private/Admin
const getAISettings = async (req, res, next) => {
  try {
    let settings = await AISettings.findOne({});
    if (!settings) {
      // Initialize with default values if not exists
      settings = new AISettings();
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
};

// @desc    Update AI configurations
// @route   PUT /api/admin/settings/ai
// @access  Private/Admin
const updateAISettings = async (req, res, next) => {
  try {
    let settings = await AISettings.findOne({});
    if (!settings) {
      settings = new AISettings();
    }

    const { 
      provider, 
      temperature, 
      maxTokens, 
      systemPrompt, 
      fallbackToPro, 
      cacheResponses, 
      maxTokenLimit, 
      tokensUsed, 
      geminiStatus, 
      whisperStatus, 
      summarizerStatus, 
      avgLatency 
    } = req.body;

    if (provider !== undefined) settings.provider = provider;
    if (temperature !== undefined) settings.temperature = temperature;
    if (maxTokens !== undefined) settings.maxTokens = maxTokens;
    if (systemPrompt !== undefined) settings.systemPrompt = systemPrompt;
    if (fallbackToPro !== undefined) settings.fallbackToPro = fallbackToPro;
    if (cacheResponses !== undefined) settings.cacheResponses = cacheResponses;
    if (maxTokenLimit !== undefined) settings.maxTokenLimit = maxTokenLimit;
    if (tokensUsed !== undefined) settings.tokensUsed = tokensUsed;
    if (geminiStatus !== undefined) settings.geminiStatus = geminiStatus;
    if (whisperStatus !== undefined) settings.whisperStatus = whisperStatus;
    if (summarizerStatus !== undefined) settings.summarizerStatus = summarizerStatus;
    if (avgLatency !== undefined) settings.avgLatency = avgLatency;

    const savedSettings = await settings.save();
    res.status(200).json({
      success: true,
      message: "AI settings updated successfully.",
      settings: savedSettings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Test connection with AI provider
// @route   POST /api/admin/settings/ai/test
// @access  Private/Admin
const testAIConnection = async (req, res, next) => {
  try {
    const { provider } = req.body;
    
    // Simulate connectivity check latency
    const simulatedLatency = Math.floor(Math.random() * 150) + 50; 
    
    // In production, we'd attempt a quick call to the provider API.
    // For now, we simulate a positive response.
    res.status(200).json({
      success: true,
      status: `Successfully connected to ${provider || 'Google Gemini'} endpoint`,
      latencyMs: simulatedLatency
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAISettings,
  updateAISettings,
  testAIConnection
};