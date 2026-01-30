"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCropperProps {
    imageSrc: string;
    onCrop: (croppedBlob: Blob) => void;
    onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCrop, onCancel }: ImageCropperProps) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const startPos = useRef({ x: 0, y: 0 });
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Load image to get natural dimensions
    useEffect(() => {
        // Reset transform on new image
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, [imageSrc]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const newX = e.clientX - startPos.current.x;
        const newY = e.clientY - startPos.current.y;
        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newScale = Math.min(Math.max(0.5, scale + delta), 3);
        setScale(newScale);
    };

    const handleSave = async () => {
        if (!imgRef.current) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Crop dimensions (output size)
        const size = 400;
        canvas.width = size;
        canvas.height = size;

        // Draw image transformed
        // We need to map the visual transform to the canvas
        // The visual container is, say, 300x300 circular viewport
        // The image is scaled and translated relative to the center

        // Let's assume the Crop Area is the center of the viewport
        const viewportSize = 280; // The visual circle size

        // Calculate scaling factor between visual viewport and output canvas
        const outputScale = size / viewportSize;

        // Clear
        ctx.clearRect(0, 0, size, size);

        // Using standard canvas transform
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.scale(scale * outputScale, scale * outputScale);
        ctx.translate(position.x / scale, position.y / scale); // visual position is in scaled pixels? No, translate is standard pixels usually applied before scale in CSS order, but here we applied scale.
        // Actually CSS transform: translate(x,y) scale(s) -> translate happens first in visual coords? No. 
        // CSS: transform: translate(Xpx, Ypx) scale(S)
        // This means the element is moved X,Y then scaled. X,Y are viewing-space pixels? Yes.

        // Let's try to replicate:
        // Draw image centered at 0,0
        // The image naturalWidth/Height needs to be drawn
        const img = imgRef.current;

        // We need to account for the fact that in the UI, the image is centered in the container
        // if position is 0,0.
        // So we offset by -width/2, -height/2

        // Wait, precise calculation is tricky without a library.
        // Alternative: Use the visual X/Y and visual Scale directly.

        // Adjusted Logic:
        // 1. Center context
        // 2. Apply scale
        // 3. Apply translation (offset from center)
        // 4. Draw image offset by -width/2, -height/2

        // Wait, CSS transform origin is usually center.
        // If my css is `translate(${x}px, ${y}px) scale(${scale})`, and origin is center...
        // x,y move the center.

        // Context:
        // translate(size/2 + x*outputScale, size/2 + y*outputScale)
        // scale(scale * outputScale)
        // drawImage(img, -img.width/2, -img.height/2)

        ctx.restore();
        ctx.clearRect(0, 0, size, size);
        ctx.save();

        // Move to center + offset
        // We apply the same relative offset as the UI
        ctx.translate(size / 2 + position.x * outputScale, size / 2 + position.y * outputScale);

        // Scale
        ctx.scale(scale * outputScale, scale * outputScale);

        // Draw centered
        // We need to use the rendered width/height ratio if image is "object-contain" or "cover" in UI?
        // In UI, I will display image as `w-auto h-auto max-w-none` but centered.
        // Actually, easiest is to default image width to viewport width if landscape, etc.
        // Let's assume simpler: Draw natural image

        // But if image is huge (4000px), scale=1 in UI might mean "fit to container".
        // We need the `rendered` dimensions of the image in the UI before scale.
        // `imgRef.current.width` (rendered width) vs `naturalWidth`.

        // Let's capture the rendered ratio
        const renderedWidth = img.width; // current rendered width (without transform? or with? img.width returns layout width)
        const renderedHeight = img.height;
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;

        // Scale factor between natural and rendered base
        const layoutScale = 1; // If we control sizing.

        // Better approach:
        // Just draw the image at natural size, scaled by (scale * (renderedBase / natural) * outputScale)
        // We need to know "what size was the image in the UI when scale=1"?
        // In the UI, let's force the image to have `height: viewportSize` or `width: viewportSize` based on aspect ratio ('contain' logic).

        let initialRenderWidth, initialRenderHeight;
        if (naturalWidth > naturalHeight) {
            // Landscape
            initialRenderHeight = viewportSize;
            initialRenderWidth = naturalWidth * (viewportSize / naturalHeight);
        } else {
            // Portrait or Square
            initialRenderWidth = viewportSize;
            initialRenderHeight = naturalHeight * (viewportSize / naturalWidth);
        }

        // Now drawing
        ctx.drawImage(
            img,
            -initialRenderWidth / 2,
            -initialRenderHeight / 2,
            initialRenderWidth,
            initialRenderHeight
        );

        ctx.restore();

        canvas.toBlob((blob) => {
            if (blob) onCrop(blob);
        }, 'image/jpeg', 0.9);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl w-full max-w-md flex flex-col items-center"
            >
                <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Adjust Photo</h3>
                    <p className="text-sm text-zinc-500">Drag to move, scroll or use slider to zoom</p>
                </div>

                {/* Cropping Area */}
                <div
                    className="relative w-[280px] h-[280px] rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-4 border-white dark:border-zinc-700 shadow-inner cursor-move touch-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                    ref={containerRef}
                >
                    <div
                        className="w-full h-full flex items-center justify-center pointer-events-none"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                            transformOrigin: 'center',
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                        }}
                    >
                        {/* We use an img tag that fits the container initially */}
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop Preview"
                            className="max-w-none pointer-events-none select-none"
                            style={{
                                // Force initial 'cover/contain' behavior logic manually or via styles?
                                // If we assume landscape image usually:
                                // minWidth: '100%', minHeight: '100%', objectFit: 'cover' ? 
                                // No, 'object-fit' applies to the box. If we transform the box, it behaves weirdly.
                                // Let's use explicit sizing logic in render or simple CSS.
                                height: '280px',
                                width: 'auto'
                                // This forces height match. Width scales. Good for landscape.
                                // For portrait, we might need width: 280px, height: auto.
                                // We can use JS to detect orientation on load?
                            }}
                            onLoad={(e) => {
                                const img = e.currentTarget;
                                if (img.naturalWidth < img.naturalHeight) {
                                    img.style.width = '280px';
                                    img.style.height = 'auto';
                                } else {
                                    img.style.height = '280px';
                                    img.style.width = 'auto';
                                }
                            }}
                            draggable={false}
                        />
                    </div>

                    {/* Grid Overlay (Optional) */}
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                        <div className="w-full h-1/3 border-b border-white/50"></div>
                        <div className="w-full h-1/3 top-1/3 absolute border-b border-white/50"></div>
                        <div className="h-full w-1/3 border-r border-white/50 absolute top-0 left-0"></div>
                        <div className="h-full w-1/3 border-r border-white/50 absolute top-0 left-1/3"></div>
                    </div>
                </div>

                {/* Controls */}
                <div className="w-full mt-6 space-y-4">
                    <div className="flex items-center gap-3 text-zinc-500 px-4">
                        <ZoomOut className="w-4 h-4" />
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.01"
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="flex-1 accent-zinc-900 dark:accent-white h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <ZoomIn className="w-4 h-4" />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-2.5 rounded-xl font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 py-2.5 rounded-xl font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Apply
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
