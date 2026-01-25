import React, { useEffect, useRef, useState } from "react";

export type WidthProviderProps = {
    measureBeforeMount?: boolean;
    className?: string;
    style?: React.CSSProperties;
    width?: number;
};

export default function WidthProvider<P>(
    ComposedComponent: React.ComponentType<P>
): React.ComponentType<P & WidthProviderProps> {
    return function WidthProviderFunc(props: P & WidthProviderProps) {
        const { measureBeforeMount, className, style, ...rest } = props;
        const elementRef = useRef<HTMLDivElement>(null);
        const [width, setWidth] = useState<number>(1280);
        const [mounted, setMounted] = useState<boolean>(false);

        useEffect(() => {
            setMounted(true);
            const element = elementRef.current;
            if (!element) return;

            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    // use contentRect or borderBoxSize
                    setWidth(entry.contentRect.width);
                }
            });

            resizeObserver.observe(element);
            // Initial measure
            setWidth(element.offsetWidth);

            return () => {
                resizeObserver.disconnect();
            };
        }, []);

        // If strictly server-side or waiting for mount, might want to render a placeholder or default
        // But for RGL to work, it needs a width.
        if (measureBeforeMount && !mounted) {
            return (
                <div
                    className={className}
                    style={style}
                    ref={elementRef}
                />
            );
        }

        return (
            <div
                className={className}
                style={style}
                ref={elementRef}
            >
                <ComposedComponent
                    {...(rest as P)}
                    width={width}
                // Pass generic props if needed, but 'width' is the key
                />
            </div>
        );
    };
}
