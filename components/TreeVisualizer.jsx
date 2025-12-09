"use client";
import { useState, useEffect, useRef } from "react";
import Button from "./ui/Button";
import { RefreshCw, Play, Square, StepForward, Plus } from "lucide-react";
import { ALGO_INFO } from "@/lib/algo-data";
import { motion, AnimatePresence } from "framer-motion";

const TreeVisualizer = () => {
    const [tree, setTree] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [highlightNodes, setHighlightNodes] = useState([]);
    const [instruction, setInstruction] = useState("Enter a number and click 'Insert' to build the tree.");
    const [traversing, setTraversing] = useState(false);
    const [delay, setDelay] = useState(600);
    const delayRef = useRef(delay);

    useEffect(() => { delayRef.current = delay; }, [delay]);
    const wait = async () => await new Promise(r => setTimeout(r, delayRef.current));

    
    // Helper to generate a random tree on load
    useEffect(() => {
       // Optional: Pre-load some data
       let root = null;
       const initialValues = [50, 30, 70, 20, 40, 60, 80];
       initialValues.forEach(v => {
           root = insertNode(root, v);
       });
       setTree(root);
    }, []);

    const insertNode = (node, value) => {
        if (!node) return { value, left: null, right: null, x: 0, y: 0 };
        if (value < node.value) {
            node.left = insertNode(node.left, value);
        } else if (value > node.value) {
            node.right = insertNode(node.right, value);
        }
        return node;
    };

    const handleInsert = async () => {
        if (!inputValue || traversing) return;
        const val = parseInt(inputValue);
        if (isNaN(val)) return;

        setInstruction(`Inserting ${val}...`);
        setTraversing(true);

        // Visualize insertion path
        await visualizePath(tree, val);

        // detailed insertion logic for state update
        const newTree = JSON.parse(JSON.stringify(tree)); // Deep copy simple object
        setTree(insertNode(newTree || null, val));
        
        setInputValue("");
        setTraversing(false);
        setInstruction(`Inserted ${val}!`);
        setHighlightNodes([]);
    };

    const visualizePath = async (node, val) => {
        if (!node) return;
        
        setHighlightNodes([node.value]);
        await wait();

        if (val < node.value) {
            setInstruction(`${val} is smaller than ${node.value}. We must go Left.`);
            await wait();
            await visualizePath(node.left, val);
        } else if (val > node.value) {
            setInstruction(`${val} is larger than ${node.value}. We must go Right.`);
            await wait();
            await visualizePath(node.right, val);
        } else {
             setInstruction(`Value ${val} already exists in the tree! Cannot insert duplicates.`);
             await wait();
        }
    };

    const handleReset = () => {
        setTree(null);
        setInstruction("Tree cleared. Start building!");
        setHighlightNodes([]);
    };

    // Recursive component to render tree
    const TreeNode = ({ node, x, y, level, parentX }) => {
        if (!node) return null;

        // Calculate position based on level and parent
        // Simple visualization logic: reduce spread as we go down
        const spread = 200 / (level + 1);
        
        // This is a simplified visual representation. 
        // Real tree drawing algorithms (reingold-tilford) are complex.
        // We will stick to a CSS/Flex based or simple absolute approach for now.
        // Or for simplicity in React, use a nested structure with CSS transforms.
        
        return (
             <div className="flex flex-col items-center relative">
                 <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 z-10 
                      ${highlightNodes.includes(node.value) 
                        ? 'bg-yellow-500 border-yellow-300 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' 
                        : 'bg-purple-600 border-purple-400 text-white'}`}
                 >
                     {node.value}
                 </motion.div>
                 
                 {/* Connectors */}
                 <div className="flex gap-8 mt-8 relative">
                     {node.left && (
                         <div className="relative flex flex-col items-center">
                             {/* Line connector visualization is tricky in pure HTML/CSS without SVG. 
                                 For now, we just rely on layout structure. 
                             */}
                             <div className="absolute -top-8 left-[50%] w-0.5 h-8 bg-gray-500 -rotate-12 origin-top" /> 
                             <TreeNode node={node.left} level={level+1} />
                         </div>
                     )}
                     {!node.left && node.right && <div className="w-12"></div>} {/* Spacer */}
                     
                     {node.right && (
                         <div className="relative flex flex-col items-center">
                             <div className="absolute -top-8 right-[50%] w-0.5 h-8 bg-gray-500 rotate-12 origin-top" />
                             <TreeNode node={node.right} level={level+1} />
                         </div>
                     )}
                 </div>
             </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-6">
             {/* Controls */}
             <div className="glass-card p-6 rounded-2xl flex flex-wrap items-center gap-4 justify-between">
                 <div className="flex items-center gap-2">
                     <input 
                       type="number" 
                       value={inputValue} 
                       onChange={(e) => setInputValue(e.target.value)}
                       placeholder="Enter Value"
                       className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white w-32 focus:border-purple-500 outline-none"
                       onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                     />
                     <Button onClick={handleInsert} disabled={traversing}>
                         <Plus size={16} className="mr-1" /> Insert
                     </Button>
                 </div>
                 <div className="flex-1 text-center">
                     <p className="text-purple-200 font-medium animate-pulse">{instruction}</p>
                 </div>
                 <Button variant="outline" onClick={handleReset}>
                     <RefreshCw size={16} className="mr-2" /> Reset
                 </Button>
             </div>

             {/* Visualizer Area */}
             <div className="min-h-[500px] glass-card rounded-2xl p-8 flex justify-center overflow-auto items-start bg-black/20">
                 <TreeNode node={tree} level={0} />
             </div>

             {/* Info */}
             <div className="glass-card p-6 rounded-2xl">
                 <h2 className="text-2xl font-bold mb-2">{ALGO_INFO["BST"]?.title}</h2>
                 <p className="text-gray-400 mb-4">{ALGO_INFO["BST"]?.description}</p>
                 <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-300">
                     {ALGO_INFO["BST"]?.code}
                 </pre>
             </div>
        </div>
    );
};

export default TreeVisualizer;
