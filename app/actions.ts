"use server";

import {getToken} from "@/lib/auth-server";
import z from "zod";
import {postSchema} from "@/app/schemas/blog";
import {fetchMutation} from "convex/nextjs";
import {api} from "@/convex/_generated/api";
import {redirect} from "next/navigation";
import { updateTag} from "next/cache";


export async function createBlogAction(values: z.infer<typeof postSchema>){
    const token = await getToken();

    const parsed = postSchema.safeParse(values);

    if(!parsed || !parsed.data){
        throw new Error("Something went wrong")
    }

    try{
        const imageUrl = await fetchMutation(api.posts.generateImageUploadUrl, {}, {token});

        const uploadResult = await fetch(imageUrl, {
            method: "POST",
            headers: {
                "Content-Type": parsed.data.image.type
            },
            body: parsed.data.image,
        })

        if(!uploadResult.ok){
            return {error: "Filed to upload image"}
        }

        const {storageId} = await uploadResult.json();

        await fetchMutation(api.posts.createPost,{
            title: parsed.data.title,
            content: parsed.data.content,
            imageStorageId: storageId,
        }, {token});

    }catch {
        return {error: "Filed to create blog post"}
    }
        updateTag("blogs");
        return redirect("/blogs");
}