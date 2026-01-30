import React from 'react';
import { Block } from '@/core/types/block';

import SocialBlock from '@/components/blocks/SocialBlock';
import ImageBlock from '@/components/blocks/ImageBlock';
import TextBlock from '@/components/blocks/TextBlock';
import HeadingBlock from '@/components/blocks/HeadingBlock';
import MapBlock from '@/components/blocks/MapBlock';
import { Tilt } from '@/components/ui/Tilt';
interface BlockRendererProps {
    block: Block;
    onAddClick?: () => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onAddClick }) => {

    // We can conditionally disable tilt for certain blocks if needed (e.g. map), but for now appy to all
    // Map blocks might capture mouse events so tilt could be annoying, but let's try.
    const isMap = block.type === 'map';

    const renderContent = () => {
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
    };

    if (isMap) {
        return renderContent();
    }

    return (
        <Tilt className="w-full h-full" options={{ scale: 1.02, max: 12, speed: 800, glare: true, "max-glare": 0.15 }}>
            {renderContent()}
        </Tilt>
    );
}

// Memoize to prevent re-renders when parent layout changes (if props are stable)
export default React.memo(BlockRenderer, (prev, next) => {
    // Custom comparison if needed, but shallow comparison of block object is usually fine
    // provided we don't mutate the block object in place without creating a new reference.
    return prev.block === next.block && prev.onAddClick === next.onAddClick;
});
