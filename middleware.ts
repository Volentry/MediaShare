import { clerkMiddleware,createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const isPublicPage = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/home",
    "/"
])
const isPublicApi = createRouteMatcher([
    "/api/videos"
])
export default clerkMiddleware(async (auth,req)=>{
    const {userId} = await auth();
    const urll = new URL(req.url);
    const isActivePublic = urll.pathname==="/home"
    const isActiveApi = urll.pathname.startsWith("/api")
     
    if(userId&&isPublicPage(req)&&!isActivePublic){
        return NextResponse.redirect(new URL("/home",req.url))
    }
   
    if(!userId){
        if(isActiveApi&&!isPublicApi(req)){
            return NextResponse.redirect(new URL("/sign-in",req.url))

        }
        if(!isPublicApi(req)&&!isPublicPage(req)){
            return NextResponse.redirect(new URL("/sign-in",req.url))

        }
        if(urll.pathname=='/'){
            return NextResponse.redirect(new URL("/sign-in",req.url))

        }

    }

    return NextResponse.next()

});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};