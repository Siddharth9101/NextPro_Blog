"use client"

import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {ThemeToggle} from "@/components/web/theme-toggle";
import {useConvexAuth} from "convex/react";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import SearchInput from "@/components/web/SearchInput";

export function Navbar(){
    const {isLoading, isAuthenticated} = useConvexAuth();
    const router = useRouter();
    return <nav className="w-full py-5 flex items-center justify-between">
        <Link href="/">
            <div className="flex items-center gap-8">
                <h1 className="text-2xl sm:text-3xl font-bold">Next<span className="text-primary">Pro</span></h1>
            </div>
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
            <div className="hidden sm:block"><Link className={buttonVariants({variant: "ghost"})} href="/">Home</Link></div>
            <Link className={buttonVariants({variant: "ghost"})} href="/blogs">Blogs</Link>
            <Link className={buttonVariants({variant: "ghost"})} href="/create">Create</Link>
        </div>
        <div className="flex items-center gap-2">
            <div className="hidden md:block">
                <SearchInput />
            </div>
            {
                isLoading ? null : isAuthenticated ? <Button onClick={()=>authClient.signOut({fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged out successfully")
                        router.push("/")
                    },
                    onError: (error) =>{
                    toast.error(error.error.message)
                    }
                    }})}>Logout</Button> : (<>
                    <Link className={buttonVariants()} href="/auth/sign-up">Sign Up</Link>
                    <Link className={buttonVariants({variant: "outline"})} href="/auth/login">Login</Link>
                </>)
            }
            <ThemeToggle />
        </div>
    </nav>
}