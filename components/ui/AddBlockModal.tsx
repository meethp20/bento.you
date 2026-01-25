import React, { useState } from 'react';
import { X } from 'lucide-react';
import { BlockType, BlockData } from '@/core/types/block';

interface AddBlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (type: BlockType, data: BlockData, w: number, h: number) => void;
}

const AddBlockModal: React.FC<AddBlockModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [selectedType, setSelectedType] = useState<BlockType>('social');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [platform, setPlatform] = useState('generic');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let data: BlockData = { title };
        let w = 1;
        let h = 1;

        if (selectedType === 'social') {
            data = { ...data, url, platform: platform as any };
        } else if (selectedType === 'image') {
            w = 2;
            h = 2;
            // Naive check for video extension, otherwise image
            if (url.match(/\.(mp4|webm|ogg)$/)) {
                data = { ...data, videoUrl: url };
            } else {
                data = { ...data, imageUrl: url };
            }
        }

        onAdd(selectedType, data, w, h);
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setUrl('');
        setPlatform('generic');
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold dark:text-white">Add New Block</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <X className="w-5 h-5 dark:text-zinc-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-zinc-300">Block Type</label>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setSelectedType('social')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${selectedType === 'social' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                                Social
                            </button>
                            <button type="button" onClick={() => setSelectedType('image')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${selectedType === 'image' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                                Media
                            </button>
                        </div>
                    </div>

                    {selectedType === 'social' && (
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-zinc-300">Platform</label>
                            <select
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
                            >
                                <option value="generic">Website / Link</option>
                                <option value="instagram">Instagram</option>
                                <option value="twitter">X / Twitter</option>
                                <option value="spotify">Spotify</option>
                                <option value="github">GitHub</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="youtube">YouTube</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-zinc-300">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
                            placeholder="e.g. My Profile"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-zinc-300">
                            {selectedType === 'image' ? 'Image/Video URL' : 'Link URL'}
                        </label>
                        <input
                            type="url"
                            required
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
                            placeholder="https://..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Add Block
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddBlockModal;
