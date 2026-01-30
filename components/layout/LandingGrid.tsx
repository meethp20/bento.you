import React, { useState } from 'react';
import Container from './Container';
import { Block } from '@/core/types/block';

export const LandingGrid = () => {
    // Replicating the exact rich layout from the static design using actual blocks
    const [demoBlocks, setDemoBlocks] = useState<Block[]>([
        // Quote Card (2x2)
        {
            id: 'demo-quote',
            type: 'quote',
            x: 0, y: 0, w: 2, h: 2,
            layouts: {
                desktop: { x: 0, y: 0, w: 2, h: 2 },
                mobile: { x: 0, y: 0, w: 2, h: 2 }
            },
            data: {
                text: "The details are not the details. They make the design.",
                title: "Charles Eames"
            }
        },
        // Spotify Card (1x2) - Green Top Right
        {
            id: 'demo-spotify',
            type: 'social',
            x: 2, y: 0, w: 1, h: 2,
            layouts: {
                desktop: { x: 2, y: 0, w: 1, h: 2 },
                mobile: { x: 0, y: 2, w: 1, h: 2 }
            },
            data: {
                platform: 'spotify',
                title: 'Midnight City',
                url: 'https://open.spotify.com/track/1eyzqe2QqGZUmfcPZtrIyt' // M83 - Midnight City
            }
        },
        // LinkedIn Card (1x1)
        {
            id: 'demo-linkedin',
            type: 'social',
            x: 3, y: 0, w: 1, h: 1,
            layouts: {
                desktop: { x: 3, y: 0, w: 1, h: 1 },
                mobile: { x: 0, y: 5, w: 1, h: 1 }
            },
            data: {
                platform: 'linkedin',
                title: 'Meeth',
                iconUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
                url: 'https://linkedin.com'
            }
        },
        // Map (1x1) - Below LinkedIn
        {
            id: 'demo-map',
            type: 'map',
            x: 3, y: 1, w: 1, h: 1,
            layouts: {
                desktop: { x: 3, y: 1, w: 1, h: 1 },
                mobile: { x: 1, y: 5, w: 1, h: 1 }
            },
            data: { location: "San Francisco, CA" }
        },
        // Instagram (1x2) - Bottom Left
        {
            id: 'demo-insta',
            type: 'social',
            x: 0, y: 2, w: 1, h: 2,
            layouts: {
                desktop: { x: 0, y: 2, w: 1, h: 2 },
                mobile: { x: 1, y: 2, w: 1, h: 2 }
            },
            data: {
                platform: 'instagram',
                title: 'sara_design',
                url: 'https://instagram.com'
            }
        },
        // Cal.com / Booking (2x1) - Middle Bottom
        {
            id: 'demo-cal',
            type: 'cal',
            x: 1, y: 2, w: 2, h: 1,
            layouts: {
                desktop: { x: 1, y: 2, w: 2, h: 1 },
                mobile: { x: 0, y: 4, w: 2, h: 1 }
            },
            data: {
                title: 'Product Design Review',
                url: 'google.com' // Placeholder
            }
        },
        // Photo/Location (1x1) - Bottom Right
        {
            id: 'demo-image',
            type: 'image',
            x: 3, y: 2, w: 1, h: 1,
            layouts: {
                desktop: { x: 3, y: 2, w: 1, h: 1 },
                mobile: { x: 0, y: 6, w: 2, h: 1 } // Full width on mobile for impact
            },
            data: {
                imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop",
                title: "Mountain View"
            }
        }
    ]);

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            {/* Main wrapping div specific for landing page layout constraints if needed */}
            <Container
                blocks={demoBlocks}
                isEditMode={true}
                isLandingPage={true}
                onLayoutChange={setDemoBlocks}
                onDeleteBlock={() => { }}
            />
        </div>
    );
};
