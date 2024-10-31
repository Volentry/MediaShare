import { Prisma,PrismaClient } from "@prisma/client";

import { NextResponse,NextRequest } from "next/server";


const prisma = new PrismaClient();

export async function GET(request:NextRequest) {

    try{

        const videos = await prisma.video.findMany({
            orderBy :{createdAt:'desc'}
        })
        return NextResponse.json(videos)

    }catch(e){
        return NextResponse.json(["coundlt fetch the videos"],{status:500})
    }finally{
        prisma.$disconnect();
    }
    
}