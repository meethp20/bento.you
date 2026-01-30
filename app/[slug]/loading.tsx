import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 pb-32 w-full lg:flex lg:flex-row lg:items-start lg:gap-16 lg:px-4 max-w-7xl mx-auto">

            {/* Sticky Sidebar Skeleton (Desktop) / Centered Header (Mobile) */}
            <div className="mb-12 lg:mb-0 lg:w-[350px] lg:shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 animate-pulse">
                {/* Avatar */}
                <Skeleton className="h-32 w-32 rounded-full shadow-xl ring-4 ring-white dark:ring-zinc-800" />

                {/* Text Info */}
                <div className="flex flex-col items-center lg:items-start gap-4 w-full">
                    <Skeleton className="h-10 w-48 rounded-xl" /> {/* Name */}
                    <div className="space-y-2 w-full flex flex-col items-center lg:items-start">
                        <Skeleton className="h-4 w-full max-w-[200px] rounded-lg" />
                        <Skeleton className="h-4 w-full max-w-[150px] rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Bento Grid Skeleton Pattern (Right Side) */}
            <div className="w-full lg:flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px] animate-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-backwards">
                {/* Social Blocks */}
                <Skeleton className="col-span-1 row-span-1 rounded-3xl" />
                <Skeleton className="col-span-1 row-span-1 rounded-3xl" />

                {/* Large Feature Block */}
                <Skeleton className="col-span-2 row-span-2 rounded-3xl" />

                {/* Wide Link */}
                <Skeleton className="col-span-2 row-span-1 rounded-3xl" />

                {/* Tall Image/Card */}
                <Skeleton className="col-span-1 row-span-2 rounded-3xl" />

                {/* Standard Blocks */}
                <Skeleton className="col-span-1 row-span-1 rounded-3xl" />
                <Skeleton className="col-span-1 row-span-1 rounded-3xl" />
                <Skeleton className="col-span-1 row-span-1 rounded-3xl" />
            </div>
        </div>
    );
}
