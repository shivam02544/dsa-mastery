'use client'
import SortingVisualizer from "@/components/SortingVisualizer";
import GraphVisualizer from "@/components/GraphVisualizer";
import TreeVisualizer from "@/components/TreeVisualizer";
import LinearVisualizer from "@/components/LinearVisualizer";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Layers, Network, GitGraph, List, Lock, LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import Button from "@/components/ui/Button";

function VisualizerTabs() {
  const searchParams = useSearchParams();
  const algoParam = searchParams.get('algo');

  const tabs = [
    { 
      id: 'sorting',
      label: 'Sorting & Search', 
      icon: Layers,
      isActive: !algoParam || ['BUBBLE', 'SELECTION', 'INSERTION', 'MERGE', 'QUICK', 'BINARY_SEARCH'].includes(algoParam),
      href: '/visualizer?algo=BUBBLE'
    },
    { 
      id: 'linear',
      label: 'Linear Structures', 
      icon: List,
      isActive: ['LINKED_LIST', 'STACK', 'QUEUE'].includes(algoParam),
      href: '/visualizer?algo=LINKED_LIST'
    },
    { 
      id: 'bst',
      label: 'Binary Search Tree', 
      icon: Network,
      isActive: algoParam === 'BST',
      href: '/visualizer?algo=BST'
    },
    { 
      id: 'graph',
      label: 'Graph Algorithms', 
      icon: GitGraph,
      isActive: ['DIJKSTRA', 'BFS', 'DFS'].includes(algoParam),
      href: '/visualizer?algo=DIJKSTRA'
    }
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {tabs.map((tab) => (
        <Link key={tab.id} href={tab.href}>
          <div className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 font-medium",
            tab.isActive 
              ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20" 
              : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20"
          )}>
            <tab.icon size={18} />
            {tab.label}
          </div>
        </Link>
      ))}
    </div>
  );
}

import { useState, useEffect } from "react";
import { CheckCircle, Circle, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

function MasteryTracker({ algoParam, session }) {
    const [isMastered, setIsMastered] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session && algoParam) {
            checkMastery();
        }
    }, [session, algoParam]);

    const checkMastery = async () => {
        try {
            const res = await fetch('/api/user');
            if (res.ok) {
                const data = await res.json();
                setIsMastered(!!data.progress?.[algoParam]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const toggleMastery = async () => {
        if (!session) return;
        
        const newState = !isMastered;
        setIsMastered(newState); // Optimistic update

        if (newState) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        try {
            await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    progressUpdate: {
                        key: algoParam,
                        value: newState ? 100 : 0
                    }
                })
            });
        } catch (e) {
            console.error("Failed to update mastery", e);
            setIsMastered(!newState); // Revert on error
        }
    };

    if (!session) return null;

    return (
        <button 
            onClick={toggleMastery}
            disabled={loading}
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 font-bold text-sm",
                isMastered 
                    ? "bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30" 
                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
            )}
        >
            {isMastered ? <CheckCircle size={16} /> : <Circle size={16} />}
            {isMastered ? "Mastered" : "Mark as Mastered"}
        </button>
    );
}

function LockedView({ algoParam }) {
    // Basic description based on algoParam or category
    const getMessage = () => {
        if (!algoParam) return "Master sorting algorithms like Bubble, Merge, and Quick Sort.";
        if (['DIJKSTRA', 'BFS', 'DFS'].includes(algoParam)) return "Visualize complex Graph algorithms and pathfinding.";
        if (['LINKED_LIST', 'STACK', 'QUEUE'].includes(algoParam)) return "Understand fundamental linear data structures.";
        if (algoParam === 'BST') return "Explore the hierarchy of Binary Search Trees.";
        return "Explore this advanced algorithm visualization.";
    };

    return (
        <div className="relative w-full h-[600px] rounded-2xl bg-slate-900/50 border border-white/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[32px_32px]" />
            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
            
            <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-lg">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 backdrop-blur-sm">
                    <Lock className="text-purple-400" size={32} />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">Feature Locked</h3>
                <p className="text-gray-400 mb-8 text-lg">
                    {getMessage()}
                    <br />
                    <span className="text-sm opacity-70 mt-2 block">Login to access full interactive visualization and track your progress.</span>
                </p>

                <Button 
                    onClick={() => signIn('google')} 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-xl text-lg gap-3"
                >
                    <LogIn size={20} /> Login to Unlock
                </Button>
            </div>
        </div>
    );
}

function VisualizerContent() {
  const searchParams = useSearchParams();
  const algoParam = searchParams.get('algo');
  const { data: session, status } = useSession();

  let ComponentToRender = SortingVisualizer;

  if (['DIJKSTRA', 'BFS', 'DFS'].includes(algoParam)) {
    ComponentToRender = GraphVisualizer;
  } else if (algoParam === 'BST') {
    ComponentToRender = TreeVisualizer;
  } else if (['LINKED_LIST', 'STACK', 'QUEUE'].includes(algoParam)) {
    ComponentToRender = LinearVisualizer;
  }

  // Show loading state while checking auth
  if (status === 'loading') {
      return <div className="text-white text-center py-20">Checking access...</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <VisualizerTabs />
        <MasteryTracker algoParam={algoParam} session={session} />
      </div>
      
      {/* Sub-navigation for Graph Algorithms */}
      {['DIJKSTRA', 'BFS', 'DFS'].includes(algoParam) && (
          <div className="flex gap-2 mb-6 p-1 bg-black/40 w-fit rounded-lg border border-white/10">
              {[
                  { id: 'DIJKSTRA', label: "Dijkstra's" },
                  { id: 'BFS', label: 'BFS' },
                  { id: 'DFS', label: 'DFS' }
              ].map(opt => (
                  <Link key={opt.id} href={`/visualizer?algo=${opt.id}`}>
                      <div className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                          algoParam === opt.id ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
                      )}>
                          {opt.label}
                      </div>
                  </Link>
              ))}
          </div>
      )}

      {/* Sub-navigation for Linear Structures */}
      {['LINKED_LIST', 'STACK', 'QUEUE'].includes(algoParam) && (
          <div className="flex gap-2 mb-6 p-1 bg-black/40 w-fit rounded-lg border border-white/10">
              {[
                  { id: 'LINKED_LIST', label: "Linked List" },
                  { id: 'STACK', label: 'Stack' },
                  { id: 'QUEUE', label: 'Queue' }
              ].map(opt => (
                  <Link key={opt.id} href={`/visualizer?algo=${opt.id}`}>
                      <div className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                          algoParam === opt.id ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
                      )}>
                          {opt.label}
                      </div>
                  </Link>
              ))}
          </div>
      )}

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {session ? (
            <ComponentToRender />
        ) : (
            <LockedView algoParam={algoParam} />
        )}
      </div>
    </>
  );
}

export default function VisualizerPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          Algorithm Visualizer
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl">
          Watch how algorithms work in real-time. Select a category below to start exploring interactively.
        </p>
      </div>

      <Suspense fallback={<div className="text-white">Loading visualizer...</div>}>
        <VisualizerContent />
      </Suspense>
    </div>
  );
}
