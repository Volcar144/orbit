import {api} from "@/lib/utils";
import {Astroid, Image, Earth, RocketIcon} from "lucide-react";


export function getIconFromApi(type: api){
    switch(type){
        case api.APOD: return (<Image/>)
        case api.ASTEROID: return (<Astroid/>)
        case api.DONKI:return (<RocketIcon />)
        case api.EPIC: return(<Earth/>)
    }
}