import React from 'react';
import { Block } from '@/core/types/block';


interface TextBlockProps {
    block: Block;
}

const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
    const { data } = block;

    return (
        <div className="w-full h-full p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800/20 dark:to-zinc-900 rounded-bl-[4rem] -mr-8 -mt-8 opacity-50 pointer-events-none" />

            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight relative z-10">
                {data.title}
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed font-medium relative z-10">
                {data.text}
            </p>
        </div>
    );
}

export default TextBlock;
