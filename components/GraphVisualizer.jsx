"use client";
import { useState, useEffect, useRef } from "react";
import Button from "./ui/Button";
import { RefreshCw, Play, Square } from "lucide-react";
import { ALGO_INFO } from "@/lib/algo-data";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const GraphVisualizer = () => {
    // Graph state: Nodes { id, x, y } and Edges { from, to, weight }
    // Graph state: Nodes { id, x, y } and Edges { from, to, weight }
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [distances, setDistances] = useState({});
    const [visited, setVisited] = useState(new Set());
    const [instruction, setInstruction] = useState("Click 'Start' to begin.");
    
    const searchParams = useSearchParams();
    const algo = searchParams.get('algo') || "DIJKSTRA";

    // ... existing ...
    const [animating, setAnimating] = useState(false);
    const [activeEdge, setActiveEdge] = useState(null); // {from, to} to highlight
    const [currentNode, setCurrentNode] = useState(null);
    const [delay, setDelay] = useState(800); // Animation delay state

    // Initial Graph Generation
    useEffect(() => {
        resetGraph();
    }, []);

    const resetGraph = () => {
        // Create 6 random nodes in a circle-ish layout
        const newNodes = [
            { id: 0, x: 100, y: 200, label: '0' },
            { id: 1, x: 250, y: 100, label: '1' },
            { id: 2, x: 250, y: 300, label: '2' },
            { id: 3, x: 450, y: 100, label: '3' },
            { id: 4, x: 450, y: 300, label: '4' },
            { id: 5, x: 600, y: 200, label: '5' },
        ];
        
        // Define edges (Directed for simplicity)
        const newEdges = [
            { from: 0, to: 1, weight: 4 },
            { from: 0, to: 2, weight: 2 },
            { from: 1, to: 2, weight: 1 },
            { from: 1, to: 3, weight: 5 },
            { from: 2, to: 3, weight: 8 },
            { from: 2, to: 4, weight: 10 },
            { from: 3, to: 4, weight: 2 },
            { from: 3, to: 5, weight: 6 },
            { from: 4, to: 5, weight: 3 },
        ];

        setNodes(newNodes);
        setEdges(newEdges);
        setDistances({});
        setVisited(new Set());
        setInstruction("Graph generated. Ready for Dijkstra.");
        setCurrentNode(null);
        setActiveEdge(null);
        setAnimating(false);
    };

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // Dynamic sleep based on 'delay' state. Since state might be stale in closures without refs,
    // we use a simple approach: pass delay as arg or just use current state if it works (it does in simple async funcs usually)
    // But for robustness in async loops:
    const delayRef = useRef(delay);
    useEffect(() => { delayRef.current = delay; }, [delay]);
    
    const wait = async () => await sleep(delayRef.current);

    const runBFS = async () => {
        if (animating) return;
        setAnimating(true);
        resetGraph();
        await wait();

        const startNode = 0;
        let queue = [startNode];
        const visitedSet = new Set([startNode]);
        
        setVisited(new Set(visitedSet));
        setInstruction(`Let's start BFS at Node ${startNode}. We add it to our Queue.`);
        await wait();

        while (queue.length > 0) {
            const u = queue.shift();
            setCurrentNode(u);
            setInstruction(`Dequeueing Node ${u}. Now let's visit all its unvisited neighbors.`);
            await wait();

            const neighbors = edges.filter(e => e.from === u);
            if (neighbors.length === 0) {
                 setInstruction(`Node ${u} has no outgoing edges.`);
                 await wait();
            }

            for (const edge of neighbors) {
                const v = edge.to;
                setActiveEdge(edge);
                setInstruction(`Checking edge from ${u} to ${v}...`);
                await wait();

                if (!visitedSet.has(v)) {
                    visitedSet.add(v);
                    setVisited(new Set(visitedSet));
                    queue.push(v);
                    
                    setInstruction(`Node ${v} hasn't been visited! Mark it as visited and Enqueue it.`);
                    await wait();
                } else {
                    setInstruction(`Node ${v} is already visited. Skipping.`);
                    await wait();
                }
                setActiveEdge(null);
            }
        }
        setInstruction("Queue is empty. Breadth-First Search is complete!");
        setAnimating(false);
        setCurrentNode(null);
    };

    const runDFS = async () => {
        if (animating) return;
        setAnimating(true);
        resetGraph();
        await wait();
        
        const startNode = 0;
        const visitedSet = new Set();
        
        setInstruction(`Starting DFS at Node ${startNode}. We will go as deep as possible.`);
        await dfsHelper(startNode, visitedSet);
        
        setInstruction("All reachable nodes visited. Depth-First Search complete!");
        setAnimating(false);
        setCurrentNode(null);
    };

    const dfsHelper = async (u, visitedSet) => {
        visitedSet.add(u);
        setVisited(new Set(visitedSet));
        setCurrentNode(u);
        setInstruction(`Visited Node ${u}. Now looking for deeper paths...`);
        await wait();

        const neighbors = edges.filter(e => e.from === u);
        for (const edge of neighbors) {
            const v = edge.to;
            setActiveEdge(edge);
            setInstruction(`Checking edge ${u} -> ${v}.`);
            await wait();

            if (!visitedSet.has(v)) {
                setInstruction(`Node ${v} is unvisited. Recursing deeper into ${v}...`);
                await wait();
                setActiveEdge(null);
                await dfsHelper(v, visitedSet);
                
                // Backtrack visualization
                setCurrentNode(u);
                setInstruction(`Backtracked to Node ${u}. Checking other neighbors...`);
                await wait();
            } else {
                setInstruction(`Node ${v} already visited. Backtracking.`);
                await wait();
                setActiveEdge(null);
            }
        }
    };

    const runDijkstra = async () => {
        if (animating) return;
        setAnimating(true);
        resetGraph(); // Ensure fresh start
        await wait();

        const startNode = 0;
        const dists = {};
        nodes.forEach(n => dists[n.id] = Infinity);
        dists[startNode] = 0;
        
        let queue = [{ id: startNode, dist: 0 }];
        const visitedSet = new Set();
        
        setDistances({...dists});
        setInstruction(`Initializing Dijkstra. Distance to start Node ${startNode} is 0. All others Infinity.`);
        await wait();

        while (queue.length > 0) {
            // Sort to simulate Priority Queue
            queue.sort((a, b) => a.dist - b.dist);
            const { id: u, dist: currentDist } = queue.shift();

            if (visitedSet.has(u)) continue;
            
            visitedSet.add(u);
            setVisited(new Set(visitedSet));
            setCurrentNode(u);
            setInstruction(`Visiting Node ${u} (Current Min Dist: ${currentDist}). Identifying meaningful neighbors...`);
            await wait();

            const neighbors = edges.filter(e => e.from === u);
            
            for (const edge of neighbors) {
                const v = edge.to;
                setActiveEdge(edge);
                
                if (!visitedSet.has(v)) {
                    setInstruction(`Checking path ${u} -> ${v}. Existing dist: ${dists[v]}. New path: ${currentDist} + ${edge.weight} = ${currentDist + edge.weight}.`);
                    await wait();

                    const newDist = currentDist + edge.weight;
                    if (newDist < dists[v]) {
                        dists[v] = newDist;
                        setDistances({...dists});
                        queue.push({ id: v, dist: newDist });
                        setInstruction(`Found a shorter path to Node ${v}! Updating distance to ${newDist}.`);
                    } else {
                         setInstruction(`New path ${newDist} is not shorter than existing ${dists[v]}. Ignoring.`);
                    }
                } else {
                     setInstruction(`Node ${v} already processed. Skipping.`);
                }
                await wait();
                setActiveEdge(null);
            }
        }

        setInstruction("Dijkstra's Algorithm Complete! The shortest paths from Node 0 are calculated.");
        setAnimating(false);
        setCurrentNode(null);
    };

    const handleStart = () => {
        if (algo === 'BFS') runBFS();
        else if (algo === 'DFS') runDFS();
        else runDijkstra();
    };

    return (
        <div className="w-full flex flex-col gap-6">
             <div className="glass-card p-6 rounded-2xl flex justify-between items-center">
                 <div className="text-purple-200 font-medium">{instruction}</div>
                <div className="flex gap-4 items-center">
                     {/* Speed Selector */}
                     <div className="flex items-center gap-2 text-sm text-gray-400">
                         <span>Speed:</span>
                         <select 
                           value={delay} 
                           onChange={(e) => setDelay(Number(e.target.value))}
                           disabled={animating}
                           className="bg-black/40 border-none outline-none text-white rounded px-2 py-1 cursor-pointer"
                         >
                            <option value={1500}>Very Slow</option>
                            <option value={800}>Normal</option>
                            <option value={300}>Fast</option>
                         </select>
                     </div>
                     
                     <div className="flex gap-3">
                        <Button onClick={handleStart} disabled={animating} className="bg-blue-600">
                             <Play size={16} className="mr-2" /> Start {algo}
                        </Button>
                        <Button onClick={resetGraph} variant="outline" disabled={animating}>
                             <RefreshCw size={16} className="mr-2" /> Reset
                        </Button>
                     </div>
                 </div>
             </div>

             <div className="h-[500px] glass-card rounded-2xl relative bg-black/20 overflow-hidden">
                 {/* SVG Layer for edges */}
                 <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                     <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                        </marker>
                         <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24" />
                        </marker>
                     </defs>
                     {edges.map((edge, idx) => {
                         const start = nodes.find(n => n.id === edge.from);
                         const end = nodes.find(n => n.id === edge.to);
                         if (!start || !end) return null;
                         
                         const isActive = activeEdge && activeEdge.from === edge.from && activeEdge.to === edge.to;

                         return (
                             <g key={idx}>
                                 <line 
                                     x1={start.x} y1={start.y} x2={end.x} y2={end.y} 
                                     stroke={isActive ? "#fbbf24" : "#4b5563"} 
                                     strokeWidth={isActive ? 4 : 2}
                                     markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                                     className="transition-colors duration-300"
                                 />
                                 {/* Weight Label */}
                                 { algo === 'DIJKSTRA' && (
                                     <text 
                                        x={(start.x + end.x) / 2} 
                                        y={(start.y + end.y) / 2 - 10} 
                                        fill={isActive ? "#fbbf24" : "#9ca3af"}
                                        fontWeight="bold"
                                        textAnchor="middle"
                                     >
                                         {edge.weight}
                                     </text>
                                 )}
                             </g>
                         );
                     })}
                 </svg>

                 {/* Nodes */}
                 {nodes.map(node => (
                     <motion.div
                         key={node.id}
                         initial={{ scale: 0 }}
                         animate={{ scale: 1 }}
                         className={`absolute w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-lg z-10 transition-colors duration-300
                            ${currentNode === node.id ? 'bg-blue-500 border-blue-400 text-white scale-125' : 
                              visited.has(node.id) ? 'bg-green-500/80 border-green-400 text-white' : 
                              'bg-gray-800 border-gray-600 text-gray-300'}
                         `}
                         style={{ left: node.x - 24, top: node.y - 24 }}
                     >
                         <div className="flex flex-col items-center">
                             <span className="font-bold">{node.label}</span>
                             {algo === 'DIJKSTRA' && distances[node.id] !== undefined && distances[node.id] !== Infinity && (
                                 <span className="absolute -bottom-6 text-xs bg-black/70 px-1 rounded text-yellow-400">
                                     Dist: {distances[node.id]}
                                 </span>
                             )}
                         </div>
                     </motion.div>
                 ))}
             </div>
             
             {/* Info */}
             <div className="glass-card p-6 rounded-2xl">
                 <h2 className="text-2xl font-bold mb-2">{ALGO_INFO[algo]?.title}</h2>
                 <p className="text-gray-400 mb-4">{ALGO_INFO[algo]?.description}</p>
                 <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-300">
                     {ALGO_INFO[algo]?.code}
                 </pre>
             </div>
        </div>
    );
};

export default GraphVisualizer;
