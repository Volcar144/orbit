"use client"

import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {useState} from "react";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import * as z from "zod"
import {Controller, useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import {ProfileDropBox} from "@/components/ui/ProfileDropBox";
import {useRouter} from "next/navigation";

const usernameForm = z.object({
    username: z.string()
        .min(4, "Username must be longer than 4 characters.")
        .max(30, "Username cannot be longer than 30 characters.")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, _ and 1-9.")
})

export default function SetupPage() {

    enum flowStep {
        "USERNAME",
        "PROFILE"
    }

    const [continueEnabled, setContinueEnabled] = useState(false);
    const [step, setStep] = useState(flowStep.USERNAME);
    const [loading, setLoading] = useState(false);
    const [picError, setError] = useState<string | undefined>(undefined)
    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch
    } = authClient.useSession()
    const router = useRouter()

    const usernameStep = useForm<z.infer<typeof usernameForm>>({
        defaultValues: {
            username: ""
        }
    })

    while(isPending){
        return(
            <div
                className="flex flex-col min-w-full rounded-2xl p-10 text-center overflow-hidden min-h-screen h-full justify-center items-center"
                style={{
                    backgroundColor: "#0a0e17",
                    backgroundImage: "url('/stardust.png')",
                    backgroundRepeat: "repeat",
                }}
            >
                <div className="w-full max-w-md bg-card border rounded-xl shadow-sm p-6 flex flex-col gap-6 items-center justify-center">
                    <h1>Loading...</h1>
                </div>
            </div>
        )
    }

    if(!session){
        router.push("/signin")
    }

    async function submitUsername(data: z.infer<typeof usernameForm>) {
        setLoading(true)

        if (step === flowStep.PROFILE) {
            setLoading(false)
            return;
        }
        const isTaken = await authClient.isUsernameAvailable({
            username: data.username
        })
        if (!isTaken.data) {
            setLoading(false)
            return;
        }
        if (isTaken.data.available) {
            await authClient.updateUser({
                username: data.username,
                displayUsername: data.username
            })
            setLoading(false)
            setStep(flowStep.PROFILE)
            return;
        }

        usernameStep.setError("username", {
            type: "value",
            message: "Username is already taken."
        })
        setLoading(false)
    }

    async function runUploadPhoto(url: string) {
        setLoading(true)
        await authClient.updateUser({
            image: url,
        }, {
            onError(ctx) {
                setError(ctx.error.message)
            },
            onSuccess() {
                setContinueEnabled(true)
            }
        })
        setLoading(false)
    }

    return (
        <div
            className="flex flex-col min-w-full rounded-2xl p-10 text-center overflow-hidden min-h-screen h-full justify-center items-center"
            style={{
                backgroundColor: "#0a0e17",
                backgroundImage: "url('/stardust.png')",
                backgroundRepeat: "repeat",
            }}
        >
            <div
                className="w-full max-w-md bg-card border rounded-xl shadow-sm p-6 flex flex-col gap-6 items-center justify-center">
                <h1 className={"text-2xl font-bold p-2"}>Complete your profile</h1>
                {step === flowStep.USERNAME ?
                    <>
                        <form id="form-username" onSubmit={usernameStep.handleSubmit(submitUsername)}>
                            <Controller
                                name="username"
                                control={usernameStep.control}
                                render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid} className="w-full">
                                        <FieldLabel htmlFor="form-username-input">Choose your username</FieldLabel>
                                        <InputGroup className="w-full">
                                            <InputGroupAddon align={"inline-start"}>
                                                @
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                {...field}
                                                id="form-username-input"
                                                type={"text"}
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Gorilla_guy23"
                                                autoComplete="off"
                                                className="w-full"
                                                required={true}
                                                disabled={loading}
                                                aria-disabled={loading}
                                            />

                                        </InputGroup>
                                        <FieldError errors={[fieldState.error]}/>
                                    </Field>
                                )}/>
                        </form>
                        <Field>
                            <Button type={"submit"} form={"form-username"} disabled={loading}>
                                Continue
                            </Button>
                        </Field></>
                    :
                    <div>
                        <ProfileDropBox onComplete={runUploadPhoto} disabled={loading}/>
                        <p>Choose your profile pic!</p>
                        <FieldError errors={[{message: picError}]}/>
                        <Field orientation={"horizontal"}>
                            <Button disabled={!continueEnabled} onClick={() => {
                                window.location.href = "/"
                            }}>
                                Continue
                            </Button>
                            <Button variant={"secondary"} disabled={loading} onClick={() => {
                                window.location.href = "/"
                            }}>
                                Skip
                            </Button>
                        </Field>
                    </div>
                }
            </div>
        </div>
    )
}