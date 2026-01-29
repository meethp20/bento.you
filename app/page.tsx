"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { ArrowRight, Layout, Share2, Sparkles, MoveUpRight, Github, Twitter } from "lucide-react";
import { LandingGrid } from "@/components/layout/LandingGrid";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkRedirect = async () => {
      if (isSignedIn && user) {
        try {
          // Check if user has a Bento profile
          const res = await fetch('/api/profile');
          if (res.ok) {
            const data = await res.json();
            if (data.username) {
              router.push(`/${data.username}`);
            } else {
              router.push('/profiler'); // User logged in but no profile yet
            }
          } else if (res.status === 404) {
            router.push('/profiler');
          }
        } catch (error) {
          console.error("Failed to check profile", error);
        }
      }
    };

    checkRedirect();
  }, [isSignedIn, user, router]);

  return (
    <div className="min-h-screen bg-white text-black selection:bg-purple-500/30 font-sans overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-white/70 border-b border-black/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">bento</span>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-zinc-600 hover:text-black transition-colors cursor-pointer">
                Login
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">

          {/* Content */}
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-zinc-200 shadow-sm rounded-full text-xs font-bold tracking-wide uppercase text-zinc-600">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>v1.0 Public Beta</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-zinc-900">
              Your Internet <br className="hidden md:block" />
              Identity. <br className="hidden md:block" />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 px-4 py-2 bg-black text-white -rotate-2 inline-block rounded-lg shadow-xl transform origin-bottom-left hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-default">
                  Curated.
                </span>
                {/* Decorative underline/scribble could go here */}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 max-w-lg leading-relaxed font-medium">
              Showcase your work, social life, and passions in a beautiful, modular grid. No coding required. Just drag, drop, and share.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/profiler"
                className="group relative px-8 py-4 bg-zinc-900 text-white rounded-full text-lg font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10 flex items-center gap-2">
                  Claim your Bento <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <span className="text-sm text-zinc-400 font-medium px-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Free forever
              </span>
            </div>
          </div>

          {/* Abstract Visual - Tilted Grid */}
          <div className="relative h-[800px] hidden lg:flex items-center justify-center perspective-[2500px] group">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply translate-x-20 -translate-y-20" />

            {/* 3D Phone Container */}
            <div className="relative w-[380px] h-[780px] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-y-[-12deg] group-hover:rotate-x-[8deg] group-hover:scale-105 rotate-y-[-6deg] rotate-x-[4deg] preserve-3d">

              {/* Phone Bezel */}
              <div className="absolute inset-0 bg-white rounded-[3.5rem] shadow-2xl border-[8px] border-zinc-900 overflow-hidden ring-1 ring-zinc-900/5">

                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-3xl z-50 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black rounded-full absolute -top-10 blur-xl opacity-50"></div>
                </div>

                {/* Screen Content */}
                <div className="w-full h-full overflow-hidden bg-white flex flex-col pt-16 px-5 relative">
                  {/* Subtle Grid Pattern inside phone */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                  {/* Profile Header */}
                  <div className="flex flex-col items-center gap-4 mb-8 relative z-10">
                    <div className="w-24 h-24 rounded-full bg-zinc-100 overflow-hidden ring-4 ring-white shadow-lg">
                      <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2662&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <h2 className="text-2xl font-black text-zinc-900">Alex Designer</h2>
                      <p className="text-sm text-zinc-500 font-medium">Visual Storyteller & Creator</p>
                    </div>
                  </div>

                  {/* Grid Mockup */}
                  <div className="grid grid-cols-2 gap-3 pb-8 relative z-10">

                    {/* Instagram Card (Premium) */}
                    <div className="col-span-1 aspect-square rounded-3xl relative overflow-hidden group/card cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] transition-transform duration-500 group-hover/card:scale-110" />
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                      </div>
                    </div>

                    {/* Twitter Card (Premium) */}
                    <div className="col-span-1 aspect-square rounded-3xl bg-black relative overflow-hidden group/card cursor-pointer flex items-center justify-center">
                      <div className="absolute inset-0 bg-zinc-800/0 group-hover/card:bg-zinc-800/30 transition-colors" />
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white relative z-10"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </div>

                    {/* Spotify Card (Wide) */}
                    <div className="col-span-2 h-32 rounded-3xl bg-[#1db954] relative overflow-hidden group/card cursor-pointer flex items-center justify-between px-6">
                      <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors" />
                      <div className="absolute bottom-[-20%] right-[-10%] w-40 h-40 bg-white/20 blur-3xl rounded-full" />

                      <div className="flex flex-col gap-1 relative z-10 text-white">
                        <span className="text-xs font-bold opacity-80 uppercase tracking-wider">Now Playing</span>
                        <span className="font-bold text-xl">Late Night Vibes</span>
                      </div>
                      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white relative z-10 drop-shadow-sm"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S16.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
                    </div>

                    {/* Image Map Block */}
                    <div className="col-span-2 h-40 bg-zinc-100 rounded-3xl relative overflow-hidden group/card">
                      <img src="https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" alt="New York" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <span className="text-xs font-bold uppercase tracking-wider block mb-1 opacity-80">Location</span>
                        <span className="font-bold text-lg">New York City</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Floating Elements (Re-styled) */}
              <div className="absolute top-[15%] right-[-30px] w-16 h-16 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center rotate-12 animate-[bounce_3s_infinite] z-50">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="absolute bottom-[20%] left-[-40px] px-4 py-2 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] -rotate-6 animate-[pulse_4s_infinite] z-50 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-zinc-800">Available</span>

              </div>
            </div>
          </div>
        </section>

        {/* Features / Bento Grid Demo */}
        <section className="mt-20 md:mt-32 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything you are. <br /> In one simple link.</h2>
            <p className="text-zinc-500 max-w-lg mx-auto text-lg">
              Join thousands of creators, developers, and designers using Bento to share their story.
            </p>
          </div>

          <LandingGrid />
        </section>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6 px-6">
          <span className="text-zinc-400 font-medium">© 2024 Bento Clone. Open Source.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="text-zinc-400 hover:text-black transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-400 hover:text-black transition-colors"><Twitter className="w-5 h-5" /></a>
          </div>
        </footer>

      </main>
    </div>
  );
}
