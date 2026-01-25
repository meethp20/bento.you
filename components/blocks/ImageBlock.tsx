import React from 'react';
import { Block } from '@/core/types/block';
import Image from 'next/image';

interface ImageBlockProps {
    block: Block;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block }) => {
    const { data } = block;

    return (
        <div className="relative w-full h-full rounded-3xl overflow-hidden group bg-black">
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
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            ) : (
                <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                    No Media
                </div>
            )}
            {data.title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white font-medium truncate">{data.title}</p>
                </div>
            )}
        </div>
    );
}

export default ImageBlock;
