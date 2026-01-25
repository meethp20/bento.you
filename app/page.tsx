"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Layout } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useState<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setAvatar(objectUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '-');
      const params = new URLSearchParams();
      params.set('bio', bio);
      if (avatar) params.set('avatar', avatar);

      router.push(`/${cleanUsername}?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">

          {/* Profile Picture Upload */}
          <div className="mx-auto w-32 h-32 relative group cursor-pointer mb-6" >
            <div className="w-full h-full rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-xl" onClick={() => document.getElementById('avatar-upload')?.click()}>
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" alt="Default Profile" className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity" />
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">Change</span>
              </div>
            </div>
            {/* Hidden Input */}
            <input
              id="avatar-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          <h2 className="mt-2 text-3xl font-extrabold text-zinc-900 dark:text-white">
            Claim your Bento
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Create your personal page in seconds.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">

            {/* Username Input - Creative */}
            <div className="group relative transition-all duration-300 hover:scale-[1.01]">
              <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-3xl p-1.5 shadow-xl transition-colors">
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 backdrop-blur px-4 py-3 rounded-2xl text-zinc-500 dark:text-zinc-400 font-medium text-sm select-none">
                  <span>bento.me</span>
                  <span className="text-zinc-300 dark:text-zinc-600">/</span>
                </div>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="block w-full border-0 bg-transparent py-2.5 pl-3 text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:ring-0 outline-none text-lg font-bold tracking-tight"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Bio Input - Creative */}
            <div className="group relative transition-all duration-300 hover:scale-[1.01]">
              <div className="relative bg-white dark:bg-zinc-900 rounded-3xl p-1.5 shadow-xl transition-colors">
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  className="block w-full rounded-2xl border-0 bg-zinc-50 dark:bg-zinc-900/50 py-3 px-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-0 outline-none text-sm leading-relaxed resize-none font-medium"
                  placeholder="Write a short bio about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-full bg-black dark:bg-white px-3 py-3 text-sm font-semibold text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
            >
              <span className="flex items-center gap-2">
                Create Bento <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
