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
    Plus
} from 'lucide-react';

interface BottomToolbarProps {
    onAddLink: (url: string) => void;
    onAddText?: (text: string, title: string) => void;
    onAddHeading?: (title: string) => void;
    isEditMode: boolean;
    onToggleEditMode: () => void;
    onTogglePreview?: () => void;
    isPreviewMode?: boolean;
}

const BottomToolbar: React.FC<BottomToolbarProps> = ({
    onAddLink,
    onAddText,
    onAddHeading,
    isEditMode,
    onToggleEditMode,
    onTogglePreview,
    isPreviewMode
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTool, setActiveTool] = useState<'link' | 'text' | 'heading' | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [inputTitle, setInputTitle] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleToolClick = (tool: 'link' | 'text' | 'heading') => {
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
            const objectUrl = URL.createObjectURL(file);
            onAddLink(objectUrl);
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
        }

        setActiveTool(null);
        setIsExpanded(false);
        setInputValue('');
        setInputTitle('');
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4 pointer-events-none">

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*"
            />

            {/* Input Popover - Minimalistic Pill */}
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
                    {activeTool === 'text' && (
                        <input
                            type="text"
                            placeholder="Title"
                            value={inputTitle}
                            onChange={(e) => setInputTitle(e.target.value)}
                            className="w-24 bg-transparent border-none outline-none text-sm font-semibold text-zinc-900 dark:text-white placeholder:text-zinc-400 shrink-0"
                        />
                    )}

                    {activeTool === 'text' && <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-1" />}

                    <input
                        type="text"
                        autoFocus={isExpanded}
                        placeholder={
                            activeTool === 'link' ? "Enter Link" :
                                activeTool === 'heading' ? "Heading" :
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


            {/* Main Toolbar Dock */}
            <div className="pointer-events-auto bg-white/90 dark:bg-zinc-900/90 shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/20 dark:border-zinc-800/50 rounded-full p-2 flex items-center gap-2 mx-auto backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/5">

                {/* Share Button */}
                <button className="bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-full text-sm font-bold shadow-sm transition-all hover:opacity-80 active:scale-95 flex items-center gap-2 mr-2">
                    Share
                </button>

                {/* Add Link */}
                <button
                    onClick={() => handleToolClick('link')}
                    className={`p-3 rounded-full transition-all group relative ${activeTool === 'link' ? 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                    title="Add Link"
                >
                    <LinkIcon className="w-5 h-5" />
                    {activeTool === 'link' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black dark:bg-white rounded-full" />}
                </button>

                {/* Add Image */}
                <button
                    onClick={handleImageClick}
                    className="p-3 rounded-full transition-all text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    title="Upload Image"
                >
                    <ImageIcon className="w-5 h-5" />
                </button>

                {/* Add Heading */}
                <button
                    onClick={() => handleToolClick('heading')}
                    className={`p-3 rounded-full transition-all group relative ${activeTool === 'heading' ? 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                    title="Add Heading"
                >
                    <HeadingIcon className="w-5 h-5" />
                    {activeTool === 'heading' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black dark:bg-white rounded-full" />}
                </button>

                {/* Add Text */}
                <button
                    onClick={() => handleToolClick('text')}
                    className={`p-3 rounded-full transition-all group relative ${activeTool === 'text' ? 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                    title="Add Text"
                >
                    <Type className="w-5 h-5" />
                    {activeTool === 'text' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black dark:bg-white rounded-full" />}
                </button>

                <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />

                {/* View/Edit Controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={onToggleEditMode}
                        className={`p-3 rounded-full transition-all ${isEditMode ? 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                    >
                        <Pen className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onTogglePreview}
                        className={`p-3 rounded-full transition-all ${isPreviewMode ? 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                    >
                        <Smartphone className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BottomToolbar;
