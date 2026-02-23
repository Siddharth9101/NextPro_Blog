import type { Metadata } from 'next';
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {fetchQuery, preloadQuery} from "convex/nextjs";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import Image from "next/image";
import {Separator} from "@/components/ui/separator";
import CommentSection from "@/components/web/CommentSection";
import PostPresence from "@/components/web/PostPresence";
import {getToken} from "@/lib/auth-server";
import {redirect} from "next/navigation";

interface BlogPageProps {
    params: Promise<{
        id: Id<"posts">
    }>
}

export const generateMetadata = async ({params}: BlogPageProps): Promise<Metadata> => {
    const {id} = await params
    const post = await fetchQuery(api.posts.getPostById, {postId: id});

    if(!post){
        return {
            title: "No post found"
        }
    }

    return {
        title: post.title,
        description: post.content,
    }
}

export default async function BlogPage({params}: BlogPageProps){
    const {id} = await params;
    const token = await getToken();
    const [post, preloadedComments, userId] = await Promise.all([
        await fetchQuery(api.posts.getPostById, {postId: id}),
        await preloadQuery(api.comments.getCommentsByPostId, {postId: id}),
        await fetchQuery(api.presence.getUserId, {}, {token}),
    ]);

    if(!userId){
        return redirect("/auth/login");
    }

    if(!post){
        return <div>
            <h1 className="text-6xl font-bold text-red-500 p-20">No post found!</h1>
        </div>
    }
    return <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
        <Link className={buttonVariants({variant: "outline", className: "mb-4"})} href="/blogs">
            <ArrowLeft className="size-4" />
            Back to blogs
        </Link>

        <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
            <Image src={post.imageUrl ?? "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt={post.title} fill className="object-cover hover:scale-105 transition-transform duration-500" />
        </div>

        <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">{post.title}</h1>

            <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Posted on: {new Date(post._creationTime).toLocaleDateString("en-US")}</p>
                {userId && <PostPresence roomId={id} userId={userId}/>}
            </div>

            <Separator />

            <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">{post.content}</p>

            <Separator />

            <CommentSection preloadedComments={preloadedComments} />
        </div>
    </div>
}