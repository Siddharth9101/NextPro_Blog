import {mutation, query} from "./_generated/server";
import {ConvexError, v} from "convex/values";
import {authComponent} from "./auth";


export const getCommentsByPostId = query({
    args: {
        postId: v.id("posts")
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("comments").filter((q) => q.eq(q.field("postId"), args.postId)).order("desc").collect();
    }
})

export const createComment = mutation({
    args: {
        postId: v.id("posts"),
        body: v.string()
    },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx);

        if(!user){
            throw new ConvexError("Not Authenticated");
        }

        return await ctx.db.insert("comments", {
            body: args.body,
            postId: args.postId,
            authorId: user._id,
            authorName: user.name,
        })
    }
})