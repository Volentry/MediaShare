"use client"
import { CldImage } from 'next-cloudinary'
import React,{useState,useEffect,useRef} from "react"

const SocialShare ={
    "Square 1:1":{width:1000,height:1000,aspectRatio:"1:1 "}
}


type socialFormat = keyof typeof SocialShare;

export default function Social(){
    const [uploadedImage,setUploadedImage] = useState<string|null>(null);
    const [selectedFormat,setSelectedFormat]= useState<socialFormat>("Square 1:1")
    const [isUploading,setIsUploading] = useState(false);
    const [transform,setTransform] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

     useEffect(()=>{
        if(uploadedImage){
            setTransform(true);
        }
     },[uploadedImage,selectedFormat])

     const handleFileUpload = async(event:React.ChangeEvent<HTMLInputElement>)=>{
        const file  = event.target.files?.[0];
        if(!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file",file);

        try{
          const response=  await fetch("/api/upload-image",{
            method:"POST",
            body:formData
          })
          if(!response)throw new Error("failed to upload");
          const data = await response.json();
          setUploadedImage(data.public_Id);
        }catch(e){
            alert("Failed to upload image");
            console.log(`${e}`)
             
        }finally{
            setIsUploading(false);
        }


         
     }

     const handleFileDownload = ()=>{
        if(!imgRef.current) return;
        fetch(imgRef.current.src)
        .then((e)=>e.blob())
        .then((blob)=>{
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a');
            link.href = url;
            link.download = "image"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            document.body.removeChild(link)
        })
     }
     
     return (
        <div className="container mx-auto p-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Social Media Image Creator
          </h1>

          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Upload an Image</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Choose an image file</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="file-input file-input-bordered file-input-primary w-full"
                />
              </div>

              {isUploading && (
                <div className="mt-4">
                  <progress className="progress progress-primary w-full"></progress>
                </div>
              )}

              {uploadedImage && (
                <div className="mt-6">
                  <h2 className="card-title mb-4">Select Social Media Format</h2>
                  <div className="form-control">
                    <select
                      className="select select-bordered w-full"
                      value={selectedFormat}
                      onChange={(e) =>
                        setSelectedFormat(e.target.value as socialFormat)
                      }
                    >
                      {Object.keys(SocialShare).map((format) => (
                        <option key={format} value={format}>
                          {format}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6 relative">
                    <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                    <div className="flex justify-center">
                      {transform && (
                        <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                          <span className="loading loading-spinner loading-lg"></span>
                        </div>
                      )}
                      <CldImage
                        width={SocialShare[selectedFormat].width}
                        height={SocialShare[selectedFormat].height}
                        src={uploadedImage}
                        sizes="100vw"
                        alt="transformed image"
                        crop="fill"
                        aspectRatio={SocialShare[selectedFormat].aspectRatio}
                        gravity='auto'
                        ref={imgRef}
                        onLoad={() => setTransform(false)}
                        />
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-6">
                    <button className="btn btn-primary" onClick={handleFileDownload}>
                      Download for {selectedFormat}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
}