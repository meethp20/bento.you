"use client";

import React, { useState, useEffect } from 'react';
import { useClerk } from "@clerk/nextjs";
import {
    Settings,
    LogOut,
    Download,
    Mail,
    Lock,
    User,
    Check,
    X as XIcon,
    Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Re-using themes from ThemePanel
export type ThemeId = 'sunset-bliss' | 'ocean-breeze' | 'forest-zen' | 'rainbow' | 'grid' | 'stars';

export const THEMES: { id: ThemeId; name: string; colors: string[] }[] = [
    { id: 'sunset-bliss', name: 'Sunset Bliss', colors: ['#f97316', '#fb923c', '#c2410c'] },
    { id: 'ocean-breeze', name: 'Ocean Breeze', colors: ['#06b6d4', '#22d3ee', '#0891b2'] },
    { id: 'forest-zen', name: 'Forest Zen', colors: ['#10b981', '#34d399', '#059669'] },
    { id: 'rainbow', name: 'Rainbow', colors: ['#c7d2fe', '#e9d5ff', '#fbcfe8'] },
    { id: 'grid', name: 'Geometric', colors: ['#e4e4e7', '#f4f4f5', '#d4d4d8'] },
    { id: 'stars', name: 'Stardust', colors: ['#000000', '#1a1a1a', '#ffffff'] },
];

interface SettingsMenuProps {
    isOpen: boolean;
    onClose: () => void;
    currentTheme: ThemeId;
    onThemeChange: (theme: ThemeId) => void;
    username: string;
    onUsernameChange: (newUsername: string) => Promise<boolean>; // Returns success/fail
    bio: string;
    onBioChange: (newBio: string) => Promise<boolean>; // Returns success/fail
    email?: string;
}

export function SettingsMenu({
    isOpen,
    onClose,
    currentTheme,
    onThemeChange,
    username,
    onUsernameChange,
    bio,
    onBioChange,
    email = "Signed in with Clerk"
}: SettingsMenuProps) {
    const { signOut } = useClerk();
    const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile'); // mostly single view in bento
    const [editUsername, setEditUsername] = useState(username);
    const [editBio, setEditBio] = useState(bio);
    const [isChecking, setIsChecking] = useState(false);
    const [isSavingUser, setIsSavingUser] = useState(false);

    // Reset edit username and bio when menu opens or values change
    useEffect(() => {
        setEditUsername(username);
        setEditBio(bio);
    }, [username, bio, isOpen]);

    const handleSaveUsername = async () => {
        if (editUsername === username) return;

        // Basic validation
        if (!/^[a-zA-Z0-9_-]+$/.test(editUsername)) {
            toast.error("Invalid username format");
            return;
        }

        setIsSavingUser(true);
        try {
            const success = await onUsernameChange(editUsername);
            if (success) {
                toast.success("Username updated");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSavingUser(false);
        }
    };

    const handleSaveBio = async () => {
        if (editBio === bio) return;

        setIsSavingUser(true);
        try {
            const success = await onBioChange(editBio);
            if (success) {
                toast.success("Bio updated");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSavingUser(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                    />

                    {/* Menu */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className="fixed bottom-20 left-4 z-50 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                    >
                        {/* Header Section */}
                        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Settings</h2>

                            {/* Change Username */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Change Username</label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-medium text-sm">/</span>
                                    <input
                                        type="text"
                                        value={editUsername}
                                        onChange={(e) => setEditUsername(e.target.value)}
                                        onBlur={handleSaveUsername}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-lg pl-6 pr-8 py-2 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all"
                                    />
                                    {isSavingUser && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Change Bio */}
                            <div className="space-y-1.5 mt-4">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Change Bio</label>
                                <div className="relative group">
                                    <textarea
                                        value={editBio}
                                        onChange={(e) => setEditBio(e.target.value)}
                                        onBlur={handleSaveBio}
                                        rows={3}
                                        placeholder="Tell us about yourself..."
                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-lg px-3 py-2 text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Themes Section */}
                        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Appearance</label>
                            </div>

                            <div className="space-y-1">
                                {THEMES.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => onThemeChange(theme.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group relative overflow-hidden",
                                            currentTheme === theme.id
                                                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                                        )}
                                    >
                                        <span className="relative z-10">{theme.name}</span>

                                        {/* Palette Preview on Hover */}
                                        {/* Palette Preview on Hover */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-3">
                                            {theme.colors.map((color, i) => (
                                                <div
                                                    key={i}
                                                    className="w-3 h-3 rounded-full border border-black/10 dark:border-white/10 shadow-sm"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>

                                        {/* Simple Active Indicator */}
                                        {currentTheme === theme.id && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-black dark:bg-white rounded-l-lg" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Authenticated User Actions */}
                        <div className="p-2 space-y-1">
                            <div className="px-3 py-2">
                                <p className="text-xs font-medium text-zinc-500 mb-1">Email</p>
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-300 truncate">{email}</p>
                            </div>

                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
