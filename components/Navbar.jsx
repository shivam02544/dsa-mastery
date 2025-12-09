"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Code2, BarChart2, BookOpen, Menu, LogOut, User as UserIcon, Loader2 } from "lucide-react";
import Button from "./ui/Button";
import { cn } from "@/lib/utils";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navItems = [
    { name: "Learn", href: "/learn", icon: BookOpen },
    { name: "Visualizer", href: "/visualizer", icon: BarChart2 },
    { name: "Playground", href: "/playground", icon: Code2 },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 px-6 py-4"
    >
      <nav className="glass-card max-w-7xl mx-auto rounded-2xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-cyan-400 group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-xl tracking-tight">
            DSA<span className="text-purple-400">Mastery</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-white",
                  isActive ? "text-purple-400" : "text-gray-400"
                )}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {status === 'loading' ? (
              <Loader2 className="animate-spin text-gray-400" size={20} />
          ) : session ? (
              <div className="flex items-center gap-4">
                  <Link href="/profile" className="hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity">
                      {session.user.image ? (
                          <img src={session.user.image} alt={session.user.name} className="w-8 h-8 rounded-full border border-purple-500/30" />
                      ) : (
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                              <UserIcon size={16} className="text-purple-300" />
                          </div>
                      )}
                      <span className="text-sm font-medium text-gray-300">{session.user.name?.split(' ')[0]}</span>
                  </Link>
                  <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => signOut()}
                      className="text-gray-400 hover:text-red-400"
                  >
                      <LogOut size={18} />
                  </Button>
              </div>
          ) : (
              <>
                  <Button variant="ghost" size="sm" onClick={() => signIn('google')} className="hidden md:flex">
                      Sign In
                  </Button>
                  <Button size="sm" onClick={() => signIn('google')} className="bg-linear-to-r from-purple-600 to-cyan-600 border-0">
                      Get Started
                  </Button>
              </>
          )}

          <button className="md:hidden text-gray-400 hover:text-white">
            <Menu />
          </button>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
