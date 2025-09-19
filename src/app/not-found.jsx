"use client"
import { usePathname } from "next/navigation"
export default function NotFound(){
    const pathName = usePathname();
    return (
        <div>
            <h1 className = "h-screen grid text-center items-center text-2xl font-bold bg-black text-white">Page { pathName.substring(1) } Not Found</h1>
        </div>
    );
}