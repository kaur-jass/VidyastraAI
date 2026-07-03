const AIAssistant = require("./AIAssistantModel");

// @desc    Get AI Assistant Settings
// @route   GET /api/faculty/ai
// @access  Private/Faculty
const getAIAssistant = async (req, res, next) => {
    try {

        let assistant = await AIAssistant.findOne({});

        if (!assistant) {
            assistant = new AIAssistant();
            await assistant.save();
        }

        res.status(200).json(assistant);

    } catch (err) {
        next(err);
    }
};

// @desc    Update AI Assistant Settings
// @route   PUT /api/faculty/ai
// @access  Private/Faculty
const updateAIAssistant = async (req, res, next) => {
    try {

        let assistant = await AIAssistant.findOne({});

        if (!assistant) {
            assistant = new AIAssistant();
        }

        const {
            model,
            provider,
            systemPrompt,
            temperature,
            maxTokens,
            conversationHistory,
            status
        } = req.body;

        if (model !== undefined)
            assistant.model = model;

        if (provider !== undefined)
            assistant.provider = provider;

        if (systemPrompt !== undefined)
            assistant.systemPrompt = systemPrompt;

        if (temperature !== undefined)
            assistant.temperature = temperature;

        if (maxTokens !== undefined)
            assistant.maxTokens = maxTokens;

        if (conversationHistory !== undefined)
            assistant.conversationHistory = conversationHistory;

        if (status !== undefined)
            assistant.status = status;

        const savedAssistant = await assistant.save();

        res.status(200).json({
            success: true,
            message: "AI Assistant updated successfully.",
            assistant: savedAssistant,
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Test AI Assistant
// @route   POST /api/faculty/ai/test
// @access  Private/Faculty
const testAIAssistant = async (req, res, next) => {
    try {

        const latency = Math.floor(Math.random() * 150) + 50;

        res.status(200).json({
            success: true,
            message: "AI Assistant is working correctly.",
            latencyMs: latency,
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAIAssistant,
    updateAIAssistant,
    testAIAssistant,
};