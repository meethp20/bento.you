"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Container from "@/components/layout/Container";
import BottomToolbar from "@/components/ui/BottomToolbar";
import { Block, BlockData, BlockType } from "@/core/types/block";

export default function UserBento() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params?.slug as string;
    const bio = searchParams.get('bio') || "A curation of my work, socials, and life.";
    const avatar = searchParams.get('avatar');

    const [isEditMode, setIsEditMode] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const [blocks, setBlocks] = useState<Block[]>([
        {
            id: "profile",
            type: "image",
            w: 2,
            h: 2,
            x: 0,
            y: 0,
            data: {
                title: slug || "User",
                imageUrl: avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
            },
        },
        {
            id: "bio",
            type: "text",
            w: 2,
            h: 1,
            x: 2,
            y: 0,
            data: {
                title: `Hi, I'm ${slug}`,
                text: bio,
            },
        },

        {
            id: "twitter",
            type: "social",
            w: 1,
            h: 1,
            x: 2,
            y: 1,
            data: {
                platform: "twitter",
                url: "https://twitter.com",
            },
        },
        {
            id: "github",
            type: "social",
            w: 1,
            h: 1,
            x: 3,
            y: 1,
            data: {
                platform: "github",
                url: "https://github.com",
            },
        }
    ]);

    const detectBlockFromUrl = (url: string): { type: BlockType; data: BlockData; w: number; h: number } => {
        const lowerUrl = url.toLowerCase();
        let type: BlockType = 'social';
        let data: BlockData = { url, title: new URL(url).hostname };
        let w = 1;
        let h = 1;

        // Check for blob URLs (uploaded images)
        if (lowerUrl.startsWith('blob:')) {
            type = 'image';
            data = { ...data, imageUrl: url, title: 'Uploaded Image' };
            w = 2; h = 2;
            return { type, data, w, h };
        }

        if (lowerUrl.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/)) {
            type = 'image';
            data = { ...data, imageUrl: url, title: 'Image' };
            w = 2; h = 2;
        } else if (lowerUrl.match(/\.(mp4|webm|ogg)($|\?)/)) {
            type = 'image';
            data = { ...data, videoUrl: url, title: 'Video' };
            w = 2; h = 2;
        } else if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
            data.platform = 'twitter';
            data.title = 'X / Twitter';
        } else if (lowerUrl.includes('github.com')) {
            data.platform = 'github';
            data.title = 'GitHub';
        } else if (lowerUrl.includes('linkedin.com')) {
            data.platform = 'linkedin';
            data.title = 'LinkedIn';
        } else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
            data.platform = 'youtube';
            data.title = 'YouTube';
        } else if (lowerUrl.includes('spotify.com')) {
            data.platform = 'spotify';
            data.title = 'Spotify';
        } else if (lowerUrl.includes('instagram.com')) {
            data.platform = 'instagram';
            data.title = 'Instagram';
        } else {
            // Generic link with favicon
            data.platform = 'generic';
            // Try to get favicon
            data.iconUrl = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`;
            data.title = new URL(url).hostname;
        }

        return { type, data, w, h };
    };

    const handleAddLink = (url: string) => {
        try {
            // Ensure URL has protocol if not blob
            if (!url.startsWith('blob:') && !url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }

            const { type, data, w, h } = detectBlockFromUrl(url);

            // Find first available spot (naive approach: put at end)
            // React Grid Layout handles positioning automatically if x/y are Infinity/null usually,
            // but let's give it a position below everything else.
            const maxY = blocks.reduce((max, b) => Math.max(max, (b.y || 0) + b.h), 0);

            const newBlock: Block = {
                id: `block-${Date.now()}`,
                type,
                w,
                h,
                x: 0,
                y: maxY, // Place at the bottom
                data
            };

            setBlocks(prev => [...prev, newBlock]);
        } catch (e) {
            console.error("Invalid URL", e);
        }
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks(prev => prev.filter(block => block.id !== id));
    }

    const handleLayoutChange = (newBlocks: Block[]) => {
        setBlocks(newBlocks);
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 pb-32 transition-colors duration-500">

            {/* Mobile Preview Wrapper */}
            <div className={`mx-auto transition-all duration-500 ease-in-out ${isPreviewMode ? 'max-w-[375px] bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl p-6 min-h-[800px]' : 'max-w-7xl'}`}>

                {/* Dynamic Header */}
                <div className={`mb-12 transition-all duration-500 ${isPreviewMode ? 'pt-8 scale-90' : ''}`}>
                    <div className="flex items-center gap-6 justify-center text-left">
                        <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden ring-4 ring-white dark:ring-zinc-800 shadow-2xl relative">
                            <img
                                src={avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"}
                                alt={slug}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div>
                            <h1 className={`font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 capitalize transition-all duration-300 ${isPreviewMode ? 'text-2xl' : 'text-4xl sm:text-5xl'}`}>
                                {slug}
                            </h1>
                            <p className={`text-zinc-500 dark:text-zinc-400 font-medium transition-all duration-300 ${isPreviewMode ? 'text-sm max-w-[200px]' : 'text-lg max-w-md'}`}>
                                {bio}
                            </p>
                        </div>
                    </div>
                </div>

                <Container
                    blocks={blocks}
                    isEditMode={isEditMode}
                    onDeleteBlock={handleDeleteBlock}
                    onLayoutChange={handleLayoutChange}
                />
            </div>

            <BottomToolbar
                onAddLink={handleAddLink}
                onAddText={(text, title) => {
                    const maxY = blocks.reduce((max, b) => Math.max(max, (b.y || 0) + b.h), 0);
                    const newBlock: Block = {
                        id: `text-${Date.now()}`,
                        type: 'text',
                        w: 2,
                        h: 1,
                        x: 0,
                        y: maxY,
                        data: {
                            title: title || 'New Text',
                            text: text || 'Description goes here...'
                        }
                    };
                    setBlocks(prev => [...prev, newBlock]);
                }}
                onAddHeading={(title) => {
                    const maxY = blocks.reduce((max, b) => Math.max(max, (b.y || 0) + b.h), 0);
                    const newBlock: Block = {
                        id: `heading-${Date.now()}`,
                        type: 'heading',
                        w: 2,
                        h: 0.5,
                        x: 0,
                        y: maxY,
                        data: {
                            title: title || 'New Heading'
                        }
                    };
                    setBlocks(prev => [...prev, newBlock]);
                }}
                isEditMode={isEditMode}
                onToggleEditMode={() => setIsEditMode(!isEditMode)}
                onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
                isPreviewMode={isPreviewMode}
            />
        </div>
    );
}
