import dbConnect from '@/lib/db';
import Topic from '@/models/Topic';
import Link from 'next/link';
import { ArrowRight, Book, Star, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Force dynamic rendering since we are fetching from DB which might change
export const dynamic = 'force-dynamic';

async function getTopics() {
  await dbConnect();
  
  const seedData = [
    {
      title: "Bubble Sort",
      description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
      difficulty: "Easy",
      visualizerLink: "/visualizer?algo=BUBBLE",
      resources: ["https://en.wikipedia.org/wiki/Bubble_sort"]
    },
    {
      title: "Selection Sort",
      description: "The selection sort algorithm sorts an array by repeatedly finding the minimum element from unsorted part and putting it at the beginning.",
      difficulty: "Easy",
      visualizerLink: "/visualizer?algo=SELECTION",
      resources: []
    },
    {
      title: "Insertion Sort",
      description: "Insertion sort is a simple sorting algorithm that builds the final sorted array (or list) one item at a time.",
      difficulty: "Medium",
      visualizerLink: "/visualizer?algo=INSERTION", 
      resources: []
    },
    {
      title: "Merge Sort",
      description: "Merge Sort is a Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
      difficulty: "Hard",
      visualizerLink: "/visualizer?algo=MERGE",
      resources: []
    },
    {
      title: "Quick Sort",
      description: "An efficient, divide-and-conquer sorting algorithm that selects a 'pivot' and partitions the array.",
      difficulty: "Medium",
      visualizerLink: "/visualizer?algo=QUICK",
      resources: []
    },
    {
      title: "Binary Search",
      description: "Search a sorted array by repeatedly dividing the search interval in half.",
      difficulty: "Easy",
      visualizerLink: "/visualizer?algo=BINARY_SEARCH",
      resources: []
    },
    {
      title: "Dijkstra's Algorithm",
      description: "Finds the shortest paths between nodes in a graph.",
      difficulty: "Hard",
      visualizerLink: "/visualizer?algo=DIJKSTRA",
      resources: []
    },
    {
      title: "Binary Search Tree",
      description: "A node-based binary tree data structure which has the property that the left subtree contains only nodes with keys less than the node's key.",
      difficulty: "Medium",
      visualizerLink: "/visualizer?algo=BST",
      resources: []
    },
    {
      title: "Breadth-First Search",
      description: "Traverses a graph level by level.",
      difficulty: "Medium",
      visualizerLink: "/visualizer?algo=BFS",
      resources: []
    },
    {
      title: "Depth-First Search",
      description: "Traverses a graph by exploring node branches as deep as possible.",
      difficulty: "Medium",
      visualizerLink: "/visualizer?algo=DFS",
      resources: []
    },
    {
      title: "Singly Linked List",
      description: "A linear collection of data elements where each element points to the next.",
      difficulty: "Medium",
      visualizerLink: "/visualizer?algo=LINKED_LIST",
      resources: []
    },
    {
      title: "Stack",
      description: "A linear data structure which follows LIFO (Last In First Out) order.",
      difficulty: "Easy",
      visualizerLink: "/visualizer?algo=STACK",
      resources: []
    },
    {
      title: "Queue",
      description: "A linear data structure which follows FIFO (First In First Out) order.",
      difficulty: "Easy",
      visualizerLink: "/visualizer?algo=QUEUE",
      resources: []
    }
  ];

  // Check if we need to seed or update
  const count = await Topic.countDocuments();
  
  if (count === 0) {
    await Topic.insertMany(seedData);
  } else {
    // Ensure new fields/topics are present (basic check)
    for (const topic of seedData) {
      const exists = await Topic.exists({ title: topic.title });
      if (!exists) {
        await Topic.create(topic);
      }
    }
  }

  const topics = await Topic.find({});
  return topics;
}

export default async function LearnPage() {
  const topics = await getTopics();
  const session = await getServerSession(authOptions);
  
  // Note: session.user.progress is populated in the session callback
  // It is a Map or Object. Mongo Map comes as Object in JSON.
  const userProgress = session?.user?.progress || {};

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-pink-500 to-red-500">
          Master Data Structures
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Explore our comprehensive curriculum designed to take you from beginner to expert.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.length > 0 ? (
          topics.map((topic) => {
            // Extract algo ID from link (e.g. /visualizer?algo=BUBBLE -> BUBBLE)
            const algoId = topic.visualizerLink?.split('=')[1];
            const isMastered = userProgress[algoId] >= 100;

            return (
                <div 
                key={topic._id}
                className={cn(
                    "group glass-card rounded-2xl p-6 transition-all duration-300 relative overflow-hidden border",
                    isMastered ? "border-green-500/30 bg-green-500/5" : "border-white/5 hover:-translate-y-2"
                )}
                >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Star size={100} />
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        topic.difficulty === 'Easy' ? "bg-green-500/20 text-green-400" :
                        topic.difficulty === 'Medium' ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                        )}>
                        {topic.difficulty}
                        </span>
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                        <Book size={12} /> Topic
                        </span>
                    </div>

                    {isMastered && (
                        <div className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-500/20 px-2 py-1 rounded-full">
                            <CheckCircle size={12} /> Mastered
                        </div>
                    )}
                </div>

                <h2 className={cn(
                    "text-2xl font-bold mb-3 transition-colors",
                    isMastered ? "text-green-100" : "text-white group-hover:text-purple-300"
                )}>
                    {topic.title}
                </h2>
                
                <p className="text-gray-400 mb-6 line-clamp-3">
                    {topic.description}
                </p>

                <Link 
                    href={topic.visualizerLink || '/visualizer'}
                    className="inline-flex items-center gap-2 text-sm font-bold text-white hover:gap-3 transition-all"
                >
                    {isMastered ? 'Review Topic' : 'Start Learning'} <ArrowRight size={16} />
                </Link>
                </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500">No topics found. Making a request to initialize...</p>
          </div>
        )}
      </div>
    </div>
  );
}
