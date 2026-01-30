import React, { useState, useEffect } from 'react';
import { X, Check, Copy, Twitter, Linkedin, MessageCircle } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
    avatar?: string;
    bio?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, username, avatar, bio }) => {
    const [copied, setCopied] = useState(false);
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUrl(window.location.href);
        }
    }, []);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    const shareData = {
        title: `Check out ${username}'s Bento`,
        text: bio || `Check out ${username}'s Bento page!`,
        url: url
    };

    const handleShare = (platform: 'twitter' | 'linkedin' | 'whatsapp') => {
        let shareUrl = '';
        const text = encodeURIComponent(shareData.text);
        const link = encodeURIComponent(shareData.url);

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${link}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${link}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${text}%20${link}`;
                break;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl ring-1 ring-zinc-900/5 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 flex flex-col gap-6">

                {/* Header */}
                <div className="flex items-center justify-center relative">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Share Profile</h3>
                    <button
                        onClick={onClose}
                        className="absolute right-0 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Preview Card */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 flex flex-col items-center justify-center text-center text-white shadow-lg group">

                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                    <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className="w-20 h-20 rounded-full bg-white p-1 shadow-xl">
                            <img
                                src={avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"}
                                alt={username}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="font-bold text-xl drop-shadow-md">@{username}</h4>
                            <p className="text-sm text-white/90 font-medium drop-shadow-sm max-w-[200px] truncate">
                                {bio || "Designer & Developer"}
                            </p>
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                            Bento
                        </span>
                    </div>
                </div>

                {/* Main Copy Link Action */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                        <div className="flex-1 min-w-0 px-2">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate font-mono">
                                {url.replace('https://', '')}
                            </p>
                        </div>
                        <button
                            onClick={handleCopy}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copied
                                    ? 'bg-green-500 text-white shadow-md'
                                    : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
                                }`}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                {/* Social Share Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => handleShare('twitter')}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                    >
                        <div className="p-2 bg-black text-white rounded-full group-hover:scale-110 transition-transform">
                            <Twitter className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">Twitter</span>
                    </button>

                    <button
                        onClick={() => handleShare('whatsapp')}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                    >
                        <div className="p-2 bg-[#25D366] text-white rounded-full group-hover:scale-110 transition-transform">
                            <MessageCircle className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">WhatsApp</span>
                    </button>

                    <button
                        onClick={() => handleShare('linkedin')}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                    >
                        <div className="p-2 bg-[#0077b5] text-white rounded-full group-hover:scale-110 transition-transform">
                            <Linkedin className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">LinkedIn</span>
                    </button>
                </div>

            </div>
        </div>
    );
};
