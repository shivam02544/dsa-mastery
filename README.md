# DSA Mastery - Visual Learning Platform

A premium, interactive platform for learning Data Structures and Algorithms, built with **Next.js 14**, **Tailwind CSS**, and **MongoDB**.

## Features

- **Interactive Visualizations**: Watch algorithms like Bubble Sort in real-time with smooth animations.
- **Progress Tracking**: Topics and progress are stored in your local MongoDB database.
- **Premium UI**: Glassmorphism, gradients, and dark mode for a modern 'Wow' factor.
- **Tech Stack**: Next.js (App Router), Mongoose, Framer Motion, Tailwind CSS v4.

## Getting Started

1. **Ensure MongoDB is running** on your local machine (`mongodb://localhost:27017`).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Database Seeding

The application automatically seeds the database with initial topics (Bubble Sort, Binary Search, etc.) when you first visit the `/learn` page.

## Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components (Navbar, Button, SortingVisualizer).
- `lib/`: Database connection and utilities.
- `models/`: Mongoose schemas (Topic).
