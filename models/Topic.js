import mongoose from 'mongoose';

const TopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this topic.'],
    maxlength: 60,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
  },
  visualizerLink: String,
  resources: [String],
});

export default mongoose.models.Topic || mongoose.model('Topic', TopicSchema);
