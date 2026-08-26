"use client"

import Image from "next/image";
import {authClient} from "@/lib/auth-client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Avatar} from "@base-ui/react";
import UserAvatar from "@/components/ui/UserAvatar";
import {Button} from "@/components/ui/button";
import Post from "@/components/Post";
import {api} from "@/lib/utils";

export default function Home() {
    const {
        data: session,
            isPending, //loading state
            error, //error object
            refetch
    } = authClient.useSession()
    const router = useRouter()

    useEffect(() => {
        if (!isPending && session && !error && session.user.banned) {
            router.push("/auth/error?error=BANNED_USER");
        }
    }, [isPending, session, error, router]);

    const signedIn = !isPending && !!session && !error && !session.user.banned;


  return (
      <div className="min-w-full min-h-screen items-center flex flex-col">
          <div className="flex backdrop-blur-sm bg-primary/70 sticky top-0 z-50 min-w-full flex-row justify-between items-center h-12 px-4">
              <Image src="orbit_logo.svg" alt={"Orbit Logo"} width={256} height={128}/>
              {signedIn ? <UserAvatar profileUrl={session?.user.image} name={session?.user.name} height={128} width={128} /> : <Button size="lg" onClick={() => {window.location.href = "/signin"}}>Sign in</Button>}
          </div>
          <div className="bg-cyan-950 min-w-full min-h-screen items-center justify-center">
              <div className={"bg-cyan-950 h-12 p-2"}></div>
            <Post content={"Big Boy Bans"} api={api.APOD} imageUrl={"https://apod.nasa.gov/apod/image/2608/EarthShadow_Martin_960.jpg"} likes={2} commentsNum={2} liked={false} signedIn={signedIn}/>
              <Post content={"Big Boy Bans"} api={api.DONKI} likes={2} commentsNum={2} liked={false} signedIn={signedIn}/>
              <Post content={"Big Boy Bans"} api={api.ASTEROID} likes={2} commentsNum={2} liked={true} signedIn={signedIn}/>
          </div>
      </div>
  );
}
