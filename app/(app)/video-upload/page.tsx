"use client"

import React,{useState} from "react";
import axios from "axios";



export default function VideoUpload(){
    const [file,setFile] = useState<File|null>(null);
    const [title,setTitle]= useState("")
    const [description,setDescription] = useState("")
    const [isUploading,setIsUploading] = useState(false);

    // const router = useRouter()

    const maxSize = 1024*1024*60;

    const handleSubmit =async  (event:React.FormEvent)=>{
        event.preventDefault()

        if(!file) return ;
        if(file.size>maxSize){
            alert('upload image of smaller size')
            return;
        }
        setIsUploading(true)
        const form  = new FormData()
        form.append("file",file)
        form.append("title",title)
        form.append("originalSize",file.size.toString())
        form.append("description",description)

        try{
            const response = await axios.post('/api/upload-vid',form)
            if(response.status==200){
                alert('file uploaded')
            }
        }catch(e){
            console.log('Unable to upload')
        }finally{
            setIsUploading(false)
        }

    }


    return (
        <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Video File</span>
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="file-input file-input-bordered w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>

    );


}