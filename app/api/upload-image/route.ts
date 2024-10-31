import { NextRequest,NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { arrayBuffer } from "stream/consumers";
import { resolve } from "path";
import { rejects } from "assert";
import { error } from "console";


cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_SECRET// Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUploadResult{
      public_id:string;
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
        if(!file){
            return NextResponse.json({error:"file not found"},{status:400})

        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes)

       const result = await new Promise<CloudinaryUploadResult>((resolve,reject)=>{

            const uploadstream = cloudinary.uploader.upload_stream(
                {folder:'editor-cloudinary-next'},
                (error,result)=>{
             error? reject(error):resolve(result as CloudinaryUploadResult)

                }
                

            )

            uploadstream.end(buffer)
        }

        )

        return NextResponse.json({publicId:result.public_id},{status:200})
         


        

    }catch(error){
         return NextResponse.json({error:"error "},{status:500})
    }
}
