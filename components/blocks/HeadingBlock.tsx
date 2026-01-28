import React from 'react';
import { Block } from '@/core/types/block';

interface HeadingBlockProps {
    block: Block;
}

const HeadingBlock: React.FC<HeadingBlockProps> = ({ block }) => {
    const { data } = block;

    return (
        <div className="w-full h-full p-4 flex items-center justify-center text-center bg-white dark:bg-black rounded-3xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-300">
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                {data.title}
            </h2>
        </div>
    );
}

export default HeadingBlock;
