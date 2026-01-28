import React, { useMemo, useCallback, useState } from 'react';
import { Block } from '@/core/types/block';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { X, LayoutTemplate, Square, LayoutGrid } from 'lucide-react';
import RGL, { Layout as RGLLayout } from 'react-grid-layout';
import WidthProvider from './WidthProvider';
import { motion } from 'framer-motion';

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
    const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('lg');
    const currentBreakpointRef = React.useRef<string>('lg');

    const handleBreakpointChange = useCallback((newBreakpoint: string) => {
        currentBreakpointRef.current = newBreakpoint;
        setCurrentBreakpoint(newBreakpoint);
    }, []);

    // Helper to get initial layout or fallback
    const getLayout = (block: Block, type: 'desktop' | 'mobile') => {
        if (block.layouts?.[type]) {
            return { ...block.layouts[type], i: block.id };
        }
        // Fallback: If no specific layout, use global x,y but clamp width for mobile
        return {
            i: block.id,
            x: block.x || 0,
            y: block.y || 0,
            w: type === 'mobile' ? Math.min(block.w, 2) : block.w, // Ensure mobile width doesn't exceed 2
            h: block.h
        };
    };

    // Prepare separate layouts for RGL
    const layouts = useMemo(() => {
        return {
            lg: blocks.map(b => ({ ...getLayout(b, 'desktop'), static: !isEditMode })),
            md: blocks.map(b => ({ ...getLayout(b, 'desktop'), static: !isEditMode })),
            sm: blocks.map(b => ({ ...getLayout(b, 'mobile'), static: !isEditMode })),
            xs: blocks.map(b => ({ ...getLayout(b, 'mobile'), static: !isEditMode })),
            xxs: blocks.map(b => ({ ...getLayout(b, 'mobile'), static: !isEditMode })),
        };
    }, [blocks, isEditMode]);

    const handleLayoutChange = useCallback((currentLayout: RGLLayoutItem[], allLayouts: any) => {
        // We only want to update the blocks if there's a meaningful change
        // to avoid infinite loops.

        const breakpoint = currentBreakpointRef.current; // Use Ref to access latest breakpoint immediately

        const newBlocks = blocks.map(block => {
            const blockId = block.id;

            // Find this block in the CURRENT layout to get the latest position
            const activeItem = currentLayout.find(l => l.i === blockId);

            // Existing layouts serve as base
            const defaultDesktop = block.layouts?.desktop || { x: block.x, y: block.y, w: block.w, h: block.h };
            const defaultMobile = block.layouts?.mobile || { x: 0, y: 0, w: Math.min(block.w, 2), h: block.h };

            let newDesktopLayout = defaultDesktop;
            let newMobileLayout = defaultMobile;

            if (activeItem) {
                // If the current breakpoint is a mobile one, update the mobile layout
                if (['xs', 'xxs', 'sm'].includes(breakpoint)) {
                    newMobileLayout = {
                        x: activeItem.x,
                        y: activeItem.y,
                        w: activeItem.w,
                        h: activeItem.h
                    };
                }
                // Otherwise (lg, md), update the desktop layout
                else {
                    newDesktopLayout = {
                        x: activeItem.x,
                        y: activeItem.y,
                        w: activeItem.w,
                        h: activeItem.h
                    };
                }
            }

            return {
                ...block,
                // Update top-level props to match DESKTOP for consistency (or whichever is active, but desktop is safer default)
                x: newDesktopLayout.x,
                y: newDesktopLayout.y,
                w: newDesktopLayout.w,
                h: newDesktopLayout.h,
                layouts: {
                    desktop: newDesktopLayout,
                    mobile: newMobileLayout
                }
            };
        });

        // Simple deep equality check or JSON stringify to prevent loops if nothing changed
        if (JSON.stringify(newBlocks) !== JSON.stringify(blocks)) {
            onLayoutChange(newBlocks);
        }
    }, [blocks, onLayoutChange]); // Removed currentBreakpoint dependency entirely as we use ref

    const handleResize = (id: string, w: number, h: number) => {
        // When manually resizing via buttons, we update BOTH layouts for simplicity unless we know context.
        // For now, let's update both but clamp mobile width.
        const newBlocks = blocks.map(block => {
            if (block.id === id) {
                const currentDesktop = block.layouts?.desktop || { x: block.x, y: block.y, w: block.w, h: block.h };
                const currentMobile = block.layouts?.mobile || { x: 0, y: 0, w: Math.min(block.w, 2), h: block.h };

                return {
                    ...block,
                    w, h,
                    layouts: {
                        desktop: { ...currentDesktop, w, h },
                        mobile: { ...currentMobile, w: Math.min(w, 2), h }
                    }
                };
            }
            return block;
        });
        onLayoutChange(newBlocks);
    };

    // Track which blocks have been rendered to prevent re-animation on prop updates (like isEditMode toggle)
    const renderedBlocksRef = React.useRef<Set<string>>(new Set());

    // Update the set of rendered blocks whenever the blocks array changes
    React.useEffect(() => {
        blocks.forEach(b => renderedBlocksRef.current.add(b.id));
    }, [blocks]);

    // Haptic feedback helper
    const vibrate = () => {
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8 mb-32">
            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 4, md: 4, sm: 2, xs: 2, xxs: 2 }}
                rowHeight={160}
                margin={[16, 16]}
                containerPadding={[0, 0]}
                isDraggable={isEditMode}
                isResizable={false}
                onLayoutChange={handleLayoutChange}
                onBreakpointChange={handleBreakpointChange}
                onDragStart={vibrate}
                onDragStop={vibrate}
                useCSSTransforms={true}
                compactType="vertical"
                preventCollision={false}
                // Explicitly use the drag handle class to avoid conflicts with child elements
                draggableHandle=".grid-drag-handle"
            >
                {blocks.map((block, index) => {
                    // Check if we've seen this block before
                    const hasAnimated = renderedBlocksRef.current.has(block.id);

                    return (
                        <div key={block.id} className={`relative group/container bg-transparent !overflow-visible hover:z-50 transition-none`}>

                            {/* Collision/Placement Indicator (Active only when dragging ideally, but simple dash border acts as one too) */}
                            {isEditMode && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 border-2 border-indigo-500/50 rounded-3xl pointer-events-none z-0"
                                />
                            )}

                            {/* DRAG HANDLE OVERLAY: Only visible in edit mode. */}
                            {isEditMode && (
                                <div className="grid-drag-handle absolute inset-0 z-20 cursor-move rounded-3xl group-hover/container:bg-white/5 transition-colors">
                                    {/* Optional: Add a visual indicator in the center or corner if desired, 
                                    but for now keep it minimal as an invisible tap target */}
                                </div>
                            )}

                            {/* Block Content with Animation */}
                            <motion.div
                                initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: hasAnimated ? 0 : index * 0.05 }}
                                className="w-full h-full"
                            >
                                {/* Subtle rainbow glow effect behind the bento grid blocks */}
                                <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-[2rem] blur opacity-25 group-hover/container:opacity-60 transition duration-500 pointer-events-none -z-10"></div>

                                <div className={`w-full h-full transition-all duration-300 ${isEditMode ? 'opacity-90 scale-[0.98]' : ''} bg-white dark:bg-zinc-900 rounded-3xl shadow-sm overflow-hidden select-none`}>
                                    <BlockRenderer block={block} />
                                </div>
                            </motion.div>

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
                                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 bg-black dark:bg-zinc-800 text-white px-2 py-1.5 rounded-full shadow-xl opacity-0 group-hover/container:opacity-100 transition-opacity duration-200 delay-300 group-hover/container:delay-0"
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
                    )
                })}
            </ResponsiveGridLayout>
        </div>
    );
};

export default Container;
