import React from 'react';
import { Block } from '@/types/block';
import { MapPin } from 'lucide-react';

interface MapBlockProps {
    block: Block;
}

const MapBlock: React.FC<MapBlockProps> = ({ block }) => {
    const { data } = block;

    return (
        <div className="relative w-full h-full rounded-3xl overflow-hidden bg-blue-50 dark:bg-zinc-900 group">
            {/* Abstract Map Design */}
            <div className="absolute inset-0 opacity-20 dark:opacity-10 ">
                <div className="absolute top-1/4 left-0 w-full h-2 bg-blue-300 transform -rotate-12"></div>
                <div className="absolute top-2/4 left-0 w-full h-2 bg-blue-300 transform rotate-6"></div>
                <div className="absolute top-1/3 left-1/3 w-2 h-full bg-blue-300"></div>
                <div className="absolute top-0 right-1/4 w-2 h-full bg-blue-300"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10 flex-col gap-2">
                <div className="w-12 h-12 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:-translate-y-2 duration-300">
                    <MapPin className="text-red-500 w-6 h-6" />
                </div>
                {data.location && (
                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold shadow-sm text-zinc-800 dark:text-zinc-200">
                        {data.location}
                    </span>
                )}
            </div>
        </div>
    );
}

export default MapBlock;
