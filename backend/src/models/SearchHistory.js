import mongoose from 'mongoose';

const SearchHistorySchema = mongoose.Schema(
  {
    agentId: { // Renamed from agent_id to agentId for consistency with JS naming
      type: String,
      required: [true, 'Please add an agent ID'],
      enum: ['agent-1', 'agent-2'],
    },
    question: {
      type: String,
      required: [true, 'Please add a question'],
    },
    answer: {
      type: String,
      required: [true, 'Please add an answer'],
    },
    sessionId: { // Renamed from session_id to sessionId
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const SearchHistory = mongoose.model('SearchHistory', SearchHistorySchema);

export default SearchHistory;
