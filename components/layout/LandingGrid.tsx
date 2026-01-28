import React from 'react';
import {
    Play,
    Github,
    Twitter,
    Instagram,
    MapPin,
    Calendar,
    ArrowUpRight,
    Music,
    Quote,
    Linkedin
} from 'lucide-react';

export const LandingGrid = () => {
    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]">

                {/* Quote Card (2x2) */}
                <div className="col-span-1 md:col-span-2 row-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
                    <div>
                        <Quote className="w-8 h-8 text-zinc-900 mb-4 fill-current" />
                        <p className="text-2xl md:text-3xl font-serif font-medium leading-tight text-zinc-900">
                            "The details are not the details. They make the design."
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-200" />
                        <div>
                            <p className="text-sm font-bold">Charles Eames</p>
                            <p className="text-xs text-zinc-500">Legendary Designer</p>
                        </div>
                    </div>
                </div>

                {/* Spotify Card (1x2) */}
                <div className="col-span-1 row-span-2 bg-gradient-to-br from-green-400 to-emerald-600 rounded-[2rem] p-6 text-white shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
                    <div className="bg-black/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Music className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="aspect-square w-full rounded-xl bg-black/20 mb-4 overflow-hidden relative">
                            <img
                                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop"
                                alt="Album Art"
                                className="object-cover w-full h-full opacity-80 mix-blend-overlay"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center pl-1 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                    <Play className="w-6 h-6 fill-current" />
                                </div>
                            </div>
                        </div>
                        <p className="font-bold text-lg truncate">Midnight City</p>
                        <p className="text-white/80 text-sm truncate">M83</p>
                    </div>
                </div>

                {/* GitHub (1x1) */}
                {/* LinkedIn Card (1x1) */}
                {/* GitHub (1x1) */}
                {/* LinkedIn Card (1x1) */}
                <div className="bg-white rounded-[2rem] p-0 flex flex-col shadow-sm hover:translate-y-[-4px] transition-transform duration-300 overflow-hidden border border-zinc-200 group relative">
                    {/* Banner */}
                    <div className="h-16 bg-[#0077b5] relative">
                        <div className="absolute top-2 right-2">
                            <Linkedin className="w-5 h-5 text-white/80" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-4 pt-0 text-center relative">
                        {/* Profile Pic */}
                        <div className="w-16 h-16 mx-auto -mt-8 rounded-full border-4 border-white overflow-hidden relative z-10 bg-zinc-100">
                            <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h4 className="font-bold text-zinc-900 mt-2 leading-tight">Meeth</h4>
                        <p className="text-[10px] text-zinc-500 font-medium leading-tight mt-1 line-clamp-2">
                            Senior Product Designer @ Stripe
                        </p>

                        <button className="mt-3 w-full py-1.5 rounded-full border border-[#0077b5] text-[#0077b5] text-xs font-bold hover:bg-[#0077b5] hover:text-white transition-colors">
                            Connect
                        </button>
                    </div>
                </div>

                {/* Map (1x1) */}
                <div className="relative overflow-hidden rounded-[2rem] bg-blue-500 shadow-sm group">
                    <img
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                        <div className="flex items-center gap-2 text-white">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm font-bold">San Francisco</span>
                        </div>
                    </div>
                </div>

                {/* Instagram (1x2) */}
                <div className="col-span-1 row-span-2 bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600 p-1 rounded-[2rem] shadow-sm hover:rotate-1 transition-transform duration-300">
                    {/* Instagram (1x2) */}
                    <div className="col-span-1 row-span-2 bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600 p-1 rounded-[2rem] shadow-sm hover:rotate-1 transition-transform duration-300">
                        <div className="bg-white w-full h-full rounded-[1.8rem] p-5 flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600">
                                    <div className="w-full h-full bg-white rounded-full p-0.5">
                                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" className="w-full h-full rounded-full object-cover" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-sm">sara_design</p>
                                    <p className="text-xs text-zinc-500">Designer</p>
                                </div>
                                <Instagram className="w-5 h-5 ml-auto text-zinc-400" />
                            </div>

                            <div className="grid grid-cols-2 gap-2 flex-1">
                                <div className="rounded-xl bg-zinc-100 overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
                                </div>
                                <div className="rounded-xl bg-zinc-100 overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
                                </div>
                                <div className="rounded-xl bg-zinc-100 overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
                                </div>
                                <div className="rounded-xl bg-zinc-100 overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1493612276216-9c59019558f7?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors">
                                Follow
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cal.com (2x1) */}
                <div className="col-span-1 md:col-span-2 bg-white border border-zinc-100 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:border-black transition-colors duration-300 cursor-pointer group">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold uppercase text-zinc-500">Book a Call</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">Product Design Review</h3>
                        <p className="text-zinc-500 text-sm">30 mins • Google Meet</p>
                    </div>

                    {/* Fake Calendar Grid */}
                    <div className="bg-zinc-50 p-4 rounded-xl hidden md:block group-hover:bg-zinc-100 transition-colors">
                        <div className="grid grid-cols-4 gap-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex flex-col gap-2 items-center">
                                    <span className="text-[10px] uppercase text-zinc-400">Mon</span>
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold shadow-sm">
                                        {12 + i}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="md:hidden w-10 h-10 rounded-full bg-black flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                </div>

                {/* Photo Gallery (1x1) */}
                <div className="relative rounded-[2rem] overflow-hidden group">
                    <img
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                </div>

            </div>
        </div>
    );
};
