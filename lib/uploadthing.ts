import {
    generateUploadButton,
    generateUploadDropzone,
} from "@uploadthing/react";
import {appImageRouter} from "@/app/api/uploadthing/core";



export const UploadButton = generateUploadButton<appImageRouter>();
export const UploadDropzone = generateUploadDropzone<appImageRouter>();
