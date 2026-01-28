import React from 'react';
import { Block } from '@/core/types/block';
import { Calendar, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface CalBlockProps {
    block: Block;
}

const CalBlock: React.FC<CalBlockProps> = ({ block }) => {
    const { data } = block;

    return (
        <Link
            href={data.url || '#'}
            target="_blank"
            className="w-full h-full flex flex-col justify-between p-5 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white group"
        >
            <div className="flex justify-between items-start">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-full">
                    <Calendar className="w-6 h-6 text-zinc-900 dark:text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>

            <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1 block">Book a Call</span>
                <span className="font-bold text-xl leading-tight block">{data.title || "Let's meet"}</span>
            </div>

            {/* Cal.com Brand Strip */}
            <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="font-black text-6xl tracking-tighter">cal</span>
            </div>
        </Link>
    );
};

export default CalBlock;
