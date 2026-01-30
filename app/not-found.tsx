import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="space-y-6 max-w-md">
                {/* Animated 404 Mascot/Icon */}
                <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center text-6xl animate-bounce">
                        🍱
                    </div>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
                    Page not found
                </h1>

                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Oops! It seems like this Bento box is empty. The user you are looking for doesn't exist or has moved.
                </p>

                <div className="pt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-zinc-900 rounded-full hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
                    >
                        Create your own Bento
                    </Link>
                </div>

                <div className="pt-12">
                    <p className="text-sm text-zinc-400">
                        Lost? <Link href="/" className="underline hover:text-zinc-900 dark:hover:text-white">Go home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
