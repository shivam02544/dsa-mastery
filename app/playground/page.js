'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Trash2, RefreshCcw, Terminal, Code2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Syntax Highlighting
// Monaco Editor
import Editor from '@monaco-editor/react';

// Example snippets
const EXAMPLES = {
  'HELLO': {
    label: 'Hello World',
    code: `// Welcome to the Playground!
// Write your JavaScript code here.

console.log("Hello, DSA Mastery!");
console.log("Let's solve some problems.");

const x = 10;
const y = 20;
console.log(\`Sum of \${x} + \${y} is:\`, x + y);
`
  },
  'ARRAY_SUM': {
    label: 'Array Sum',
    code: `// Calculate sum of an array

function calculateSum(arr) {
  let sum = 0;
  for (let num of arr) {
    sum += num;
  }
  return sum;
}

const numbers = [1, 5, 10, 20, 50];
console.log("Input Array:", numbers);
console.log("Total Sum:", calculateSum(numbers));
`
  },
  'FIZZBUZZ': {
    label: 'FizzBuzz',
    code: `// Classical FizzBuzz Problem

for (let i = 1; i <= 15; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}
`
  }
};

export default function PlaygroundPage() {
  const [code, setCode] = useState(EXAMPLES.HELLO.code);
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(null);
  const [selectedExample, setSelectedExample] = useState('HELLO');
  const [isRunning, setIsRunning] = useState(false);
  
  // Ref for auto-scrolling console
  const consoleEndRef = useRef(null);

  const scrollToBottom = () => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [output, error]);

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setOutput([]);

    // Small delay to simulate processing and allow UI update
    await new Promise(r => setTimeout(r, 300));

    try {
      const logs = [];
      
      // Custom console proxy
      const customConsole = {
        log: (...args) => {
          const formattedArgs = args.map(arg => {
             if (typeof arg === 'object') {
                 try {
                     return JSON.stringify(arg, null, 2);
                 } catch (e) {
                     return arg.toString();
                 }
             }
             return String(arg);
          }).join(' ');
          logs.push({ type: 'log', content: formattedArgs, time: new Date().toLocaleTimeString() });
        },
        error: (...args) => {
           logs.push({ type: 'error', content: args.join(' '), time: new Date().toLocaleTimeString() });
        },
        warn: (...args) => {
           logs.push({ type: 'warn', content: args.join(' '), time: new Date().toLocaleTimeString() });
        },
        info: (...args) => {
           logs.push({ type: 'info', content: args.join(' '), time: new Date().toLocaleTimeString() });
        }
      };

      // Wrap code in a function to isolate scope and inject console
      const runUserCode = new Function('console', `
        "use strict";
        try {
          ${code}
        } catch(err) {
          throw err;
        }
      `);

      runUserCode(customConsole);
      
      setOutput(logs);
      if (logs.length === 0) {
          setOutput([{ type: 'info', content: 'Code executed successfully (No Output)', time: new Date().toLocaleTimeString() }]);
      }

    } catch (err) {
      setError(err.toString());
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput([]);
    setError(null);
  };

  const handleExampleChange = (key) => {
    setSelectedExample(key);
    setCode(EXAMPLES[key].code);
    setOutput([]);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-80px)] flex flex-col">
       {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-400 to-blue-500 flex items-center gap-3">
             <Code2 className="text-blue-400" />
             JS Playground
          </h1>
          <p className="text-gray-400 text-sm mt-1">Write, Run, and Debug JavaScript in real-time.</p>
        </div>

        <div className="flex items-center gap-3">
            <div className="relative group">
                <select 
                    value={selectedExample}
                    onChange={(e) => handleExampleChange(e.target.value)}
                    className="appearance-none bg-black/40 border border-white/10 text-white pl-4 pr-8 py-2 rounded-lg outline-none focus:border-blue-500 cursor-pointer text-sm min-w-[150px]"
                >
                    {Object.entries(EXAMPLES).map(([key, val]) => (
                        <option key={key} value={key} className="bg-gray-900">{val.label}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Terminal size={12} />
                </div>
            </div>
            
             <Button onClick={handleRun} disabled={isRunning} className="bg-green-600 hover:bg-green-500">
                {isRunning ? (
                    <RefreshCcw size={18} className="animate-spin mr-2" />
                ) : (
                    <Play size={18} className="mr-2 fill-current" />
                )}
                {isRunning ? 'Running...' : 'Run Code'}
            </Button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          
          {/* Editor Section */}
          <div className="glass-card rounded-2xl flex flex-col overflow-hidden border border-white/10 shadow-2xl">
              <div className="bg-black/40 px-4 py-3 border-b border-white/5 flex justify-between items-center">
                  <span className="text-sm font-mono text-gray-400">main.js</span>
                   <button 
                        onClick={handleClear}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                   >
                       <Trash2 size={12} /> Clear
                   </button>
              </div>
              <div className="flex-1 relative bg-[#1e1e1e] overflow-hidden"> 
                 {/* Monaco Editor Container */}
                 <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value)}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'Fira Code', 'Fira Mono', monospace",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 16, bottom: 16 },
                    }}
                  />
              </div>
          </div>

          {/* Console Section */}
          <div className="glass-card rounded-2xl flex flex-col overflow-hidden border border-white/10 shadow-2xl">
              <div className="bg-black/40 px-4 py-3 border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                       <Terminal size={14} className="text-gray-400" />
                       <span className="text-sm font-mono text-gray-400">Console Output</span>
                  </div>
                  {output.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {output.length} logs
                      </span>
                  )}
              </div>
              
              <div className="flex-1 bg-[#09090b] p-4 overflow-y-auto font-mono text-sm">
                 {output.length === 0 && !error && (
                     <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                         <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                             <Play size={20} className="ml-1 opacity-50" />
                         </div>
                         <p>Run your code to see output here</p>
                     </div>
                 )}

                 <AnimatePresence mode="popLayout">
                    {output.map((log, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                                "mb-2 pb-2 border-b border-white/5 last:border-0",
                                log.type === 'error' ? "text-red-400" : 
                                log.type === 'warn' ? "text-yellow-400" : "text-gray-300"
                            )}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-[10px] text-gray-600 mt-1 select-none font-sans min-w-[50px]">
                                    {log.time}
                                </span>
                                <pre className="whitespace-pre-wrap flex-1 break-all font-mono">
                                    {log.type === 'error' && <AlertCircle size={12} className="inline mr-2 align-text-top" />}
                                    {log.content}
                                </pre>
                            </div>
                        </motion.div>
                    ))}
                 </AnimatePresence>

                 {error && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200"
                     >
                         <h4 className="flex items-center gap-2 font-bold mb-1 text-red-400">
                             <AlertCircle size={16} /> Runtime Error
                         </h4>
                         <pre className="whitespace-pre-wrap text-sm opacity-80 pl-6">
                             {error}
                         </pre>
                     </motion.div>
                 )}
                 
                 <div ref={consoleEndRef} />
              </div>
          </div>
      </div>
    </div>
  );
}
