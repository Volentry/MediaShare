"use client"

import React,{useEffect,useState,useCallback} from "react"
import axios from "axios"
import VideoCard from "@/components/VideoCard"
import { fetchExternalImage } from "next/dist/server/image-optimizer"
import { error } from "console"

interface Video{
  id: string 
  title: string
  description: string
  publicId :string
  originalSize :string
  compressedSize :string
  durationn :number
  createdAt :Date

}
export default function Home(){

    const [uploadedVideos,setUploadedVideos]= useState<Video[]>([])
    const [loading,setLoading] = useState(true)
    

    const handlePage = useCallback(async ()=>{
       
           try{const fetchh = await axios.get('/api/videos')
                 if(Array.isArray(fetchh.data)){
                    setUploadedVideos(fetchh.data)
                 }else{
                    throw new Error("unexpected error")
                 }

           }catch(e){
            console.log('error')
           }finally{
            setLoading(false)
           }
    },[])

   

    const handleFileDownload = useCallback((url:string,title:string)=>{
        
     
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute("download",`${title}.mp4`)
        link.setAttribute('target',"_blank")
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        
    },[])
    

    useEffect(()=>{
        
        handlePage();
    },[handlePage])
    if(loading){
        return <div>Loading...</div>
    }


    return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Videos</h1>
          {uploadedVideos.length === 0 ? (
            <div className="text-center text-lg text-gray-500">
              No videos available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {
                uploadedVideos.map((video) => (
                    <VideoCard
                        key={video.id}
                        video={video}
                        onDownload={handleFileDownload}
                    />
                ))
              }
            </div>
          )}
        </div>
      );
}