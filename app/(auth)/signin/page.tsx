"use client"

import {authClient} from "@/lib/auth-client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {SignInForm} from "@/components/SignInForm";

type Session = typeof authClient.$Infer.Session;

export default function SignIn(){
    const [session, setSession] = useState<Session | null | undefined>(undefined);
    const router = useRouter()


    useEffect(() => {
        authClient.getSession().then(({ data, error }) => {
            if(!error){
                setSession(data)
            }
        });
        if(session != undefined){
            if(session){
                router.push("/home")
            }
        }
    }, []);

    // @ts-ignore
    // @ts-ignore
    return(
        <div className="flex min-h-screen max-width w-full bg-primary ">
        <div className="flex flex-col min-h-screen max-width bg-primary dark:bg-primary md:w-5/12">
            <SignInForm />
        </div>
        <div className="flex w-0 md:w-7/12 bg-orange-50 relative overflow-hidden invisible md:visible">
            <div
                className="flex flex-col relative max-w w-full p-10 text-center overflow-hidden min-h-screen h-full justify-center"
                style={{
                    backgroundColor: "#0a0e17",
                    backgroundImage: "url('/stardust.png')",
                    backgroundRepeat: "repeat",
                }}
            >
                <div className={"absolute top-0 right-0"}>
                    <img src="orbit_logo.svg" alt={"logo"} width={256} height={128} />
                </div>
                <h1 className="text-primary-foreground text-3xl font-bold">The Best kind of social media</h1>
            </div>
        </div>
        </div>
    )
}