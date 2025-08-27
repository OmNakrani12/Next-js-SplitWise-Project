"use client"
import Image from "next/image"
import { Bell, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Header({setOpen, open}){
    let [email, setEmail] = useState("");
    let [url, setURL] = useState("");
    let router = useRouter();
    let count = 2;
    let handleNotificationClick = () => {
        setOpen(!open);
    }
    useEffect(() => {
        setEmail(localStorage.getItem("email"));
        setURL(localStorage.getItem("url"));
    })
    return <div className="flex justify-between items-center">
        <ul className="flex gap-4">
            <li>{email}</li>
        </ul>
        <div className="flex gap-6 items-center relative mr-5 p-3">
            <div className="relative cursor-pointer">
                <Bell className="w-6 h-6 text-gray-700 hover:text-gray-900 transition"  onClick={handleNotificationClick}/>
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full shadow">
                    {count}
                    </span>
                )}
            </div>
            { url ? (
                <Image src={url} alt="Pic" width={48} height={48} className="rounded-full"/>
            ) : (
                <UserRound width={48} height={48} className="rounded-full text-gray-500 border-5 border-gray-500"/>
            )}
        </div>
    </div>
}