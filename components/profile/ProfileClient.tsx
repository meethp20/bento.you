"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Container from "@/components/layout/Container";
import BottomToolbar from "@/components/ui/BottomToolbar";
import { Block, BlockData, BlockType } from "@/core/types/block";
import { ThemePanel, ThemeId } from "@/components/ui/ThemePanel";
import DynamicBackground from "@/components/layout/DynamicBackground";
import { InlineTextEdit } from "@/components/ui/InlineTextEdit";
import { motion } from "framer-motion";

interface ProfileClientProps {
    user: {
        username: string;
        bio: string;
        avatar: string;
        blocks: Block[];
        theme: string;
    };

    isOwner?: boolean; // If true, enable editing features
}

export default function ProfileClient({ user, isOwner = false }: ProfileClientProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [currentTheme, setCurrentTheme] = useState<ThemeId>((user.theme as ThemeId) || 'tokyo-night');
    const [isSaving, setIsSaving] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Profile Data State
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio);
    const [avatar, setAvatar] = useState(user.avatar);

    // Initialize state from props
    const [blocks, setBlocks] = useState<Block[]>(user.blocks || []);
    const initialLoad = useRef(true);

    const handleTogglePreview = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setIsPreviewMode(prev => !prev);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 300);
        }, 100);
    };

    // Auto-save function
    const saveProfile = useCallback(async (data: { blocks?: Block[], theme?: string, username?: string, bio?: string, avatar?: string }) => {
        if (!isOwner) return;

        setIsSaving(true);
        try {
            await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error("Failed to save profile", error);
        } finally {
            setIsSaving(false);
        }
    }, [isOwner]);

    // Debounced auto-save for blocks and theme
    useEffect(() => {
        if (initialLoad.current) {
            initialLoad.current = false;
            return;
        }

        const timer = setTimeout(() => {
            saveProfile({
                blocks,
                theme: currentTheme,
                username,
                bio,
                avatar
            });
        }, 1000); // 1-second debounce

        return () => clearTimeout(timer);
    }, [blocks, currentTheme, username, bio, avatar, saveProfile]);


    // Handle theme updates
    const handleThemeChange = (newTheme: ThemeId) => {
        setCurrentTheme(newTheme);
    };

    const detectBlockFromUrl = (url: string): { type: BlockType; data: BlockData; w: number; h: number } => {
        const lowerUrl = url.toLowerCase();
        let type: BlockType = 'social';

        let hostname = 'Link';
        try {
            const u = new URL(url);
            hostname = u.hostname;
        } catch (e) {
            // gracefully handle invalid URLs (like 'https://' incomplete ones)
            if (url === 'https://') hostname = 'New Link';
        }

        let data: BlockData = { url, title: hostname || 'Link' };
        let w = 1;
        let h = 1;

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
        } else if (lowerUrl.includes('cal.com')) {
            type = 'cal';
            data.platform = 'cal';
            data.title = 'Book a Call';
            w = 2; h = 2;
        } else if (lowerUrl.includes('youtube.com/watch') || lowerUrl.includes('youtu.be')) {
            type = 'youtube';
            data.platform = 'youtube';
            data.title = 'YouTube Video';
            w = 2; h = 2;
        } else if (lowerUrl.includes('youtube.com')) {
            type = 'youtube';
            data.platform = 'youtube';
            data.title = 'YouTube';
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
            // Try to extract hostname again if parsing succeeded
            try {
                const u = new URL(url);
                data.platform = 'generic';
                data.iconUrl = `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
                data.title = u.hostname;
            } catch {
                data.platform = 'generic';
                data.title = 'Link';
            }
        }

        return { type, data, w, h };
    };

    const handleAddLink = (url: string) => {
        try {
            if (!url.startsWith('blob:') && !url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }

            const { type, data, w, h } = detectBlockFromUrl(url);
            const maxY = blocks.reduce((max, b) => Math.max(max, (b.y || 0) + b.h), 0);

            const newBlock: Block = {
                id: `block-${Date.now()}`,
                type,
                w,
                h,
                x: 0,
                y: maxY,
                data,
                // Initialize layouts
                layouts: {
                    desktop: { x: 0, y: maxY, w, h },
                    mobile: { x: 0, y: maxY, w: Math.min(w, 2), h }
                }
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

    // Upload Helper
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'block') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsSaving(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.url) {
                if (type === 'avatar') {
                    // Delete old avatar if it exists and isn't a default or external one
                    if (avatar && !avatar.includes('unsplash.com') && !avatar.includes('clerk.com') && !avatar.includes('googleusercontent.com')) {
                        fetch('/api/upload/delete', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ url: avatar })
                        }).catch(err => console.warn("Failed to delete old avatar", err));
                    }
                    setAvatar(data.url);
                } else {
                    handleAddLink(data.url);
                }
            }
        } catch (error) {
            console.error("Upload failed", error);
            // Optionally show error toast
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-transparent transition-colors duration-500">
            <DynamicBackground theme={currentTheme} />

            <div className={`w-full py-12 px-4 sm:px-6 lg:px-8 pb-32 ${isPreviewMode ? 'h-screen flex items-center justify-center overflow-hidden fixed inset-0 z-40' : ''}`}>
                <div className="relative z-10 font-[family-name:var(--font-sans)] w-full">

                    {/* Status Indicator */}
                    {isOwner && (
                        <div className={`fixed bottom-4 right-4 z-50 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium transition-opacity duration-300 ${isSaving ? 'opacity-100' : 'opacity-0'}`}>
                            {isSaving ? 'Saving...' : 'Saved'}
                        </div>
                    )}

                    {/* Main Container with Shared Layout Animation */}
                    <div
                        className={`mx-auto transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isPreviewMode
                            ? 'w-[400px] h-[800px] overflow-hidden bg-white/50 dark:bg-zinc-950/50 rounded-3xl ring-1 ring-zinc-900/5 backdrop-blur-sm'
                            : 'max-w-7xl'
                            }`}
                    >

                        <div
                            className={`w-full ${isPreviewMode
                                ? 'h-full overflow-y-auto scrollbar-hide pt-16 px-6 pb-8'
                                : 'lg:flex lg:flex-row lg:items-start lg:gap-16 lg:px-4'
                                } transition-all duration-300 ${isTransitioning ? 'blur-md opacity-0 scale-95' : 'blur-0 opacity-100 scale-100'}`}
                        >

                            <motion.div
                                layout="position"
                                className={`mb-12 ${isPreviewMode ? 'origin-top' : 'lg:w-[350px] lg:shrink-0 lg:sticky lg:top-24 lg:mb-0'}`}
                            >
                                <div className={`flex flex-col items-center justify-center text-center gap-6 ${!isPreviewMode ? 'lg:items-start lg:text-left' : ''}`}>
                                    <div className="relative group/avatar">
                                        <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden ring-4 ring-white dark:ring-zinc-800 shadow-2xl relative bg-zinc-100">
                                            <img
                                                src={avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"}
                                                alt={username}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {isOwner && isEditMode && (
                                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer rounded-full">
                                                <span className="text-white text-xs font-bold">Change</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                                            </label>
                                        )}
                                    </div>

                                    <div className={`flex flex-col items-center ${!isPreviewMode ? 'lg:items-start' : ''}`}>
                                        <InlineTextEdit
                                            initialValue={username}
                                            onSave={setUsername}
                                            isEditable={isOwner}
                                            as="h1"
                                            className={`font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 capitalize ${isPreviewMode ? 'text-3xl' : 'text-5xl lg:text-6xl'}`}
                                        />

                                        <InlineTextEdit
                                            initialValue={bio}
                                            onSave={setBio}
                                            isEditable={isOwner}
                                            multiline
                                            as="p"
                                            className={`text-zinc-500 dark:text-zinc-400 font-medium ${isPreviewMode ? 'text-center text-sm max-w-[250px]' : 'text-center lg:text-left text-xl max-w-lg'}`}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            <div className={`${!isPreviewMode ? 'lg:flex-1 w-full min-w-0' : 'w-full'}`}>
                                <Container
                                    blocks={blocks}
                                    isEditMode={isEditMode}
                                    onDeleteBlock={handleDeleteBlock}
                                    onLayoutChange={handleLayoutChange}
                                />
                            </div>



                        </div>
                    </div>

                    {/* Only show toolbar if owner (editing allowed) */}
                    {isOwner && (
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
                                    },
                                    layouts: {
                                        desktop: { x: 0, y: maxY, w: 2, h: 1 },
                                        mobile: { x: 0, y: maxY, w: 2, h: 1 }
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
                                    },
                                    layouts: {
                                        desktop: { x: 0, y: maxY, w: 2, h: 0.5 },
                                        mobile: { x: 0, y: maxY, w: 2, h: 0.5 }
                                    }
                                };
                                setBlocks(prev => [...prev, newBlock]);
                            }}
                            onAddQuote={(text, author) => {
                                const maxY = blocks.reduce((max, b) => Math.max(max, (b.y || 0) + b.h), 0);
                                const newBlock: Block = {
                                    id: `quote-${Date.now()}`,
                                    type: 'quote',
                                    w: 2,
                                    h: 2,
                                    x: 0,
                                    y: maxY,
                                    data: {
                                        text: text || 'This is a quote.',
                                        title: author || 'Author'
                                    },
                                    layouts: {
                                        desktop: { x: 0, y: maxY, w: 2, h: 2 },
                                        mobile: { x: 0, y: maxY, w: 2, h: 2 }
                                    }
                                };
                                setBlocks(prev => [...prev, newBlock]);
                            }}
                            isEditMode={isEditMode}
                            onToggleEditMode={() => setIsEditMode(!isEditMode)}
                            onTogglePreview={handleTogglePreview}
                            isPreviewMode={isPreviewMode}
                        />
                    )}

                    {/* Only show theme panel if owner and in edit mode */}
                    {isOwner && isEditMode && (
                        <ThemePanel currentTheme={currentTheme} onThemeChange={handleThemeChange} />
                    )}
                </div>
            </div>
        </div>
    );
}
