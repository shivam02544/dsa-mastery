"use client";
import { useState, useEffect, useRef } from "react";
import Button from "./ui/Button";
import { RefreshCw, Play, Settings, Square, GraduationCap, StepForward } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ALGO_INFO } from "@/lib/algo-data";

// Sort Algorithms
const ALGORITHMS = {
  BUBBLE: "Bubble Sort",
  SELECTION: "Selection Sort",
  INSERTION: "Insertion Sort",
  MERGE: "Merge Sort",
  QUICK: "Quick Sort",
  BINARY_SEARCH: "Binary Search",
  DIJKSTRA: "Dijkstra's Algorithm",
};

const SortingVisualizer = () => {
  const searchParams = useSearchParams();
  const algoParam = searchParams.get('algo');
  const initialAlgo = algoParam && ALGORITHMS[algoParam] ? algoParam : "BUBBLE";

  // Reduced size for better visibility
  const generateArray = () =>
    Array.from({ length: 12 }, () => Math.floor(Math.random() * 85) + 10);

  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [visitedIndices, setVisitedIndices] = useState([]);
  const [swappedIndices, setSwappedIndices] = useState([]);
  const [selectedAlgo, setSelectedAlgo] = useState(initialAlgo);
  const [instruction, setInstruction] = useState("Welcome to class! Select an algorithm and click 'Sort' to start the lesson.");
  
  // Speed control state (ms)
  const [delay, setDelay] = useState(800);

  // Ref to control stopping the animation
  const shouldStopRef = useRef(false);
  const isAutoRef = useRef(true);
  const stepResolverRef = useRef(null);
  
  // State for UI to know if we are in auto mode or step mode
  const [isAuto, setIsAuto] = useState(true);

  useEffect(() => {
    setArray(generateArray());
  }, []);

  const resetArray = () => {
    if (sorting) return;
    setArray(generateArray());
    setVisitedIndices([]);
    setSwappedIndices([]);
    setInstruction("Fresh data generated. Ready to learn?");
    shouldStopRef.current = false;
    stepResolverRef.current = null;
    isAutoRef.current = true;
    setIsAuto(true);
  };

  const delayRef = useRef(delay);
  useEffect(() => { delayRef.current = delay; }, [delay]);

  const verifyStop = () => {
      if (shouldStopRef.current) throw new Error("Stopped");
  };

  const sleep = async (ms) => {
    verifyStop();

    if (isAutoRef.current) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldStopRef.current) reject(new Error("Stopped"));
                else resolve();
            }, ms);
        });
    } else {
        return new Promise((resolve, reject) => {
            stepResolverRef.current = () => {
                if (shouldStopRef.current) reject(new Error("Stopped"));
                else resolve();
            };
        });
    }
  };

  const handleNextStep = () => {
      if (stepResolverRef.current) {
          stepResolverRef.current();
          stepResolverRef.current = null;
      }
  };

  const switchToAuto = () => {
      isAutoRef.current = true;
      setIsAuto(true);
      handleNextStep(); // Release any holding step
  };

  // --- Sorting Algorithms with "Teaching" mode ---

  const bubbleSort = async (arr) => {
    setInstruction("Starting Bubble Sort! We'll bubble the largest values to the right.");
    await sleep(delayRef.current);

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setVisitedIndices([j, j + 1]);
        setInstruction(`Comparing ${arr[j]} and ${arr[j+1]}. Is ${arr[j]} > ${arr[j+1]}?`);
        await sleep(delayRef.current);

        if (arr[j] > arr[j + 1]) {
          setSwappedIndices([j, j + 1]);
          setInstruction(`Yes! ${arr[j]} is larger, so we swap them.`);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep(delayRef.current);
        } else {
             setInstruction(`No, ${arr[j]} is smaller or equal. Moving on.`);
             await sleep(delayRef.current / 2);
        }
        setSwappedIndices([]);
      }
      setInstruction(`Excellent! The largest remaining value (${arr[arr.length - 1 - i]}) is now sorted at the end.`);
      await sleep(delayRef.current);
    }
    setInstruction("Sort complete! All elements are in order.");
  };

  const selectionSort = async (arr) => {
    setInstruction("Starting Selection Sort! We'll efficiently find the smallest value and move it to the front.");
    await sleep(delayRef.current);

    for (let i = 0; i < arr.length; i++) {
        let minIdx = i;
        setInstruction(`Looking for the smallest value starting from index ${i}...`);
        await sleep(delayRef.current);

        for (let j = i + 1; j < arr.length; j++) {
            setVisitedIndices([i, j, minIdx]);
            setInstruction(`Current minimum is ${arr[minIdx]}. Checking if ${arr[j]} is smaller...`);
            await sleep(delayRef.current);
            
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                setInstruction(`Found a new smaller value: ${arr[j]}!`);
                await sleep(delayRef.current);
            }
        }
        
        if (minIdx !== i) {
            setSwappedIndices([i, minIdx]);
            setInstruction(`Swapping the found minimum (${arr[minIdx]}) with the first unsorted position (${arr[i]}).`);
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            setArray([...arr]);
            await sleep(delayRef.current);
            setSwappedIndices([]);
        } else {
            setInstruction(`${arr[i]} was already the smallest remaining value. No swap needed.`);
            await sleep(delayRef.current);
        }
    }
    setInstruction("Selection Sort Finished! The array is sorted.");
  };

  const insertionSort = async (arr) => {
    setInstruction("Starting Insertion Sort! We build the sorted array one by one from left to right.");
    await sleep(delayRef.current);

    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        setVisitedIndices([i]);
        setInstruction(`Taking ${key} and figuring out where it belongs in the sorted part...`);
        await sleep(delayRef.current);
        
        while (j >= 0 && arr[j] > key) {
            setVisitedIndices([j, j + 1]);
            setSwappedIndices([j + 1]);
            setInstruction(`${arr[j]} is larger than ${key}, so we shift ${arr[j]} to the right.`);
            
            arr[j + 1] = arr[j];
            setArray([...arr]);
            await sleep(delayRef.current);
            j = j - 1;
        }
        arr[j + 1] = key;
        setInstruction(`Found the spot! Inserting ${key} at index ${j + 1}.`);
        setArray([...arr]);
        setSwappedIndices([]);
        await sleep(delayRef.current);
    }
    setInstruction("Insertion Sort complete! Notice how we built the sorted section.");
  };

  // Quick Sort Helpers
  const partition = async (arr, low, high) => {
    let pivot = arr[high];
    setInstruction(`Partitioning: Using ${pivot} (at end) as our pivot.`);
    await sleep(delayRef.current);

    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        setVisitedIndices([j, high]); 
        setInstruction(`Comparing ${arr[j]} to pivot ${pivot}...`);
        await sleep(delayRef.current);
        
        if (arr[j] < pivot) {
            i++;
            setSwappedIndices([i, j]);
            setInstruction(`${arr[j]} is smaller than pivot. Moving it to the 'left' side (swap with ${arr[i]}).`);
            [arr[i], arr[j]] = [arr[j], arr[i]];
            setArray([...arr]);
            await sleep(delayRef.current);
            setSwappedIndices([]);
        }
    }
    setSwappedIndices([i + 1, high]);
    setInstruction(`Placing pivot ${pivot} into its correct sorted position.`);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await sleep(delayRef.current);
    setSwappedIndices([]);
    return i + 1;
  };

  const quickSortHelper = async (arr, low, high) => {
    if (low < high) {
        let pi = await partition(arr, low, high);
        await quickSortHelper(arr, low, pi - 1);
        await quickSortHelper(arr, pi + 1, high);
    }
  };

  const quickSort = async (arr) => {
      setInstruction("Starting Quick Sort! Divide and conquer.");
      await quickSortHelper(arr, 0, arr.length - 1);
      setInstruction("Quick Sort complete! The array is now fully sorted.");
  };

  // Merge Sort Helpers
  const merge = async (arr, l, m, r) => {
      let n1 = m - l + 1;
      let n2 = r - m;
      
      setInstruction(`Merging two sorted subarrays: Indices ${l}-${m} and ${m+1}-${r}.`);
      await sleep(delayRef.current);

      let L = new Array(n1);
      let R = new Array(n2);
      
      for (let x = 0; x < n1; x++) L[x] = arr[l + x];
      for (let y = 0; y < n2; y++) R[y] = arr[m + 1 + y];
      
      let i = 0, j = 0, k = l;
      
      while (i < n1 && j < n2) {
          setVisitedIndices([l + i, m + 1 + j]);
          setInstruction(`Comparing ${L[i]} (Left) vs ${R[j]} (Right).`);
          await sleep(delayRef.current);
          
          if (L[i] <= R[j]) {
              arr[k] = L[i];
              setInstruction(`${L[i]} is smaller. Taking it first.`);
              setSwappedIndices([k]); 
              setArray([...arr]);
              i++;
          } else {
              arr[k] = R[j];
              setInstruction(`${R[j]} is smaller. Taking it first.`);
              setSwappedIndices([k]); 
              setArray([...arr]);
              j++;
          }
          k++;
          await sleep(delayRef.current);
      }
      
      while (i < n1) {
           arr[k] = L[i];
           setSwappedIndices([k]);
           setArray([...arr]);
           i++;
           k++;
           await sleep(delayRef.current);
      }
      
      while (j < n2) {
           arr[k] = R[j];
           setSwappedIndices([k]);
           setArray([...arr]);
           j++;
           k++;
           await sleep(delayRef.current);
      }
      setSwappedIndices([]);
  };

  const mergeSortHelper = async (arr, l, r) => {
      if (l >= r) return;
      let m = l + parseInt((r - l) / 2);
      await mergeSortHelper(arr, l, m);
      await mergeSortHelper(arr, m + 1, r);
      await merge(arr, l, m, r);
  };

  const mergeSort = async (arr) => {
      setInstruction("Starting Merge Sort! Splitting arrays continuously...");
      await mergeSortHelper(arr, 0, arr.length - 1);
      setInstruction("Merge Sort Finished!");
  }

  const binarySearch = async (arr) => {
      // 1. Sort the array first for visualization context
      setInstruction("Binary Search requires a sorted array. Sorting first...");
      arr.sort((a, b) => a - b);
      setArray([...arr]);
      await sleep(delayRef.current + 500);

      // 2. Pick a random target
      const targetIndex = Math.floor(Math.random() * arr.length);
      const target = arr[targetIndex]; 
      
      setInstruction(`Target found? We are looking for ${target}.`);
      await sleep(delayRef.current + 500);

      let l = 0;
      let r = arr.length - 1;

      while (l <= r) {
          let mid = Math.floor((l + r) / 2);
          setVisitedIndices([l, r]); 
          setInstruction(`Searching range [${l}, ${r}]. Mid index is ${mid} (Val: ${arr[mid]})`);
          await sleep(delayRef.current);

          setSwappedIndices([mid]);
          setArray([...arr]); // Re-render to show colors
          
          if (arr[mid] === target) {
              setInstruction(`Found ${target} at index ${mid}!`);
              await sleep(delayRef.current * 2);
              return;
          }

          if (arr[mid] < target) {
              setInstruction(`${arr[mid]} < ${target}. Ignoring left half.`);
              l = mid + 1;
          } else {
              setInstruction(`${arr[mid]} > ${target}. Ignoring right half.`);
              r = mid - 1;
          }
          await sleep(delayRef.current);
          setSwappedIndices([]);
      }
      setInstruction("Not found.");
  };

  // --- Main Runner ---

  const handleStart = async (mode = 'AUTO') => {
    if (sorting) return;
    
    shouldStopRef.current = false;
    isAutoRef.current = (mode === 'AUTO');
    setIsAuto(mode === 'AUTO');
    setSorting(true);
    
    // Use current array to start
    const inputArr = [...array];
    
    try {
        switch (selectedAlgo) {
            case 'BUBBLE': await bubbleSort(inputArr); break;
            case 'SELECTION': await selectionSort(inputArr); break;
            case 'INSERTION': await insertionSort(inputArr); break;
            case 'QUICK': await quickSort(inputArr); break;
            case 'MERGE': await mergeSort(inputArr); break;
            case 'BINARY_SEARCH': await binarySearch(inputArr); break;
            default: break;
        }
    } catch (error) {
        if (error.message === "Stopped") {
            setInstruction("Class paused. You pressed stop.");
        } else {
            console.error("Sorting error:", error);
        }
    } finally {
        setSorting(false);
        setVisitedIndices([]);
        setSwappedIndices([]);
    }
  };

  const handleStop = () => {
    shouldStopRef.current = true;
    // release any pending step to allow exit
    if (stepResolverRef.current) stepResolverRef.current();
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Teacher Instruction Banner */}
      <div className="bg-purple-900/40 border border-purple-500/30 p-4 rounded-xl flex items-start gap-3 backdrop-blur-md shadow-lg shadow-purple-500/5">
        <div className="p-2 bg-purple-500/20 rounded-lg shrink-0 mt-1">
            <GraduationCap className="text-purple-300 w-6 h-6" />
        </div>
        <div>
            <h4 className="text-purple-200 font-bold mb-1 text-sm uppercase tracking-wider">Teacher's Notes</h4>
            <div className="flex items-center gap-2">
               <p className="text-lg text-white font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300 key={instruction}">
                   {instruction}
               </p>
               {sorting && !isAuto && (
                   <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full animate-pulse border border-yellow-500/30">
                       Waiting for Next Step...
                   </span>
               )}
            </div>
        </div>
      </div>

      {/* Controls Header */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 glass-card rounded-2xl gap-4">
        <div className="flex items-center gap-4">
           {/* Algo Selector */}
           <div className="relative">
             <select 
               value={selectedAlgo}
               onChange={(e) => setSelectedAlgo(e.target.value)}
               disabled={sorting}
               className="appearance-none bg-black/40 border border-white/10 text-white px-4 py-2 pr-8 rounded-lg outline-none focus:border-purple-500 transition-colors cursor-pointer min-w-[160px]"
             >
               {Object.entries(ALGORITHMS).map(([key, label]) => (
                 <option key={key} value={key} className="bg-gray-900">{label}</option>
               ))}
             </select>
             <Settings className="absolute right-2 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
           </div>
           
           {/* Speed Selector */}
           <div className="flex items-center gap-2 text-sm text-gray-400">
             <span>Speed:</span>
             <select 
               value={delay} 
               onChange={(e) => setDelay(Number(e.target.value))}
               className="bg-black/40 border-none outline-none text-white rounded px-2 py-1 cursor-pointer"
             >
                <option value={1000}>Very Slow</option>
                <option value={600}>Slow</option>
                <option value={300}>Normal</option>
                <option value={100}>Fast</option>
             </select>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" disabled={sorting} onClick={resetArray} className="border-white/10 hover:bg-white/5">
            <RefreshCw size={16} className="mr-2" />
            Reset
          </Button>

          {sorting ? (
              <>
                 {!isAuto && (
                     <>
                        <Button onClick={handleNextStep} className="bg-blue-500 hover:bg-blue-600 text-white border-none">
                            <StepForward size={16} fill="currentColor" className="mr-2" />
                            Next Step
                        </Button>
                        <Button onClick={switchToAuto} variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                            <Play size={16} className="mr-2" />
                            Auto
                        </Button>
                     </>
                 )}
                 <Button onClick={handleStop} className="bg-red-500/80 hover:bg-red-600 text-white border-none shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    <Square size={16} fill="currentColor" className="mr-2" />
                    Stop
                 </Button>
              </>
          ) : (
              <>
                  <Button onClick={() => handleStart('STEP')} variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
                    <StepForward size={16} className="mr-2" />
                    Step Mode
                  </Button>
                  <Button onClick={() => handleStart('AUTO')} className="bg-linear-to-r from-purple-500 to-pink-600 border-none">
                    <Play size={16} fill="currentColor" className="mr-2" />
                    Auto Mode
                  </Button>
              </>
          )}
        </div>
      </div>

      {/* Visualizer Area */}
      <div className="h-[400px] flex items-end justify-center gap-3 p-8 glass-card rounded-2xl relative overflow-hidden">
        {array.map((value, idx) => {
          const isVisited = visitedIndices.includes(idx);
          const isSwapped = swappedIndices.includes(idx);

          return (
            <div
              key={idx}
              className="flex-1 rounded-t-lg transition-all duration-300 ease-in-out flex items-end justify-center pb-2 relative group"
              style={{
                height: `${value}%`,
                backgroundColor: isSwapped
                  ? "#ef4444" // Red: Swap
                  : isVisited
                  ? "#a78bfa" // Purple: Visit
                  : "#3b82f6", // Blue: Default
                opacity: 0.9,
                boxShadow: isSwapped || isVisited ? "0 0 20px currentColor" : "none",
                transform: (isSwapped || isVisited) ? "scale(1.05)" : "scale(1)",
                zIndex: (isSwapped || isVisited) ? 10 : 0
              }}
            >
             {/* Value visualization inside the bar */}
             <span className="text-xs font-bold text-white/90 drop-shadow-md mb-1 z-10 hidden sm:block">
                {value}
             </span>
             
             {/* Hover tooltip */}
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black py-1 px-2 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/20 z-20">
                Index: {idx} | Val: {value}
             </div>
            </div>
          );
        })}
      </div>

       {/* Info Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Details Card */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
              {ALGO_INFO[selectedAlgo]?.title}
            </h2>
            <p className="text-white/70 mb-6 leading-relaxed border-l-2 border-purple-500 pl-4">
                {ALGO_INFO[selectedAlgo]?.description}
            </p>
            
            <div className="grid grid-cols-3 gap-4">
               <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-center hover:bg-white/10 transition-colors">
                 <div className="text-xs text-gray-500 mb-1">Time (Avg)</div>
                 <div className="text-lg font-mono font-bold text-yellow-400">
                    {ALGO_INFO[selectedAlgo]?.complexity.time}
                 </div>
               </div>
               <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-center hover:bg-white/10 transition-colors">
                 <div className="text-xs text-gray-500 mb-1">Best Case</div>
                 <div className="text-lg font-mono font-bold text-green-400">
                    {ALGO_INFO[selectedAlgo]?.complexity.best}
                 </div>
               </div>
               <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-center hover:bg-white/10 transition-colors">
                 <div className="text-xs text-gray-500 mb-1">Space</div>
                 <div className="text-lg font-mono font-bold text-blue-400">
                    {ALGO_INFO[selectedAlgo]?.complexity.space}
                 </div>
               </div>
            </div>
          </div>

          {/* Code Snippet */}
          <div className="glass-card p-6 rounded-2xl overflow-hidden relative group">
            <div className="absolute top-4 right-4 text-xs font-mono text-gray-500 bg-black/50 px-2 py-1 rounded">JavaScript</div>
            <pre className="font-mono text-sm text-gray-300 overflow-x-auto p-2 scrollbar-hide">
              <code>{ALGO_INFO[selectedAlgo]?.code}</code>
            </pre>
          </div>
       </div>
    </div>
  );
};

export default SortingVisualizer;
