import React, { useMemo, useCallback } from 'react';
import { Block } from '@/types/block';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import WidthProvider from '@/components/layout/WidthProvider';
import { X, LayoutTemplate, Square, LayoutGrid, Maximize, GripHorizontal } from 'lucide-react';
import RGL, { Layout } from 'react-grid-layout';

// Force import of Responsive from the library, handling various module formats
let Responsive: any;

try {
    if (RGL && (RGL as any).Responsive) {
        Responsive = (RGL as any).Responsive;
    }
    else if (RGL && (RGL as any).default && (RGL as any).default.Responsive) {
        Responsive = (RGL as any).default.Responsive;
    }
} catch (e) {
    console.error("Failed to load ReactGridLayout", e);
}

if (!Responsive) {
    try {
        const { Responsive: NamedResponsive } = require('react-grid-layout');
        Responsive = NamedResponsive;
    } catch (e) {
        console.warn("Could not require react-grid-layout named export", e);
    }
}

if (!Responsive) {
    Responsive = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
}

// Use our custom WidthProvider
const ResponsiveGridLayout: any = WidthProvider(Responsive);

interface RGLLayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    static?: boolean;
}

interface ContainerProps {
    blocks: Block[];
    isEditMode: boolean;
    onDeleteBlock: (id: string) => void;
    onLayoutChange: (blocks: Block[]) => void;
}

const Container: React.FC<ContainerProps> = ({ blocks, isEditMode, onDeleteBlock, onLayoutChange }) => {

    // Convert Blocks to React-Grid-Layout format
    const layout = useMemo(() => {
        return blocks.map(block => ({
            i: block.id,
            x: block.x || 0,
            y: block.y || 0,
            w: block.w,
            h: block.h,
            minW: 1,
            maxW: 2,
            minH: 1,
            maxH: 2,
            static: !isEditMode // Disable drag/resize when not in edit mode
        }));
    }, [blocks, isEditMode]);

    const handleLayoutChange = useCallback((currentLayout: RGLLayoutItem[]) => {
        const newBlocks = blocks.map(block => {
            const layoutItem = currentLayout.find(l => l.i === block.id);
            if (layoutItem) {
                if (layoutItem.x !== block.x || layoutItem.y !== block.y || layoutItem.w !== block.w || layoutItem.h !== block.h) {
                    return {
                        ...block,
                        x: layoutItem.x,
                        y: layoutItem.y,
                        w: layoutItem.w,
                        h: layoutItem.h
                    };
                }
            }
            return block;
        });

        const hasChanges = newBlocks.some((b, i) => b !== blocks[i]);
        if (hasChanges) {
            onLayoutChange(newBlocks);
        }
    }, [blocks, onLayoutChange]);

    const handleResize = (id: string, w: number, h: number) => {
        const newBlocks = blocks.map(block => {
            if (block.id === id) {
                return { ...block, w, h };
            }
            return block;
        });
        onLayoutChange(newBlocks);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8 mb-32">
            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 4, md: 4, sm: 2, xs: 2, xxs: 2 }}
                rowHeight={160}
                margin={[16, 16]}
                containerPadding={[0, 0]}
                isDraggable={isEditMode}
                isResizable={false}
                onLayoutChange={handleLayoutChange}
                useCSSTransforms={true}
                compactType="vertical"
                preventCollision={false}
                // Explicitly use the drag handle class to avoid conflicts with child elements
                draggableHandle=".grid-drag-handle"
            >
                {blocks.map((block) => (
                    <div key={block.id} className={`relative group/container bg-transparent !overflow-visible`}>

                        {/* DRAG HANDLE OVERLAY: Only visible in edit mode. */}
                        {isEditMode && (
                            <div className="grid-drag-handle absolute inset-0 z-20 cursor-move rounded-3xl group-hover/container:bg-white/5 transition-colors">
                                {/* Optional: Add a visual indicator in the center or corner if desired, 
                                    but for now keep it minimal as an invisible tap target */}
                            </div>
                        )}

                        <div className={`w-full h-full transition-all duration-300 ${isEditMode ? 'opacity-90 ring-2 ring-indigo-500/20' : ''} bg-white dark:bg-zinc-900 rounded-3xl shadow-sm overflow-hidden select-none`}>
                            <BlockRenderer block={block} />
                        </div>

                        {/* Delete Button - Outside the drag handle for separate clicking */}
                        {isEditMode && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDeleteBlock(block.id);
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                className="absolute -top-3 -right-3 z-[100] bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-100 transition-all hover:bg-red-600 hover:scale-110 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        {/* Resize Controls - Outside the drag handle */}
                        {isEditMode && (
                            <div
                                className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 bg-black text-white px-2 py-1.5 rounded-full shadow-xl opacity-0 group-hover/container:opacity-100 transition-opacity"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                {/* 1x1 Small */}
                                <button
                                    onClick={() => handleResize(block.id, 1, 1)}
                                    className={`p-1.5 rounded-full hover:bg-white/20 transition-colors ${block.w === 1 && block.h === 1 ? 'bg-white/30' : ''}`}
                                    title="Small"
                                >
                                    <Square className="w-3 h-3" />
                                </button>
                                {/* 2x1 Horizontal */}
                                <button
                                    onClick={() => handleResize(block.id, 2, 1)}
                                    className={`p-1.5 rounded-full hover:bg-white/20 transition-colors ${block.w === 2 && block.h === 1 ? 'bg-white/30' : ''}`}
                                    title="Wide"
                                >
                                    <LayoutTemplate className="w-3 h-3 rotate-90" />
                                </button>
                                {/* 1x2 Vertical */}
                                <button
                                    onClick={() => handleResize(block.id, 1, 2)}
                                    className={`p-1.5 rounded-full hover:bg-white/20 transition-colors ${block.w === 1 && block.h === 2 ? 'bg-white/30' : ''}`}
                                    title="Tall"
                                >
                                    <LayoutTemplate className="w-3 h-3" />
                                </button>
                                {/* 2x2 Large */}
                                <button
                                    onClick={() => handleResize(block.id, 2, 2)}
                                    className={`p-1.5 rounded-full hover:bg-white/20 transition-colors ${block.w === 2 && block.h === 2 ? 'bg-white/30' : ''}`}
                                    title="Large"
                                >
                                    <LayoutGrid className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
};

export default Container;
