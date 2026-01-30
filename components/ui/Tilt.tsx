"use client";

import React, { useRef, useEffect } from "react";
// We import VanillaTilt dynamically or assume it's loaded, but for React usage it's safer to use a ref-based approach with an effect.
// Since vanilla-tilt is a vanilla JS lib, we need to initialize it on the DOM node.

// We need to import the vanilla-tilt library.
// If 'vanilla-tilt' is not a module with types, we might need a @ts-ignore or require.
import VanillaTilt from 'vanilla-tilt';

interface TiltProps {
    options?: {
        max?: number;
        speed?: number;
        glare?: boolean;
        "max-glare"?: number;
        scale?: number;
        perspective?: number;
        easing?: string;
    };
    className?: string;
    children: React.ReactNode;
}

export const Tilt: React.FC<TiltProps> = ({ options, className, children }) => {
    const tiltRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tiltNode = tiltRef.current;
        if (tiltNode) {
            VanillaTilt.init(tiltNode, {
                max: 10,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
                scale: 1.02,
                perspective: 1000,
                ...options
            });
        }

        // Cleanup
        return () => {
            if (tiltNode && (tiltNode as any).vanillaTilt) {
                (tiltNode as any).vanillaTilt.destroy();
            }
        };
    }, [options]);

    return (
        <div ref={tiltRef} className={className}>
            {children}
        </div>
    );
};
