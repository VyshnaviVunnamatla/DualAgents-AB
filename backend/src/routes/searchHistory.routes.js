import express from 'express';
import { getSearchHistories, createSearchHistory } from '../controllers/searchHistory.controller.js';
import { protect } from '../auth/auth.middleware.js';

const router = express.Router();

router.route('/').get(protect, getSearchHistories).post(protect, createSearchHistory);

export default router;
