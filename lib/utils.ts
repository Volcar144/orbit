import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {Image} from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string, maxLength = 2): string {
  return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .filter(Boolean)
      .slice(0, maxLength)
      .join("");
}

export enum api{
  "APOD",
  "ASTEROID",
  "DONKI",
  "EPIC"
}

export function getNameFromApi(type: api){
  switch(type){
    case api.APOD: return "Astronomy Picture Of The Day"
    case api.ASTEROID: return "Asteroid Watch"
    case api.DONKI: return "Space Weather"
    case api.EPIC: return "Earth Today"
  }
}