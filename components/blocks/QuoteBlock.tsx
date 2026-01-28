
import React from 'react';
import { Block } from '@/core/types/block';
import { Quote } from 'lucide-react';

interface QuoteBlockProps {
    block: Block;
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ block }) => {
    const { data } = block;

    return (
        <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
            <div>
                <Quote className="w-8 h-8 text-zinc-900 dark:text-white mb-4 fill-current" />
                <p className="text-xl md:text-2xl font-serif font-medium leading-tight text-zinc-900 dark:text-white line-clamp-3">
                    "{data.text || "The details are not the details. They make the design."}"
                </p>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0" />
                <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{data.title || "Author Name"}</p>
                    <p className="text-xs text-zinc-500 truncate">Role / Title</p>
                </div>
            </div>
        </div>
    );
};

export default QuoteBlock;
