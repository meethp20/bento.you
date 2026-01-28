"use client";

import React, { useState } from 'react';
import { Palette, X } from 'lucide-react';
import { AnimatedThemeToggler } from './animated-theme-toggler';
import { cn } from '@/lib/utils';

export type ThemeId = 'tokyo-night' | 'sunset-bliss' | 'ocean-breeze' | 'forest-zen' | 'rainbow';

export const THEMES: { id: ThemeId; name: string; color: string; textColor?: string }[] = [
    { id: 'tokyo-night', name: 'Tokyo Night', color: '#7e22ce' }, // Purple
    { id: 'sunset-bliss', name: 'Sunset Bliss', color: '#f97316' }, // Orange
    { id: 'ocean-breeze', name: 'Ocean Breeze', color: '#06b6d4' }, // Cyan
    { id: 'forest-zen', name: 'Forest Zen', color: '#10b981' }, // Emerald
    { id: 'rainbow', name: 'Rainbow', color: 'conic-gradient(at top left, #c7d2fe, #e9d5ff, #fbcfe8)' }, // Soft Rainbow Gradient
];

interface ThemePanelProps {
    currentTheme: ThemeId;
    onThemeChange: (theme: ThemeId) => void;
}

export const ThemePanel: React.FC<ThemePanelProps> = ({ currentTheme, onThemeChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 left-8 z-50 flex flex-col-reverse items-start gap-4">

            <div className="flex items-center gap-3">
                {/* Theme Toggle Button */}
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "p-3 rounded-full shadow-lg border transition-all duration-300 hover:scale-105 active:scale-95 group",
                            isOpen
                                ? "bg-zinc-900 text-white dark:bg-white dark:text-black border-zinc-900 dark:border-white"
                                : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-800"
                        )}
                        aria-label="Change Theme"
                    >
                        <Palette className={cn("w-5 h-5 transition-transform duration-500", isOpen && "rotate-90")} />
                    </button>

                    {/* Popover */}
                    <div className={cn(
                        "absolute bottom-full left-0 mb-4 p-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-3 transition-all duration-300 origin-bottom-left min-w-[200px]",
                        isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4 pointer-events-none"
                    )}>
                        <div className="flex items-center justify-between px-2 pt-1">
                            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Appearance</span>
                        </div>

                        <div className="p-2 bg-white/50 dark:bg-black/20 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                            <div className="grid grid-cols-5 gap-2">
                                {THEMES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => onThemeChange(t.id)}
                                        className="group relative w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none"
                                        title={t.name}
                                    >
                                        <div
                                            className={cn(
                                                "w-full h-full rounded-full shadow-sm ring-2 ring-offset-2 ring-offset-transparent transition-all duration-300",
                                                currentTheme === t.id
                                                    ? "ring-zinc-900 dark:ring-white scale-100"
                                                    : "ring-transparent hover:ring-zinc-300 dark:hover:ring-zinc-700 scale-90 opacity-80 hover:opacity-100"
                                            )}
                                            style={{ background: t.color }}
                                        />
                                        {currentTheme === t.id && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm ring-1 ring-black/10" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dark Mode Toggle */}
                <AnimatedThemeToggler className="p-3 bg-white dark:bg-zinc-900 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:scale-105 transition-transform active:scale-95" />
            </div>
        </div>
    );
};
