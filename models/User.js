import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  provider: {
    type: String,
    default: 'google',
  },
  progress: {
    type: Map,
    of: Number, // Example: { "quick-sort": 80, "linked-list": 100 }
    default: {}
  },
  bio: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "Student", // Student, Developer, Admin
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
