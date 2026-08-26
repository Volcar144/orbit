import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getInitials} from "@/lib/utils";

type props = {
    profileUrl:string | null | undefined
    name:string | undefined
    height: number
    width: number
}

export default function UserAvatar({
    profileUrl,
    name,
    height,
    width
}: props){
    let url = "";
    if(profileUrl == undefined){
        url = "ewnkgbwjgbygrbuigb"
    } else {
        url = profileUrl
    }
    let nm = "Unknown User"

    if(name != undefined){
        nm = name
    }

    return(
        <Avatar>
            <AvatarImage src={url} height={height} width={width}/>
            <AvatarFallback>{getInitials(nm)}</AvatarFallback>
        </Avatar>
    )
}