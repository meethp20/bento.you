"use client";

import React, { useEffect, useState } from 'react';
import { ThemeId } from '@/components/ui/SettingsMenu';

interface DynamicBackgroundProps {
    theme: ThemeId;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ theme }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Extended Theme Types
    const getThemeStyles = (t: ThemeId) => {
        switch (t) {
            case 'sunset-bliss':
                return {
                    bg: 'bg-orange-50', // Light mode base
                    darkBg: 'dark:bg-zinc-900',
                    orbs: [
                        { color: 'bg-orange-400/30 dark:bg-orange-600/20', size: 'w-[50vw] h-[50vw]', pos: 'top-0 left-0', delay: '0s' },
                        { color: 'bg-rose-400/30 dark:bg-rose-600/20', size: 'w-[40vw] h-[40vw]', pos: 'bottom-0 right-0', delay: '3s' },
                        { color: 'bg-amber-300/30 dark:bg-amber-600/20', size: 'w-[30vw] h-[30vw]', pos: 'top-1/2 left-1/2 -translate-x-1/2', delay: '1.5s' }
                    ]
                };
            case 'ocean-breeze':
                return {
                    bg: 'bg-slate-50',
                    darkBg: 'dark:bg-slate-950',
                    orbs: [
                        { color: 'bg-cyan-400/30 dark:bg-cyan-600/20', size: 'w-[45vw] h-[45vw]', pos: 'top-[-10%] right-[-5%]', delay: '0s' },
                        { color: 'bg-blue-400/30 dark:bg-blue-600/20', size: 'w-[50vw] h-[50vw]', pos: 'bottom-[-10%] left-[-10%]', delay: '4s' },
                        { color: 'bg-teal-300/30 dark:bg-teal-600/20', size: 'w-[25vw] h-[25vw]', pos: 'top-[40%] right-[20%]', delay: '2s' }
                    ]
                };
            case 'forest-zen':
                return {
                    bg: 'bg-stone-50',
                    darkBg: 'dark:bg-stone-950',
                    orbs: [
                        { color: 'bg-emerald-400/30 dark:bg-emerald-600/20', size: 'w-[50vw] h-[50vw]', pos: 'top-[-20%] left-[20%]', delay: '1s' },
                        { color: 'bg-green-400/30 dark:bg-green-600/20', size: 'w-[40vw] h-[40vw]', pos: 'bottom-0 right-0', delay: '3s' },
                    ]
                };
            case 'rainbow':
                return {
                    bg: 'bg-white',
                    darkBg: 'dark:bg-zinc-950',
                    orbs: [
                        { color: 'bg-rose-300/40 dark:bg-rose-600/20', size: 'w-[45vw] h-[45vw]', pos: 'top-[-10%] left-[-10%]', delay: '0s' },
                        { color: 'bg-yellow-200/40 dark:bg-yellow-600/20', size: 'w-[40vw] h-[40vw]', pos: 'top-[30%] right-[-10%]', delay: '2s' },
                        { color: 'bg-sky-300/40 dark:bg-sky-600/20', size: 'w-[50vw] h-[50vw]', pos: 'bottom-[-10%] left-[20%]', delay: '4s' },
                        { color: 'bg-purple-300/40 dark:bg-purple-600/20', size: 'w-[35vw] h-[35vw]', pos: 'bottom-[20%] right-[20%]', delay: '1s' }
                    ]
                };
            case 'grid':
                return {
                    isSolid: true,
                    className: 'bg-white dark:bg-zinc-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]'
                };
            case 'stars':
                return {
                    isSolid: true,
                    className: 'bg-black text-white relative overflow-hidden',
                    // Simulate stars with multiple box-shadow layers or gradients. 
                    // Using a simpler approach for now with a custom star pattern CSS class or inline style if needed.
                    // But here I'll use a radial gradient pattern for simplicity and performance.
                    children: (
                        <>
                            <div className="absolute inset-0 bg-[radial-gradient(white,rgba(255,255,255,.2)_2px,transparent_3px)] bg-[size:50px_50px] opacity-20 animate-[pulse_4s_infinite]"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(white,rgba(255,255,255,.15)_1px,transparent_2px)] bg-[size:30px_30px] opacity-10 top-10 left-10"></div>
                        </>
                    )
                };
            default:
                return {
                    bg: 'bg-zinc-50',
                    darkBg: 'dark:bg-zinc-950',
                    orbs: [
                        { color: 'bg-zinc-300/50 dark:bg-zinc-800/50', size: 'w-[40vw] h-[40vw]', pos: '-top-20 -left-20', delay: '0s' }
                    ]
                };
        }
    };

    const style = getThemeStyles(theme);

    if (!mounted) return null;

    return (
        <div className={`fixed inset-0 overflow-hidden pointer-events-none -z-50 transition-colors duration-700 ${style.bg || ''} ${style.darkBg || ''}`}>
            {/* Mesh Gradient Orbs */}
            {!style.isSolid && style.orbs?.map((orb, i) => (
                <div
                    key={i}
                    className={`absolute rounded-full blur-[100px] animate-pulse-slow mix-blend-multiply dark:mix-blend-screen transition-all duration-1000 ${orb.color} ${orb.size} ${orb.pos}`}
                    style={{
                        animationDuration: '8s',
                        animationDelay: orb.delay
                    }}
                />
            ))}

            {/* Glassmorphism Noise Overlay (Optional Texture) */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {style.isSolid && (
                <div className={`absolute inset-0 ${style.className}`}>
                    {(style as any).children}
                </div>
            )}
        </div>
    );
};

export default DynamicBackground;
