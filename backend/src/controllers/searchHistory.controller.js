import SearchHistory from '../models/SearchHistory.js';
import catchAsync from '../utils/catchAsync.js';

export const getSearchHistories = catchAsync(async (req, res) => {
  const searchHistories = await SearchHistory.find({ createdBy: req.user._id })
    .sort({ createdAt: -1 }); // Sort by createdAt descending
  res.json(searchHistories);
});

export const createSearchHistory = catchAsync(async (req, res) => {
  const { agentId, question, answer, sessionId } = req.body;
  const newSearchHistory = await SearchHistory.create({
    agentId,
    question,
    answer,
    sessionId,
    createdBy: req.user._id,
  });
  res.status(201).json(newSearchHistory);
});
