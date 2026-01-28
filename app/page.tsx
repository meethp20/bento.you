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
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3 h-3" />
              <span>v1.0 Public Beta</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-500">
              Your Internet <br className="hidden md:block" />
              Identity. <br className="hidden md:block" />
              <span className="italic font-serif font-medium text-black">Curated.</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-600 max-w-lg leading-relaxed">
              Showcase your work, social life, and passions in a beautiful, modular grid. No coding required. Just drag, drop, and share.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/profiler"
                className="group relative px-8 py-4 bg-black text-white rounded-full text-lg font-bold overflow-hidden transition-all hover:pr-12"
              >
                <span className="relative z-10">Claim your Bento</span>
                <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>

              <span className="text-sm text-zinc-500 font-medium px-2">
                Free forever. No credit card required.
              </span>
            </div>
          </div>

          {/* Abstract Visual - Tilted Grid */}
          <div className="relative h-[600px] hidden lg:block perspective-[2000px] group">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />

            <div className="relative w-full h-full transform transition-transform duration-700 ease-out group-hover:rotate-y-6 group-hover:rotate-x-6 preserve-3d">
              {/* Simulated Bento Grid */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[600px] bg-white rounded-[3rem] shadow-2xl border-8 border-zinc-900 p-4 grid grid-cols-2 grid-rows-4 gap-4 rotate-[-12deg] hover:rotate-0 transition-all duration-700">

                {/* Header */}
                <div className="col-span-2 bg-zinc-100 rounded-2xl p-6 flex flex-col justify-end">
                  <div className="w-16 h-16 bg-zinc-300 rounded-full mb-4" />
                  <div className="h-4 w-32 bg-zinc-300 rounded-full mb-2" />
                  <div className="h-3 w-48 bg-zinc-200 rounded-full" />
                </div>

                {/* Square 1 */}
                <div className="bg-purple-500 rounded-3xl flex items-center justify-center text-white">
                  <Share2 className="w-8 h-8" />
                </div>

                {/* Square 2 */}
                <div className="bg-black rounded-3xl" />

                {/* Wide */}
                <div className="col-span-2 bg-blue-500 rounded-3xl" />

                {/* Tall */}
                <div className="row-span-1 bg-zinc-100 rounded-3xl" />
                <div className="bg-pink-500 rounded-3xl" />
              </div>

              {/* Floating Elements */}
              <div className="absolute top-[20%] right-[10%] w-24 h-24 bg-yellow-400 rounded-2xl shadow-xl flex items-center justify-center rotate-12 animate-bounce hover:scale-110 transition-transform">
                <span className="text-4xl">👋</span>
              </div>
              <div className="absolute bottom-[20%] left-[0%] w-20 h-20 bg-green-500 rounded-2xl shadow-xl rotate-[-6deg] animate-pulse flex items-center justify-center">
                <Layout className="w-8 h-8 text-white" />
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
