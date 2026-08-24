import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { headers } from "next/headers";
import {auth} from "@/lib/auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const imageRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    profileUploader: f({
        image: {
            /**
             * For full list of options and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const session = await auth.api.getSession({
                headers: await headers()
            })

            if(!session){
                throw new UploadThingError("Unauthorized")
            }
            return {};
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return { url: file.ufsUrl };
        }),
} satisfies FileRouter;

export type appImageRouter = typeof imageRouter;
