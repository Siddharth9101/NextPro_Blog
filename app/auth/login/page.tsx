"use client"

import {Controller, useForm} from "react-hook-form";
import {loginSchema} from "@/app/schemas/auth";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {Loader2} from "lucide-react";

export default function LoginPage(){
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });
    const onSubmit = (data: z.infer<typeof loginSchema>) => {
        startTransition(async () => {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged in successfully")
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
            <CardTitle>Login</CardTitle>
            <CardDescription>Login to get started right away</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
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
                            : <span>Login</span>
                    }</Button>
                </FieldGroup>
            </form>
        </CardContent>
    </Card>
}