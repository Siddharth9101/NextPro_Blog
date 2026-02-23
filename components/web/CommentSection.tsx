"use client"

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Loader2, MessageSquare} from "lucide-react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import z from "zod";
import {commentSchema} from "@/app/schemas/comment";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useParams} from "next/navigation";
import {Id} from "@/convex/_generated/dataModel";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {toast} from "sonner";
import {useTransition} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";
import {Preloaded, usePreloadedQuery} from "convex/react";

export default function CommentSection(props: {
    preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>
}){
    const [isPending, startTransition] = useTransition();
    const params = useParams<{id: Id<"posts">}>();
    const data = usePreloadedQuery(props.preloadedComments);
    const createComment = useMutation(api.comments.createComment);
    const form = useForm<z.infer<typeof commentSchema>>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            body: "",
            postId: params.id,
        }
    });
    const onSubmit = (data: z.infer<typeof commentSchema>)=> {
        startTransition(async () => {
            try{
                await createComment(data);
                form.reset();
                toast.success("Comment posted")
            }catch{
                toast.error("Failed to create comment")
            }
        })
    }

    if(data === undefined){
        return <p>loading...</p>
    }

    return <Card>
        <CardHeader className="flex items-center gap-2 border-b">
            <MessageSquare className="size-5" />
            <h2 className="text-xl font-bold">{data?.length} Comments</h2>
        </CardHeader>
        <CardContent className="space-y-8">
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <Controller name="body" control={form.control} render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel>Comment</FieldLabel>
                        <Textarea aria-invalid={fieldState.invalid} placeholder="Share your thoughts..." {...field} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )} />
                <Button disabled={isPending}>{
                    isPending
                        ? <><Loader2 className="size-4 animate-spin" /><span>Loading...</span></>
                        : <span>Comment</span>
                }</Button>
            </form>

            {data?.length > 0 && <Separator />}

            <section className="space-y-6">
                {data?.map(comment => (
                    <div key={comment._id} className="flex gap-4">
                        <Avatar className="size-10 shrink-0">
                            <AvatarImage src={`https://avatar.vercel.sh/${comment.authorName}`} alt={comment.authorName} />
                            <AvatarFallback>
                                {comment.authorName.slice(0,2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">{comment.authorName}</p>
                                <p className="text-xs text-muted-foreground">{new Date(comment._creationTime).toLocaleDateString("en-US")}</p>
                            </div>
                            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{comment.body}</p>
                        </div>
                    </div>
                ))}
            </section>
        </CardContent>
    </Card>
}