import React from 'react';
import { Block } from '@/types/block';
import { Github, Twitter, Linkedin, Youtube, Link as LinkIcon, Instagram, Music } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface SocialBlockProps {
    block: Block;
}

const SocialBlock: React.FC<SocialBlockProps> = ({ block }) => {
    const { data } = block;

    // If we have a custom iconUrl (favicon), use that
    const renderIcon = () => {
        if (data.iconUrl) {
            return (
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
        }

        switch (data.platform) {
            case 'github': return <Github className="w-8 h-8" />;
            case 'twitter': return (
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            );
            case 'linkedin': return <Linkedin className="w-8 h-8" />;
            case 'youtube': return <Youtube className="w-8 h-8" />;
            case 'instagram': return <Instagram className="w-8 h-8" />;
            case 'spotify': return (
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" aria-hidden="true">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S16.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
            );
            default: return <LinkIcon className="w-8 h-8" />;
        }
    };

    const getBgColor = () => {
        // If generic with favicon, keep it simple/white or dark but distinct
        if (data.platform === 'generic' || !data.platform) {
            return 'bg-white text-black dark:bg-zinc-800 dark:text-white border border-zinc-200 dark:border-zinc-700';
        }

        switch (data.platform) {
            case 'github': return 'bg-zinc-900 text-white';
            // X / Twitter - Sleek Dark Gradient
            case 'twitter': return 'bg-gradient-to-br from-zinc-700 via-zinc-900 to-black text-white border border-zinc-700/50';
            case 'linkedin': return 'bg-blue-700 text-white';
            case 'youtube': return 'bg-red-600 text-white';
            // Instagram - Brand Gradient
            case 'instagram': return 'bg-gradient-to-bl from-fuchsia-600 via-rose-500 to-amber-500 text-white';
            // Spotify - Vibrant Green Gradient
            case 'spotify': return 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white';
            default: return 'bg-white text-black dark:bg-zinc-800 dark:text-white border border-zinc-200 dark:border-zinc-700';
        }
    };

    return (
        <Link
            href={data.url || '#'}
            target="_blank"
            className={`w-full h-full flex flex-col items-center justify-center gap-2 p-4 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${getBgColor()}`}
        >
            {renderIcon()}
            <span className="font-semibold text-sm truncate max-w-full px-2">{data.title || data.platform || "Link"}</span>
        </Link>
    );
}

export default SocialBlock;