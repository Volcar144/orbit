"use client";

import { useState } from "react";
import { api, getNameFromApi } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getIconFromApi } from "@/lib/tsxUtils";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

type props = {
    imageUrl?: string;
    content: string;
    api: api;
    likes: number;
    commentsNum: number;
    liked: boolean;
    signedIn: boolean;
};

export default function Post({
                                 imageUrl,
                                 content,
                                 api,
                                 likes,
                                 commentsNum,
                                 liked,
                                signedIn
                             }: props) {
    const name = getNameFromApi(api);

    const [isLiked, setIsLiked] = useState(liked);
    const [likeCount, setLikeCount] = useState(likes);
    const [showDialog, setShowDialog] = useState(false)

    function like() {
        if(signedIn){
            setIsLiked((prev) => !prev);
            setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
        } else {
            setShowDialog(true)
        }
    }

    return (
        <div className="w-full md:w-7/9 m-3 overflow-hidden rounded-xl border-3 border-slate-700 shadow-sm">
            <div className="w-full p-3 flex items-center gap-2 text-slate-200">
                <Avatar>
                    <AvatarFallback>{getIconFromApi(api)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-slate-400">Today</div>
                </div>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sign in to react</DialogTitle>
                        <DialogDescription>
                            Create an account to like posts and join the conversation.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => (window.location.href = "/signin")}>
                            Sign in
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {imageUrl ? (
                <div className="w-full aspect-video overflow-hidden">
                    <img
                        src={imageUrl}
                        alt="Image from nasa"
                        width={1200}
                        height={675}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div className="w-full px-4 py-8 text-slate-300">
                    <p>{content}</p>
                    <div className="mt-4 flex gap-4 text-sm text-slate-400">
                        <div className="flex flex-row gap-2">
                            <Button size="icon" variant="ghost" onClick={like}>
                                {isLiked ? (
                                    <Heart color="#00b8d9" fill="#00e1ff" />
                                ) : (
                                    <Heart />
                                )}
                            </Button>
                            <p className="mt-1">{likeCount}</p>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Button size="icon" variant="ghost">
                                <MessageCircle />
                            </Button>
                            <p className="mt-1">{commentsNum}</p>
                        </div>
                    </div>
                </div>
            )}

            {imageUrl && (
                <div className="p-4 text-slate-300">
                    <p>{content}</p>
                    <div className="mt-3 flex gap-4 text-sm text-slate-400">
                        <div className="flex flex-row gap-2">
                            <Button size="icon" variant="ghost" onClick={like}>
                                {isLiked ? (
                                    <Heart color="#00b8d9" fill="#00e1ff" />
                                ) : (
                                    <Heart />
                                )}
                            </Button>
                            <p className="mt-1">{likeCount}</p>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Button size="icon" variant="ghost">
                                <MessageCircle />
                            </Button>
                            <p className="mt-1">{commentsNum}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}