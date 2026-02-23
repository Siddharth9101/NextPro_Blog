import {api} from "@/convex/_generated/api";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {fetchQuery} from "convex/nextjs";
import {Suspense} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {Metadata} from "next";
import {connection} from "next/server";
import {cacheLife, cacheTag} from "next/cache";

export const metadata: Metadata = {
    title: "Blogs | NextPro",
    description: "Read latest articles and insights",
}


export default function BlogPost(){
    return <div className="py-12">
        <div className="text-center pb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Our Blogs</h1>
            <p className="p-4 max-w-2xl mx-auto text-xl text-muted-foreground">Insights, thoughts, and trends from our team.</p>
        </div>

        <Suspense fallback={<SkeletonLoadingUI />}>
            <LoadBlogPosts />
        </Suspense>

    </div>
}
// 7:56
async function LoadBlogPosts() {
    // "use cache";
    // cacheLife("hours");
    // cacheTag("blogs")
    await connection();
    const posts = await fetchQuery(api.posts.getPosts);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts?.map(post => (
                <Card key={post._id} className="pt-0">
                    <div className="relative w-full h-48 overflow-hidden">
                        <Image src={post.imageUrl ?? "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="image" fill className="rounded-t-lg object-cover" />
                    </div>

                    <CardContent>
                        <Link href={`/blogs/${post._id}`}>
                            <h1 className="text-2xl font-bold hover:text-primary">{post.title}</h1>
                            <p className="text-muted-foreground line-clamp-3">{post.content}</p>
                        </Link>
                    </CardContent>
                    <CardFooter>
                        <Link className={buttonVariants({className: "w-full"})} href={`/blogs/${post._id}`}>Read more</Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

function SkeletonLoadingUI(){
            return (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_,i) => (
                            <div key={i} className="flex flex-col space-y-3">
                                <Skeleton className="w-full h-48 rounded-xl" />
                                <div className="flex flex-col space-y-2">
                                    <Skeleton className="h-3 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/4" />
                                </div>
                            </div>
                    ))}
                </div>
            )
}