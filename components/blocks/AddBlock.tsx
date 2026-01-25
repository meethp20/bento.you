import React from 'react';
import { Plus } from 'lucide-react';

interface AddBlockProps {
    onClick: () => void;
}

const AddBlock: React.FC<AddBlockProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors group cursor-pointer"
        >
            <div className="w-12 h-12 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
            </div>
        </button>
    );
}

export default AddBlock;
