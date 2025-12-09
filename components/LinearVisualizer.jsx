"use client";
import { useState, useRef, useEffect } from "react";
import Button from "./ui/Button";
import { RefreshCw, Plus, Trash2, ArrowRight, Layers, ArrowDown } from "lucide-react";
import { ALGO_INFO } from "@/lib/algo-data";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

const LinearVisualizer = () => {
    const searchParams = useSearchParams();
    const algo = searchParams.get('algo') || "LINKED_LIST";
    
    // Joint state for linear structures
    // For LL: [{id, value, nextId...}]
    // For Stack/Queue: [{id, value}]
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [instruction, setInstruction] = useState("Enter a value to start.");
    const [animating, setAnimating] = useState(false);
    const [delay, setDelay] = useState(500);
    const delayRef = useRef(delay);

    useEffect(() => { delayRef.current = delay; }, [delay]);
    
    // Explicit sleep defined for robustness
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const wait = async () => await sleep(delayRef.current);


    // --- Linked List Operations ---
    const addToHead = async () => {
        if (!inputValue) return;
        setInstruction(`Preparing to add node with value ${inputValue}...`);
        setAnimating(true);
        await wait();

        const newItem = {
            id: Date.now(),
            value: inputValue,
        };

        setInstruction("Step 1: Create a new node.");
        await wait();

        setInstruction("Step 2: Point new node's 'next' to the current Head.");
        await wait();
        
        setItems(prev => [newItem, ...prev]);
        setInstruction(`Step 3: Update Head! Node ${inputValue} is now at the beginning.`);
        setInputValue("");
        setAnimating(false);
    };

    const addToTail = async () => {
        if (!inputValue) return;
        setInstruction(`Preparing to add ${inputValue} to the end...`);
        setAnimating(true);
        await wait();
        
        const newItem = { id: Date.now(), value: inputValue };

        if (items.length === 0) {
            setItems([newItem]);
            setInstruction("List was empty. So new node becomes the Head.");
        } else {
            setInstruction("Step 1: Traverse through the list to find the last node...");
            await wait();
            setInstruction("Found the last node (Tail).");
            await wait();
            
            setInstruction("Step 2: Link the old Tail's 'next' pointer to the new node.");
            await wait();
            setItems(prev => [...prev, newItem]);
            setInstruction(`Step 3: Update Tail. Node ${inputValue} is now the last element.`);
        }
        
        setInputValue("");
        setAnimating(false);
    };

    const removeHead = async () => {
        if (items.length === 0) {
            setInstruction("List is empty!");
            return;
        }
        setAnimating(true);
        setInstruction("Removing Head node...");
        await wait();
        
        setItems(prev => prev.slice(1));
        setInstruction("Head removed. Next node is new Head.");
        setAnimating(false);
    };

    const removeTail = async () => {
         if (items.length === 0) {
            setInstruction("List is empty!");
            return;
        }
        setAnimating(true);
        setInstruction("Traversing to tail...");
        await wait();
        setInstruction("Severing link to last node...");
        await wait();
        
        setItems(prev => prev.slice(0, -1));
        setInstruction("Tail removed.");
        setAnimating(false);
    };

    const reverseList = async () => {
        if (items.length <= 1) return;
        setAnimating(true);
        setInstruction("Reversing the links...");
        await wait();
        setItems(prev => [...prev].reverse());
        setInstruction("List Reversed!");
        setAnimating(false);
    };


    // --- Stack Operations ---
    const pushStack = async () => {
        if (!inputValue) return;
        setAnimating(true);
        setInstruction(`Taking value ${inputValue}...`);
        await wait();
        
        setInstruction("Pushing it onto the Top of the Stack (LIFO)...");
        await wait();

        const newItem = { id: Date.now(), value: inputValue };
         // Append to end (Top of visual stack in flex-col-reverse)
        setItems(prev => [...prev, newItem]);
        setInputValue("");
        setAnimating(false);
        setInstruction(`${inputValue} is now at the Top!`);
    };

    const popStack = async () => {
        if (items.length === 0) {
             setInstruction("Stack Underflow! Cannot pop from an empty stack.");
             return;
        }
        setAnimating(true);
        setInstruction("Identifying the Top element...");
        await wait();
        
        setInstruction("Popping (removing) the Top element...");
        await wait();
        
        // Remove from end (Top of visual stack)
        setItems(prev => prev.slice(0, -1));
        setAnimating(false);
        setInstruction("Top element removed.");
    };

    // --- Queue Operations ---
    const enqueue = async () => {
        if (!inputValue) return;
        setAnimating(true);
        setInstruction(`Taking value ${inputValue}...`);
        await wait();
        
        setInstruction("Adding it to the Back (Rear) of the Queue...");
        await wait();
        const newItem = { id: Date.now(), value: inputValue };
        setItems(prev => [...prev, newItem]); 
        setInputValue("");
        setAnimating(false);
        setInstruction(`${inputValue} enqueued successfully!`);
    };

    const dequeue = async () => {
        if (items.length === 0) {
             setInstruction("Queue Underflow! Cannot dequeue from an empty queue.");
             return;
        }
        setAnimating(true);
        setInstruction("Identifying the Front element...");
        await wait();
        
        setInstruction("Removing the Front element (FIFO)...");
        await wait();
        setItems(prev => prev.slice(1)); 
        setAnimating(false);
        setInstruction("Front element removed. The next element is now Front.");
    };


    const handleReset = () => {
        setItems([]);
        setInstruction("Reset complete.");
    };

    return (
        <div className="w-full flex flex-col gap-6">
             {/* Controls */}
             <div className="glass-card p-6 rounded-2xl flex flex-wrap items-center gap-4">
                 <input 
                   type="text" 
                   value={inputValue} 
                   onChange={(e) => setInputValue(e.target.value)}
                   className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white w-32 focus:border-purple-500 outline-none"
                   placeholder="Value"
                   maxLength={4}
                 />
                 
                 {algo === 'LINKED_LIST' && (
                     <>
                        <Button onClick={addToHead} disabled={animating} className="bg-green-600/80 hover:bg-green-600">
                             + Head
                        </Button>
                        <Button onClick={addToTail} disabled={animating} className="bg-blue-600/80 hover:bg-blue-600">
                             + Tail
                        </Button>
                        <Button onClick={removeHead} disabled={animating || items.length === 0} variant="outline" className="border-red-500/50 text-red-400">
                             Pop Head
                        </Button>
                        <Button onClick={removeTail} disabled={animating || items.length === 0} variant="outline" className="border-red-500/50 text-red-400">
                             Pop Tail
                        </Button>
                         <Button onClick={reverseList} disabled={animating || items.length === 0} variant="outline">
                             <RefreshCw size={14} className="mr-2"/> Reverse
                        </Button>
                     </>
                 )}

                 {algo === 'STACK' && (
                     <>
                        <Button onClick={pushStack} disabled={animating} className="bg-purple-600">
                             <ArrowDown size={16} className="mr-2"/> Push
                        </Button>
                        <Button onClick={popStack} disabled={animating || items.length === 0} variant="outline" className="border-red-500 text-red-400">
                             <ArrowRight size={16} className="mr-2 -rotate-90"/> Pop
                        </Button>
                     </>
                 )}

                 {algo === 'QUEUE' && (
                     <>
                        <Button onClick={enqueue} disabled={animating} className="bg-blue-600">
                             <Plus size={16} className="mr-2"/> Enqueue
                        </Button>
                        <Button onClick={dequeue} disabled={animating || items.length === 0} variant="outline" className="border-red-500 text-red-400">
                             <Trash2 size={16} className="mr-2"/> Dequeue
                        </Button>
                     </>
                 )}

                 <div className="flex-1 text-right text-gray-400 text-sm flex items-center justify-end gap-4">
                     {/* Speed Selector */}
                     <div className="flex items-center gap-2">
                         <span>Speed:</span>
                         <select 
                           value={delay} 
                           onChange={(e) => setDelay(Number(e.target.value))}
                           disabled={animating}
                           className="bg-black/40 border-none outline-none text-white rounded px-2 py-1 cursor-pointer"
                         >
                            <option value={1000}>Slow</option>
                            <option value={500}>Normal</option>
                            <option value={200}>Fast</option>
                         </select>
                     </div>
                     <span className="text-purple-300 font-medium animate-pulse">{instruction}</span>
                 </div>
             </div>

             {/* Visualization Area */}
             <div className="min-h-[400px] glass-card rounded-2xl p-10 flex items-center justify-center overflow-x-auto bg-black/20 relative">
                 
                 {/* Empty State */}
                 {items.length === 0 && (
                     <div className="text-gray-600 italic">Empty {ALGO_INFO[algo]?.title}</div>
                 )}

                 {/* Linked List View */}
                 {algo === 'LINKED_LIST' && (
                     <div className="flex items-center gap-2">
                        <AnimatePresence mode='popLayout'>
                            {items.map((item, idx) => (
                                <motion.div 
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                    className="flex items-center"
                                >
                                    <div className="w-16 h-16 rounded-full border-2 border-purple-500 flex items-center justify-center bg-purple-500/10 text-white font-bold relative group">
                                        {item.value}
                                        <div className="absolute -top-6 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100">Node {idx}</div>
                                    </div>
                                    {idx < items.length - 1 && (
                                        <ArrowRight className="text-gray-500 w-8 h-8 mx-1" />
                                    )}
                                    {idx === items.length - 1 && (
                                         <div className="flex items-center text-gray-600 ml-2">
                                             <div className="w-4 h-[2px] bg-gray-600"></div>
                                             <div className="text-xs ml-1">NULL</div>
                                         </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                     </div>
                 )}

                 {/* Stack View (Vertical) */}
                 {algo === 'STACK' && (
                     <div className="flex flex-col-reverse items-center justify-end h-full w-32 border-x-4 border-b-4 border-gray-700 rounded-b-xl min-h-[300px] p-4 bg-gray-900/30">
                        <AnimatePresence mode="popLayout">
                             {items.map((item, idx) => (
                                 <motion.div
                                     key={item.id}
                                     layout
                                     initial={{ opacity: 0, y: -50 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                                     className="w-full h-12 mb-2 rounded bg-purple-600 flex items-center justify-center font-bold text-white shadow-lg border border-purple-400"
                                 >
                                     {item.value}
                                 </motion.div>
                             ))}
                        </AnimatePresence>
                     </div>
                 )}

                 {/* Queue View (Horizontal) */}
                 {algo === 'QUEUE' && (
                     <div className="flex items-center gap-2 p-4 border-y-4 border-gray-700 min-w-[300px] min-h-[100px] bg-gray-900/30 rounded-lg justify-start w-full overflow-x-auto">
                         <div className="absolute left-2 text-xs text-gray-500 -top-6">FRONT</div>
                         <AnimatePresence mode="popLayout">
                             {items.map((item, idx) => (
                                 <motion.div
                                     key={item.id}
                                     layout
                                     initial={{ opacity: 0, x: 50 }}
                                     animate={{ opacity: 1, x: 0 }}
                                     exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                                     className="min-w-[64px] h-16 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg border border-blue-400"
                                 >
                                     {item.value}
                                 </motion.div>
                             ))}
                         </AnimatePresence>
                     </div>
                 )}
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

export default LinearVisualizer;
