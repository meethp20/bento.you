"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export default function AuthSync() {
    const { isSignedIn, isLoaded, user } = useUser();
    const syncedRef = useRef(false);

    useEffect(() => {
        if (isLoaded && isSignedIn && user && !syncedRef.current) {
            // Prevent multiple syncs per session load
            syncedRef.current = true;

            fetch("/api/auth/sync", {
                method: "POST",
            })
                .then((res) => {
                    if (!res.ok) {
                        console.error("Auth sync failed", res.status);
                    } else {
                        console.log("Auth sync success");
                    }
                })
                .catch((err) => console.error("Auth sync error", err));
        }
    }, [isLoaded, isSignedIn, user]);

    return null;
}
