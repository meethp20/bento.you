import React, { useState, useRef } from 'react';
import {
    Link as LinkIcon,
    Image as ImageIcon,
    Type,
    Heading as HeadingIcon,
    Share2,
    Pen,
    X,
    Monitor,
    Smartphone,
    Layout,
    Plus,
    Check,
    Quote
} from 'lucide-react';
import { ShareModal } from './ShareModal';

interface BottomToolbarProps {
    onUpload?: (file: File) => void; // New prop for handling file uploads
    onAddLink: (url: string) => void;
    onAddText?: (text: string, title: string) => void;
    onAddHeading?: (title: string) => void;
    onAddQuote?: (text: string, author: string) => void;
    isEditMode: boolean;
    onToggleEditMode: () => void;
    onTogglePreview?: () => void;
    isPreviewMode?: boolean;
    // User info for sharing
    userInfo?: {
        username: string;
        avatar?: string;
        bio?: string;
    };
    isMobileDevice?: boolean;
}

const BottomToolbar: React.FC<BottomToolbarProps> = ({
    onUpload, // Destructure new prop
    onAddLink,
    onAddText,
    onAddHeading,
    onAddQuote,
    isEditMode,
    onToggleEditMode,
    onTogglePreview,
    isPreviewMode,
    userInfo,
    isMobileDevice = false
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTool, setActiveTool] = useState<'link' | 'text' | 'heading' | 'quote' | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [inputTitle, setInputTitle] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Settings States
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('/meeth');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleToolClick = (tool: 'link' | 'text' | 'heading' | 'quote') => {
        if (activeTool === tool) {
            setActiveTool(null);
            setIsExpanded(false);
        } else {
            setActiveTool(tool);
            setIsExpanded(true);
            setInputValue('');
            setInputTitle('');
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (onUpload) {
                onUpload(file);
            } else {
                // Fallback for safe compatibility (or remove if strictly enforced)
                const objectUrl = URL.createObjectURL(file);
                onAddLink(objectUrl);
            }
            e.target.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTool === 'link' && inputValue) {
            onAddLink(inputValue);
        } else if (activeTool === 'text' && onAddText && inputValue) {
            onAddText(inputValue, inputTitle || 'Note');
        } else if (activeTool === 'heading' && onAddHeading && inputValue) {
            onAddHeading(inputValue);
        } else if (activeTool === 'quote' && onAddQuote && inputValue) {
            onAddQuote(inputValue, inputTitle || 'Anonymous');
        }

        setActiveTool(null);
        setIsExpanded(false);
        setInputValue('');
        setInputTitle('');
    };

    return (
        <>
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                username={userInfo?.username || 'user'}
                avatar={userInfo?.avatar}
                bio={userInfo?.bio}
            />

            <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center items-end px-4 pointer-events-none gap-4">

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,video/*"
                />

                {/* Input Popover */}
                <div className={`
                    pointer-events-auto 
                    absolute bottom-24 left-1/2 -translate-x-1/2 
                    origin-bottom transition-all duration-300 ease-out z-50
                    ${isExpanded ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
                `}>
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1.5 pl-4 rounded-full shadow-2xl border border-zinc-200 dark:border-zinc-800 min-w-[320px]"
                    >
                        {(activeTool === 'text' || activeTool === 'quote') && (
                            <input
                                type="text"
                                placeholder={activeTool === 'quote' ? "Author" : "Title"}
                                value={inputTitle}
                                onChange={(e) => setInputTitle(e.target.value)}
                                className="w-24 bg-transparent border-none outline-none text-sm font-semibold text-zinc-900 dark:text-white placeholder:text-zinc-400 shrink-0"
                            />
                        )}

                        {(activeTool === 'text' || activeTool === 'quote') && <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-1" />}

                        <input
                            type="text"
                            autoFocus={isExpanded}
                            placeholder={
                                activeTool === 'link' ? "Enter Link" :
                                    activeTool === 'heading' ? "Heading" :
                                        activeTool === 'quote' ? "Quote" :
                                            "Content"
                            }
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 min-w-0"
                        />

                        {inputValue.trim() === '' ? (
                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        const text = await navigator.clipboard.readText();
                                        setInputValue(text);
                                    } catch (err) {
                                        console.error('Failed to read clipboard', err);
                                    }
                                }}
                                className="px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                            >
                                Paste
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="p-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        )}
                    </form>
                </div>


                {/* Settings Menu (Fixed Bottom Left) */}
                {/* Settings Menu Removed */}

                {/* Main Toolbar Dock */}
                <div className="pointer-events-auto bg-white/90 dark:bg-zinc-900/90 shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/20 dark:border-zinc-800/50 rounded-full p-1.5 flex items-center gap-1 backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/5">

                    {/* Share Button */}
                    <button
                        onClick={() => setIsShareModalOpen(true)}
                        className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-xs font-bold shadow-sm transition-all hover:opacity-80 active:scale-95 flex items-center gap-2 mr-1"
                    >
                        <Share2 className="w-3 h-3" />
                        <span id="share-btn-text">Share</span>
                    </button>

                    {/* Add Link */}
                    <button
                        onClick={() => handleToolClick('link')}
                        className={`p-2 rounded-full transition-all group relative ${activeTool === 'link' ? 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                        title="Add Link"
                    >
                        <LinkIcon className="w-4 h-4" />
                        {activeTool === 'link' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black dark:bg-white rounded-full" />}
                    </button>

                    {/* Add Image */}
                    <button
                        onClick={handleImageClick}
                        className="p-2 rounded-full transition-all text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        title="Upload Image"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </button>

                    {/* Add Quote */}
                    <button
                        onClick={() => handleToolClick('quote')}
                        className={`p-2 rounded-full transition-all group relative ${activeTool === 'quote' ? 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                        title="Add Quote"
                    >
                        <Quote className="w-4 h-4" />
                        {activeTool === 'quote' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black dark:bg-white rounded-full" />}
                    </button>

                    {/* Add Heading */}
                    <button
                        onClick={() => handleToolClick('heading')}
                        className={`p-2 rounded-full transition-all group relative ${activeTool === 'heading' ? 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                        title="Add Heading"
                    >
                        <HeadingIcon className="w-4 h-4" />
                        {activeTool === 'heading' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black dark:bg-white rounded-full" />}
                    </button>

                    {/* Add Text */}
                    <button
                        onClick={() => handleToolClick('text')}
                        className={`p-2 rounded-full transition-all group relative ${activeTool === 'text' ? 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                        title="Add Text"
                    >
                        <Type className="w-4 h-4" />
                        {activeTool === 'text' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black dark:bg-white rounded-full" />}
                    </button>

                    <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

                    {/* View/Edit Controls */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onToggleEditMode}
                            className={`p-2 rounded-full transition-all ${isEditMode ? 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                        >
                            <Pen className="w-4 h-4" />
                        </button>
                        {!isMobileDevice && (
                            <button
                                onClick={onTogglePreview}
                                className={`p-2 rounded-full transition-all ${isPreviewMode ? 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                            >
                                <Smartphone className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BottomToolbar;
