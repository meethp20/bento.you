import React from 'react';
import { Block } from '@/core/types/block';
import Image from 'next/image';

interface ImageBlockProps {
    block: Block;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block }) => {
    const { data } = block;

    return (
        <div className="relative w-full h-full rounded-3xl overflow-hidden group bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            {data.videoUrl ? (
                <video
                    src={data.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : data.imageUrl ? (
                <Image
                    src={data.imageUrl}
                    alt={data.title || "Image block"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 relative">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <span className="text-sm font-medium opacity-60">No Media</span>
                </div>
            )}

            {/* Gradient Overlay for Text Visibility */}
            {data.title && (data.imageUrl || data.videoUrl) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
            )}

            {data.title && (
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className={`font-bold text-lg truncate ${data.imageUrl || data.videoUrl ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
                        {data.title}
                    </p>
                </div>
            )}
        </div>
    );
}

export default ImageBlock;
