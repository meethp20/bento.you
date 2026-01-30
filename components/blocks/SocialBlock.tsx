"use client";

import React from 'react';
import { Block } from '@/core/types/block';
import { Github, Twitter, Linkedin, Youtube, Link as LinkIcon, Instagram } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

interface GitHubCalendarProps {
    username: string;
    transformData?: (data: any[]) => any[];
    blockSize?: number;
    blockMargin?: number;
    colorScheme?: string;
    fontSize?: number;
    hideColorLegend?: boolean;
    hideMonthLabels?: boolean;
    hideTotalCount?: boolean;
    theme?: {
        light: string[];
        dark: string[];
    };
}

const GitHubCalendar = dynamic<GitHubCalendarProps>(async () => {
    try {
        const mod = await import('react-github-calendar');
        // Handle Default Export or Named Export
        const Component = (mod as any).default || (mod as any).GitHubCalendar;
        if (Component) return Component;
        throw new Error("Component not found in module");
    } catch (e) {
        console.error("Failed to load GitHubCalendar", e);
        return () => <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">Calendar Unavailable</div>;
    }
}, {
    ssr: false,
    loading: () => <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
});


interface SocialBlockProps {
    block: Block;
}

const SocialBlock: React.FC<SocialBlockProps> = ({ block }) => {
    const { data, w, h } = block;

    const isRichCard = data.platform === 'linkedin' && !!data.iconUrl;
    const isGithub = data.platform === 'github';

    // Size helpers
    const isSmall = w === 1 && h === 1;
    const isWide = w >= 2 && h === 1;
    const isLarge = w >= 2 && h >= 2;

    // Extract GitHub username from URL
    const getGithubUsername = (url?: string) => {
        if (!url) return null;
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/').filter(Boolean);
            return pathParts[0]; // usually github.com/username
        } catch {
            return null;
        }
    }

    const githubUsername = isGithub ? getGithubUsername(data.url) : null;

    const selectLastNDays = (contributions: any[], days: number) => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - days);

        return contributions.filter((activity: any) => {
            const date = new Date(activity.date);
            return date >= startDate;
        });
    };

    const renderContent = () => {
        // GITHUB CONTRIBUTIONS CARD
        if (isGithub && githubUsername) {
            if (isSmall) {
                return (
                    <div className="w-full h-full flex items-center justify-center bg-[#0d1117]">
                        <Github className="w-8 h-8 text-white" />
                    </div>
                );
            }

            // Large (2x2+) - Only show calendar card here
            if (isLarge) {
                return (
                    <div className="w-full h-full flex flex-col p-5 justify-between overflow-hidden relative group bg-[#0d1117]">
                        {/* Background Glow */}
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-zinc-800/20 rotate-45 pointer-events-none group-hover:bg-zinc-800/40 transition-colors" />

                        <div className="flex items-center gap-3 mb-2 relative z-10">
                            <div className="p-2 bg-white/5 rounded-full border border-white/5">
                                <Github className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="font-bold text-base text-white block">@{githubUsername}</span>
                                <span className="text-xs text-zinc-500">Recent Contributions</span>
                            </div>
                        </div>

                        <div className="flex-1 w-full flex items-center justify-center relative z-10 opacity-90 group-hover:opacity-100 transition-opacity">
                            <GitHubCalendar
                                username={githubUsername}
                                transformData={(data: any[]) => selectLastNDays(data, 180)} // Last 6 months
                                blockSize={14}
                                blockMargin={4}
                                colorScheme="dark"
                                fontSize={14}
                                hideColorLegend
                                hideMonthLabels
                                hideTotalCount
                                theme={{
                                    light: ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af'],
                                    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                                }}
                            />
                        </div>
                    </div>
                )
            }

            // Fallthrough for Wide (will use generic renderer below)
        }


        // RICH LINKEDIN CARD
        if (isRichCard && isLarge) {
            return (
                <div className="w-full h-full flex flex-col relative group">
                    {/* Banner */}
                    <div className="h-1/3 w-full bg-[#0077b5] absolute top-0 left-0 transition-all group-hover:h-[40%]" />
                    <div className="absolute top-2 right-2 z-10">
                        <Linkedin className="w-5 h-5 text-white/90 drop-shadow-md" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center pt-8 px-4 pb-4 mt-4 relative z-0">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-[4px] border-white dark:border-zinc-900 shadow-sm bg-zinc-100 mb-3 group-hover:scale-110 transition-transform duration-300">
                            <Image
                                src={data.iconUrl!}
                                alt={data.title || "Profile"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="font-bold text-md text-zinc-900 dark:text-white truncate max-w-full">
                            {data.title || "User"}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium truncate max-w-full mb-auto">
                            Connect on LinkedIn
                        </span>

                        <div className="w-full py-2 rounded-xl bg-[#0077b5]/10 text-[#0077b5] border border-[#0077b5]/20 text-xs font-bold uppercase tracking-wider group-hover:bg-[#0077b5] group-hover:text-white transition-all text-center mt-2">
                            Connect
                        </div>
                    </div>
                </div>
            );
        }

        // INSTAGRAM CARD
        if (data.platform === 'instagram') {
            return (
                <div className={`w-full h-full flex flex-col items-center justify-center relative overflow-hidden group`}>
                    {/* Animated Background Mesh */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] opacity-100 transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center gap-2 transition-transform duration-300 group-hover:scale-105">
                        <Instagram className={`${isLarge ? "w-12 h-12" : "w-8 h-8"} text-white drop-shadow-lg`} />
                        {(isWide || isLarge) && (
                            <div className="text-center">
                                <span className="font-bold text-white text-lg drop-shadow-md block leading-tight">
                                    {data.title || "Instagram"}
                                </span>
                                {isLarge && <span className="text-xs text-white/90 font-medium mt-1 block opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">Visit Profile</span>}
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        // TWITTER / X CARD
        if (data.platform === 'twitter') {
            return (
                <div className={`w-full h-full flex flex-col items-center justify-center relative overflow-hidden group bg-black`}>
                    <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-800/50 transition-colors duration-300" />

                    <div className="relative z-10 flex flex-col items-center justify-center gap-3 transition-transform duration-300 group-hover:-translate-y-1">
                        <svg viewBox="0 0 24 24" className={`${isLarge ? "w-10 h-10" : "w-6 h-6"} fill-white`} aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        {(isWide || isLarge) && (
                            <div className="text-center">
                                <span className="font-bold text-white text-lg block">
                                    {data.title || "X"}
                                </span>
                                {isLarge && <span className="text-xs text-zinc-400 mt-1 block opacity-0 group-hover:opacity-100 transition-opacity duration-300">@username</span>}
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        // SPOTIFY CARD
        if (data.platform === 'spotify') {
            return (
                <div className={`w-full h-full flex flex-col items-center justify-center relative overflow-hidden group bg-[#1db954]`}>
                    {/* Dynamic pulse effect */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700 ease-out" />

                    <div className="relative z-10 flex flex-col items-center justify-center gap-2 transition-transform duration-300 group-hover:scale-105">
                        <svg viewBox="0 0 24 24" className={`${isLarge ? "w-12 h-12" : "w-8 h-8"} fill-white drop-shadow-md`} aria-hidden="true">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S16.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                        {(isWide || isLarge) && (
                            <div className="text-center">
                                <span className="font-bold text-white text-lg drop-shadow-sm block">
                                    {data.title || "Spotify"}
                                </span>
                                {isLarge && <div className="h-1 w-12 bg-white/40 rounded-full mx-auto mt-2 overflow-hidden">
                                    <div className="h-full bg-white w-2/3 animate-[shimmer_1.5s_infinite]" />
                                </div>}
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        // STANDARD ICONS
        let icon;
        // ... (Keep existing icon logic but simpler)
        if (data.iconUrl) {
            icon = (
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/20 p-0.5">
                    <Image
                        src={data.iconUrl}
                        alt={data.title || "Icon"}
                        width={32}
                        height={32}
                        className="object-contain"
                    />
                </div>
            );
        } else {
            const iconProps = { className: isSmall ? "w-8 h-8" : "w-6 h-6" };
            // Cast to any to avoid distinct union type issues during build if types are stale
            switch (data.platform as any) {
                case 'github': icon = <Github {...iconProps} />; break;
                // Icons for twitter/spotify/instagram handled in custom blocks above, 
                // but kept here for fallbacks or small icons if logic changes
                case 'twitter': icon = (
                    <svg viewBox="0 0 24 24" className={`${iconProps.className} fill-current`} aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                ); break;
                case 'linkedin': icon = <Linkedin {...iconProps} />; break;
                case 'youtube': icon = <Youtube {...iconProps} />; break;
                case 'instagram': icon = <Instagram {...iconProps} />; break;
                // ...
                default: icon = <LinkIcon {...iconProps} />;
            }
        }

        // Layout for small blocks (1x1) - Using simpler render for grid consistency
        if (isSmall) {
            return (
                <div className="flex items-center justify-center w-full h-full">
                    {icon}
                </div>
            )
        }

        // Layout for Wide/Large blocks (Generic)
        return (
            <div className={`flex items-center gap-3 ${isLarge ? 'flex-col justify-center text-center p-4' : 'px-4'}`}>
                {icon}
                <span className="font-semibold text-sm truncate max-w-full">
                    {data.title || data.platform || "Link"}
                </span>
                {isLarge && (
                    <span className="text-xs opacity-70 mt-1">Visit Website</span>
                )}
            </div>
        );
    };

    const getBgColor = () => {
        // Special case for GitHub to keep it dark/code-like
        if (isGithub) return 'bg-[#0d1117] text-white border border-white/10';

        if (isRichCard && isLarge) {
            return 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden';
        }

        // Generic/Fallback
        if (data.platform === 'generic' || !data.platform) {
            return 'bg-white text-black dark:bg-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 p-4';
        }

        if (data.platform === 'instagram' || data.platform === 'twitter' || data.platform === 'spotify') {
            return 'bg-transparent border-0 p-0 overflow-visible'; // Let the inner card handle everything
        }

        // Standard Social Colors (p-4 for padding)
        const baseClasses = "border border-transparent";
        switch (data.platform) {
            case 'linkedin': return `bg-[#0077b5] text-white ${baseClasses}`;
            case 'youtube': return `bg-[#ff0000] text-white ${baseClasses}`;
            default: return `bg-white text-black dark:bg-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 ${baseClasses}`;
        }
    };

    return (
        <Link
            href={data.url || '#'}
            target="_blank"
            className={`w-full h-full flex flex-col items-center justify-center gap-2 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${getBgColor()}`}
        >
            {renderContent()}
        </Link>
    );
}

export default SocialBlock;
