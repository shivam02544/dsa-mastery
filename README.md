# DSA Mastery - Interactive Learning Platform 🚀

Welcome to **DSA Mastery**, a premium, interactive platform designed to help you master Data Structures and Algorithms through real-time visualizations and hands-on practice.

## ✨ Features

### 🎨 Visual Learning

Learn complex algorithms with intuitive, animated visualizations.

- **Sorting Algorithms**: Step-by-step visualization of Bubble Sort, Merge Sort, Quick Sort, and more.
- **Linear Structures**: Visualize operations on Arrays, Linked Lists, Stacks, and Queues.
- **Trees & Graphs**: Interactive demos for Binary Search Trees (BST), BFS, DFS, and pathfinding algorithms.
- **Playback Controls**: Adjust speed, pause/play, or step through algorithms manually to understand every move.

### 👤 User Progress

- **Google Authentication**: Secure sign-in to save your progress across devices.
- **Mastery Tracking**: Track which algorithms you've learned and mastered.
- **Persistent Data**: All user data and progress are stored securely in MongoDB.

### 💻 Modern UI/UX

- **Glassmorphism Design**: sleek, modern interface with vibrant gradients and blur effects.
- **Dark Mode**: Optimized for long coding sessions.
- **Responsive**: Works beautifully on desktop and tablet.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js installed.
- MongoDB running locally or a MongoDB Atlas URI.
- Google Cloud Console project (for OAuth).

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd dsa-mastery
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add the following keys (see `env.example`):

   ```bash
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_generated_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   MONGODB_URI=mongodb://localhost:27017/dsa-mastery
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Open the app**:
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```bash
├── app/                  # Next.js App Router pages
├── components/           # React components
│   ├── GraphVisualizer   # Graph algorithm visualizations
│   ├── LinearVisualizer  # Array/List visualizations
│   ├── SortingVisualizer # Sorting algorithm visualizations
│   ├── TreeVisualizer    # Tree visualizations
│   └── ...
├── lib/                  # Utility functions & DB connection
├── models/               # Mongoose database models
└── public/               # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for the DSA community.
