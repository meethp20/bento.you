import React from 'react';
import { Block } from '@/types/block';

interface TextBlockProps {
    block: Block;
}

const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
    const { data } = block;

    return (
        <div className="w-full h-full p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 leading-tight">
                {data.title}
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm leading-relaxed">
                {data.text}
            </p>
        </div>
    );
}

export default TextBlock;
