import Link from "next/link";
import { ArrowRight, Code2, Database, Zap } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] px-6 text-center relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] -z-10" />

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
        <span className="bg-clip-text text-transparent bg-linear-to-br from-white via-white to-gray-500">
          Visualize.
        </span>
        <br />
        <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-cyan-400">
          Master Algorithms.
        </span>
      </h1>

      <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
        The most advanced platform to learn Data Structures & Algorithms. 
        Interactive visualizations, code playgrounds, and progress tracking powered by 
        <span className="text-white font-semibold mx-1">MongoDB</span>.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link href="/learn">
          <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 shadow-xl shadow-white/10">
            Start Learning
          </Button>
        </Link>
        <Link href="/visualizer">
          <Button variant="outline" size="lg" className="w-full sm:w-auto border-gray-700 bg-transparent text-white hover:bg-white/10">
            Try Visualizer
          </Button>
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl w-full">
        {[
          { icon: Zap, title: "Real-time Viz", desc: "See bubbles sort and graphs traverse in real-time." },
          { icon: Database, title: "Persistent Progress", desc: "Your journey is saved locally using MongoDB." },
          { icon: Code2, title: "Modern Stack", desc: "Built with Next.js 14, Tailwind, and Framer Motion." }
        ].map((feature, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
            <feature.icon className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
