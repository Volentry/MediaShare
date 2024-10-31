import { NextRequest,NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_SECRET// Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUploadResult{
      public_id:string;
      bytes:number;
      duration?:number;
      [key:string]:any;
}

export async function POST(request:NextRequest) {
    const userId = (await auth()).userId

    if(!userId){
        return NextResponse.json({error:"unauthorised"},{status:401})
    }

    try{
        const formData = await request.formData()
        const file = formData.get("file") as File|null;
        const title = formData.get('title')as string
        const description = formData.get('description') as string
        const originalSize = formData.get('originalSize') as string
        if(!file){
            return NextResponse.json({error:"file not found"},{status:400})

        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes)

       const result = await new Promise<CloudinaryUploadResult>((resolve,reject)=>{

            const uploadstream = cloudinary.uploader.upload_stream(
                {   resource_type:'video',
                    folder:'editor-cloudinary-next-videos',
                    transformation:[{quality:'auto',fetch_format:'mp4'}]
                
                },
                    
                (error,result)=>{
             error? reject(error):resolve(result as CloudinaryUploadResult)

                }
                

            )

            uploadstream.end(buffer)
        }

        )

        const video = await prisma.video.create({
            data:{
                 title,description,
                 publicId: result.public_id,
                 originalSize:originalSize,
                 compressedSize: String(result.byte),
                 durationn: result.duration||0,

            }
        })

        return NextResponse.json({publicId:result.public_id},{status:200})
         


        

    }catch(error){
         return NextResponse.json({error:"error "},{status:500})
    }finally{
        await prisma.$disconnect()
    }
}
