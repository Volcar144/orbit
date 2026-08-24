import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import {authClient} from "@/lib/auth-client";
import {useState} from "react";
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from "@/components/ui/input-group";
import {Eye, EyeClosed} from "lucide-react";
import {Button} from "@/components/ui/button";
import {GoogleIcon} from "@/components/GoogleIcon";
import {useRouter} from "next/navigation";

const loginSchema = z.object({
    loginIdentifier: z
        .string()
        .min(3, "Username or email too short.")
        .max(60, "Username or email is too long."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(60, "Password must not be longer than 60 characters")
})

export function SignInForm(){
    const router = useRouter()
    const [loading, setIsLoading] = useState(false)
    const [hidden, setHidden] = useState(true)

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            loginIdentifier: "",
            password: ""
        },
    })

    function isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    async function googleLogin(){
        setIsLoading(true)
        const {data, error} = await authClient.signIn.social({
            provider: "google"
        }, {
            onError(ctx){
                setIsLoading(false)
                form.setError("loginIdentifier", {
                    type: "value",
                    message: ""
                })
                form.setError("password", {
                    type: "value",
                    message: ctx.error.message
                })
            },
            onSuccess(ctx){
                router.push("/");
            }
        })
        setIsLoading(false)
    }

    async function onSubmit(input: z.infer<typeof loginSchema>){
        setIsLoading(true);
        if(isValidEmail(input.loginIdentifier)){
            const {data, error} = await authClient.signIn.email({
                email: input.loginIdentifier,
                password:input.password
            }, {
                onError(ctx){
                    setIsLoading(false)
                    form.setError("loginIdentifier", {
                        type: "value",
                        message: ""
                    })
                    form.setError("password", {
                        type: "value",
                        message: ctx.error.message
                    })
                },
                onSuccess(ctx){
                    router.push("/");
                }
                }
            )
            setIsLoading(false)
        } else {
            const {data, error} = await authClient.signIn.username({
                    username: input.loginIdentifier,
                    password:input.password
                }, {
                    onError(ctx){
                        setIsLoading(false)
                        form.setError("loginIdentifier", {
                            type: "value",
                            message: ""
                        })
                        form.setError("password", {
                            type: "value",
                            message: ctx.error.message
                        })
                    },
                    onSuccess(ctx){
                        router.push("/");
                    }
                }
            )
            setIsLoading(false)
        }
    }

    return(
        <div className="flex flex-col items-center w-full min-w-full">
            <div className="w-full flex flex-col gap-2 items-center bg-primary pt-20 pb-10 px-4">
                <h1 className="text-3xl text-primary-foreground">Welcome back!</h1>
                <h3 className="text-2xl text-primary-foreground/70">
                    Enter your credentials below to sign in.
                </h3>
            </div>

            <div className="w-full md:w-7/9 -mt-6 bg-card border rounded-xl shadow-sm p-6 flex flex-col gap-6 items-center">
                <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <FieldGroup>
                        <Controller
                            name="loginIdentifier"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="login-form-em/us">Email or account username</FieldLabel>
                                    <Input
                                        {...field}
                                        id="login-form-em/us"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="GorillaGuy55"
                                        autoComplete="off"
                                        className="w-full"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <div className="flex items-center">
                                        <FieldLabel htmlFor="login-form-pass">Password</FieldLabel>
                                        <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id="login-form-pass"
                                            aria-invalid={fieldState.invalid}
                                            placeholder={hidden ? "••••••••••••" : "Password1234"}
                                            autoComplete="off"
                                            type={hidden ? "password" : "text"}
                                            className="w-full"
                                        />
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupButton
                                                aria-label="Show/Hide password"
                                                title="Toggle Visibility"
                                                size="icon-xs"
                                                onClick={() => setHidden(!hidden)}
                                            >
                                                {hidden ? <EyeClosed /> : <Eye />}
                                            </InputGroupButton>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>

                <Field orientation="horizontal" className="w-full">
                    <Button type="submit" form="login-form" variant="default" disabled={loading} className="w-full">
                        Sign In
                    </Button>
                </Field>

                <FieldSeparator className="w-full">Or Continue With</FieldSeparator>

                <Field className="w-full">
                    <Button variant="outline" type="button" className="w-full" disabled={loading} onClick={googleLogin}>
                        <GoogleIcon size={24} />
                        Login with Google
                    </Button>
                    <FieldDescription className="text-center">
                        Don&apos;t have an account?{" "}
                        <a href="/signup" className="underline underline-offset-4">Sign up</a>
                    </FieldDescription>
                </Field>
            </div>
        </div>
    )
}