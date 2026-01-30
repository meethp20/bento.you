"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { ArrowRight, Layout, Share2, Sparkles, MoveUpRight, Github, Twitter } from "lucide-react";
import { LandingGrid } from "@/components/layout/LandingGrid";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import { Block } from "@/core/types/block";
import { useState } from "react";

export default function LandingPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const [demoBlocks, setDemoBlocks] = useState<Block[]>([
    {
      id: 'demo-1',
      type: 'quote',
      x: 0, y: 0, w: 2, h: 2,
      data: { text: "The details are not the details. They make the design.", title: "Charles Eames" }
    },
    {
      id: 'demo-2',
      type: 'social',
      x: 0, y: 2, w: 1, h: 1,
      data: { platform: 'instagram', url: 'https://instagram.com' }
    },
    {
      id: 'demo-3',
      type: 'social',
      x: 1, y: 2, w: 1, h: 1,
      data: { platform: 'twitter', url: 'https://twitter.com' }
    },
    {
      id: 'demo-4',
      type: 'map',
      x: 0, y: 3, w: 2, h: 1,
      data: { location: "San Francisco, CA" }
    },
    {
      id: 'demo-5',
      type: 'social',
      x: 0, y: 4, w: 2, h: 1,
      data: { platform: 'spotify', title: "Late Night Vibes", url: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT' }
    }
  ]);

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

      <main className="pt-40 pb-40 px-6">

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">

          {/* Content */}
          <div className="space-y-10 relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-zinc-200 shadow-sm rounded-full text-xs font-bold tracking-wide uppercase text-zinc-600">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>v1.0 Public Beta</span>
            </div>

            <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] text-zinc-900">
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

            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4">
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
                Lime Green Studios
              </span>
            </div>
          </div>

          {/* Abstract Visual - Tilted Grid */}
          <div className="relative h-[800px] hidden lg:flex items-center justify-center perspective-[2500px] group">
            {/* Helper Text */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-zinc-400/50 text-sm font-medium tracking-widest uppercase animate-pulse pointer-events-none z-50">
              Try dragging and dropping
            </div>

            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply translate-x-20 -translate-y-20" />

            {/* 3D Phone Container */}
            <div className="relative w-[380px] h-[780px] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105 rotate-y-[-6deg] rotate-x-[4deg] preserve-3d">

              {/* Phone Bezel */}
              <div className="absolute inset-0 bg-white rounded-[3.5rem] shadow-2xl border-[8px] border-zinc-900 overflow-hidden ring-1 ring-zinc-900/5">

                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-3xl z-50 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black rounded-full absolute -top-10 blur-xl opacity-50"></div>
                </div>

                {/* Screen Content */}
                <div className="w-full h-full overflow-hidden bg-white flex flex-col pt-16 relative">
                  {/* Subtle Grid Pattern inside phone */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                  {/* Profile Header */}
                  <div className="flex flex-col items-center gap-4 mb-2 relative z-10 px-5 pointer-events-none select-none">
                    <div className="w-24 h-24 rounded-full bg-zinc-100 overflow-hidden ring-4 ring-white shadow-lg">
                      <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2662&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <h2 className="text-2xl font-black text-zinc-900">Alex Designer</h2>
                      <p className="text-sm text-zinc-500 font-medium">Visual Storyteller & Creator</p>
                    </div>
                  </div>

                  {/* Real Grid Implementation */}
                  <div className="flex-1 w-full overflow-y-auto no-scrollbar mask-gradient-b">
                    <div className="scale-[0.85] origin-top w-full -mt-4">
                      <Container
                        blocks={demoBlocks}
                        isEditMode={true}
                        isLandingPage={true}
                        onLayoutChange={setDemoBlocks}
                        onDeleteBlock={() => { }}
                      />
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

          <div className="text-center mb-8 -mt-10">
            <span className="text-zinc-400/50 text-sm font-medium tracking-widest uppercase animate-pulse select-none">
              Try dragging and dropping
            </span>
          </div>

          <LandingGrid />
        </section>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6 px-6">
          <span className="text-zinc-400 font-medium">© 2026 Bento. Open Source.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="text-zinc-400 hover:text-black transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-400 hover:text-black transition-colors"><Twitter className="w-5 h-5" /></a>
          </div>
        </footer>

      </main>
    </div>
  );
}
