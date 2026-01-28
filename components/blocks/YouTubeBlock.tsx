import React from 'react';
import { Block } from '@/core/types/block';
import { Youtube } from 'lucide-react';
import Link from 'next/link';

interface YouTubeBlockProps {
    block: Block;
}

const YouTubeBlock: React.FC<YouTubeBlockProps> = ({ block }) => {
    const { data } = block;

    // Extract video ID if possible
    const getVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = data.url ? getVideoId(data.url) : null;

    if (videoId) {
        return (
            <div className="w-full h-full rounded-3xl overflow-hidden bg-black relative group">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={data.title || "YouTube video player"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full pointer-events-auto"
                />

                {/* Drag Overlay - ensures the card is draggable in edit mode without getting stuck in iframe */}
                <div className="absolute inset-0 z-10 bg-transparent group-hover:bg-black/10 transition-colors pointer-events-none" />
            </div>
        );
    }

    // Fallback for channel links
    return (
        <Link
            href={data.url || '#'}
            target="_blank"
            className="w-full h-full flex flex-col items-center justify-center gap-3 p-4 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-red-600 text-white"
        >
            <Youtube className="w-10 h-10" />
            <div className="text-center">
                <span className="font-bold text-lg block">{data.title || "YouTube"}</span>
                <span className="text-red-100 text-sm">Subscribe</span>
            </div>
        </Link>
    );
};

export default YouTubeBlock;
