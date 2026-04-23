const { handleAssistantQuery } = require('../services/aiService');
const asyncHandler = require('express-async-handler');

const queryAssistant = asyncHandler(async (req, res) => {
  const { query } = req.body;
  const userId = req.user._id;

  if (!query) {
    res.status(400);
    throw new Error('Please provide a query');
  }

  const response = await handleAssistantQuery(query, userId);
  res.json({ response });
});

module.exports = { queryAssistant };
