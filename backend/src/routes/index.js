import authRoutes from './auth.routes.js';
import searchHistoryRoutes from './searchHistory.routes.js';
import { invokeLLM } from '../llm/llm.service.js';
import { protect } from '../auth/auth.middleware.js'; // Protect LLM route too

const API_PREFIX = '/api/v1';

const routes = (app) => {
  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/search-histories`, searchHistoryRoutes);

  // LLM Integration route
  app.post(`${API_PREFIX}/llm/invoke`, protect, async (req, res, next) => {
    try {
      const response = await invokeLLM(req.body);
      res.json(response);
    } catch (error) {
      next(error); // Pass errors to Express error handler
    }
  });
};

export default routes;
