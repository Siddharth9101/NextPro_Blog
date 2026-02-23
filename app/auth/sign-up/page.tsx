"use client"

import {Controller, useForm} from "react-hook-form";
import z from "zod"
import {signUpSchema} from "@/app/schemas/auth";
import {zodResolver} from "@hookform/resolvers/zod"
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {Loader2} from "lucide-react";

export default function SignUpPage(){
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    });
    const onSubmit = (data: z.infer<typeof signUpSchema>) => {
        startTransition(async () => {
            await authClient.signUp.email({
                email: data.email,
                name: data.name,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Account created successfully")
                        router.push("/")
                    },
                    onError: (error) =>{
                        toast.error(error.error.message)
                    }
                }
            })
        })
    }
    return <Card className="gap-y-4">
                <CardHeader>
                    <CardTitle>Sign up</CardTitle>
                    <CardDescription>Create an account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller name="name" control={form.control} render={({field, fieldState}) => (
                                <Field>
                                    <FieldLabel>Full Name</FieldLabel>
                                    <Input type="text" aria-invalid={fieldState.invalid} placeholder="John Doe" {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Controller name="email" control={form.control} render={({field, fieldState}) => (
                                <Field>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input type="email" aria-invalid={fieldState.invalid} placeholder="john@doe.com" {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Controller name="password" control={form.control} render={({field, fieldState}) => (
                                <Field>
                                    <FieldLabel>Password</FieldLabel>
                                    <Input type="password" aria-invalid={fieldState.invalid} placeholder="******" {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Button disabled={isPending}>{
                                isPending
                                ? <><Loader2 className="size-4 animate-spin" /><span>Loading...</span></>
                                    : <span>Sign up</span>
                            }</Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
}
