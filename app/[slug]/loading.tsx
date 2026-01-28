import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 pb-32 flex flex-col items-center">

            {/* Header Skeleton */}
            <div className="flex items-center gap-6 mb-12 animate-in fade-in duration-700">
                <Skeleton className="h-24 w-24 rounded-full shadow-xl" />
                <div className="space-y-3">
                    <Skeleton className="h-8 w-48 rounded-lg" />
                    <Skeleton className="h-4 w-64 rounded-lg" />
                </div>
            </div>

            {/* Bento Grid Skeleton Pattern */}
            <div className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px] animate-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-backwards">
                {/* Large Block */}
                <Skeleton className="col-span-2 row-span-2 rounded-3xl" />

                {/* Small Blocks */}
                <Skeleton className="col-span-1 row-span-1 rounded-3xl" />
                <Skeleton className="col-span-1 row-span-1 rounded-3xl" />

                {/* Wide Block */}
                <Skeleton className="col-span-2 row-span-1 rounded-3xl" />

                {/* Tall Block */}
                <Skeleton className="col-span-1 row-span-2 rounded-3xl" />

                {/* Random Mix */}
                <Skeleton className="col-span-1 row-span-1 rounded-3xl" />
                <Skeleton className="col-span-2 row-span-1 rounded-3xl" />
            </div>
        </div>
    );
}
