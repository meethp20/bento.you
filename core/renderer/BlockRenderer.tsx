import React from 'react';
import { Block } from '@/types/block';
import SocialBlock from '@/components/blocks/SocialBlock';
import ImageBlock from '@/components/blocks/ImageBlock';
import TextBlock from '@/components/blocks/TextBlock';
import HeadingBlock from '@/components/blocks/HeadingBlock';
import MapBlock from '@/components/blocks/MapBlock';
interface BlockRendererProps {
    block: Block;
    onAddClick?: () => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onAddClick }) => {
    switch (block.type) {
        case 'social':
            return <SocialBlock block={block} />;
        case 'image':
            return <ImageBlock block={block} />;
        case 'text':
            return <TextBlock block={block} />;
        case 'heading':
            return <HeadingBlock block={block} />;
        case 'map':
            return <MapBlock block={block} />;

        default:
            return (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
                    Unknown Block
                </div>
            );
    }
}

// Memoize to prevent re-renders when parent layout changes (if props are stable)
export default React.memo(BlockRenderer, (prev, next) => {
    // Custom comparison if needed, but shallow comparison of block object is usually fine
    // provided we don't mutate the block object in place without creating a new reference.
    return prev.block === next.block && prev.onAddClick === next.onAddClick;
});
