"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Layout, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function Home() {
    const { user, isLoaded } = useUser();
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // Pre-fill if user already has data (Optional, good for UX)
    useEffect(() => {
        if (isLoaded) {
            if (!user) {
                router.push("/"); // Redirect if not signed in
            } else {
                // We could fetch existing profile here if we wanted to allow editing
            }
        }
    }, [isLoaded, user, router]);

    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Optimistic preview
        const objectUrl = URL.createObjectURL(file);
        setAvatar(objectUrl);
        setIsUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Upload failed");
            }

            const data = await res.json();
            setAvatar(data.url); // Replace blob with real URL
        } catch (err: any) {
            console.error(err);
            const msg = "Failed to upload image. Please try again.";
            setError(msg);
            toast.error(msg);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        if (username.trim()) {
            const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '-');

            try {
                const res = await fetch('/api/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: cleanUsername,
                        bio,
                        avatar: avatar || user?.imageUrl // Use Clerk avatar if none selected
                    })
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Failed to create profile');
                }

                // Success!
                router.push(`/${cleanUsername}`);
            } catch (err: any) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />

            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-8 relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg transform -rotate-6">
                        <Layout className="w-8 h-8 text-white dark:text-black" />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Claim your Bento</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">Create your unique corner of the internet.</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Avatar Selection */}
                    <div className="flex justify-center">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden hover:border-black dark:hover:border-white transition-colors" onClick={() => document.getElementById('avatar-upload')?.click()}>
                                {avatar || user?.imageUrl ? (
                                    <img src={avatar || user?.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <Sparkles className="w-8 h-8 text-zinc-400" />
                                )}
                            </div>
                            {/* Hidden Input */}
                            <input
                                id="avatar-upload"
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm pointer-events-none">
                                <span className="text-xs font-bold">+</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="group relative transition-all duration-300 hover:scale-[1.01]">
                            <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-[2rem] blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
                            <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-3xl p-1.5 shadow-xl transition-colors">
                                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 backdrop-blur px-4 py-3 rounded-2xl text-zinc-500 dark:text-zinc-400 font-medium text-sm select-none">
                                    <span>bento.me</span>
                                    <span className="text-zinc-300 dark:text-zinc-600">/</span>
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full border-0 bg-transparent py-2.5 pl-3 text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:ring-0 outline-none text-lg font-bold tracking-tight"
                                    placeholder="username"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="group relative transition-all duration-300 hover:scale-[1.01]">
                            <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[2rem] blur opacity-10 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-xl border-2 border-transparent focus-within:border-zinc-100 dark:focus-within:border-zinc-800 transition-all">
                                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 ml-1">
                                    Bio
                                </label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="block w-full border-0 bg-transparent p-0 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 resize-none font-medium"
                                    placeholder="Designer, developer, dreamer..."
                                    rows={3}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative flex w-full justify-center rounded-full bg-black dark:bg-white px-3 py-3 text-sm font-semibold text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span>Creating...</span>
                        ) : (
                            <>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                                <span className="relative flex items-center gap-2">
                                    Create Bento <ArrowRight className="w-4 h-4" />
                                </span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
