"use client";

import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Suspense, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel } from "lucide-react";

function AuthErrorContent() {
    const [banReason, setBanReason] = useState<string | null | undefined>("Not Given");
    const [expires, setExpires] = useState<Date | null | undefined>(undefined);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function checkSession() {
            const { data: session } = await authClient.getSession();
            if (session?.user.banned) {
                setBanReason(session.user.banReason);
                setExpires(session.user.banExpires);
            }
            setLoaded(true);
        }
        checkSession();
    }, []);

    const searchParams = useSearchParams();
    const code = searchParams.get("error") || "Unknown";
    const message = searchParams.get("error_description") || "Something went wrong";

    if (code === "BANNED_USER") {
        if (!loaded) {
            return <div><p>Loading...</p></div>;
        }

        if (expires === undefined) {
            return (
                <div>
                    <p>Auth error</p>
                    <p>Code: {code}</p>
                    <p>{message}</p>
                </div>
            );
        }
        return (
            <div
                className="flex flex-col relative max-w w-full p-10 text-center overflow-hidden min-h-screen h-full justify-center"
                style={{
                    backgroundColor: "#0a0e17",
                    backgroundImage: "url('/stardust.png')",
                    backgroundRepeat: "repeat",
                }}
            >
                <Card
                    size={"default"}
                    className="flex flex-col justify-center items-center mx-auto w-full max-w-md md:w-3/12 min-h-[220px] bg-secondary rounded-xl text-slate-400 p-8"
                >
                    <CardHeader className="items-center justify-center">
                        <Gavel color="#bd0a0a" />
                        <CardTitle>Your account has been suspended</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Reason: {banReason}</p>
                        {expires === null ? <div></div> : <p>Expires on {expires.toDateString()}</p>}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col relative max-w w-full p-10 text-center overflow-hidden min-h-screen h-full justify-center"
            style={{
                backgroundColor: "#0a0e17",
                backgroundImage: "url('/stardust.png')",
                backgroundRepeat: "repeat",
            }}
        >
            <Card
                size={"default"}
                className="flex flex-col justify-center items-center mx-auto w-full max-w-md md:w-3/12 min-h-[220px] bg-secondary rounded-xl text-slate-400 p-8"
            >
                <CardHeader className="items-center justify-center">
                    <Gavel color="#bd0a0a" />
                    <CardTitle>Auth Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{message}</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={<div><p>Loading...</p></div>}>
            <AuthErrorContent />
        </Suspense>
    );
}