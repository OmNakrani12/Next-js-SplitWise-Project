"use client"
import Image from "next/image"
import { Bell, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
export default function Header({setOpen, open}){
    let [email, setEmail] = useState("");
    let [url, setURL] = useState("");
    let [onPhotoOpen, setOnPhotoOpen] = useState(false);
    let [count, setCount] = useState(0);
    let router = useRouter();
    let handleNotificationClick = () => {
        setOpen(!open);
    }
    let handleLogout = async () => {
        await fetch("api/logout");
        router.push('/');
    }
    let fetchLength = async() => {
        const res = await fetch("api/notify",{
            method:"GET",
        });
        const data = await res.json();
        setCount(data.length);
    }
    useEffect(() => {
        setEmail(localStorage.getItem("email"));
        setURL(localStorage.getItem("url"));
        fetchLength();
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
            <div onClick={() => setOnPhotoOpen(!onPhotoOpen)}>
                { url ? (
                    <Image src={url} alt="Pic" width={48} height={48} className="rounded-full"/>
                ) : (
                    <UserRound width={48} height={48} className="rounded-full text-gray-500 border-5 border-gray-500"/>
                )}
            </div>
        </div>
        {onPhotoOpen && (
        <div className="absolute right-0 top-15 w-40 bg-white rounded-xl p-2 z-10">
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100" onClick={() => router.push('/profile')}>
                Profile
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100" onClick={() => router.push('/')}>
                Settings
            </button>
            <button className="w-full text-left px-4 py-2 text-red-600 rounded-lg hover:bg-red-100" onClick={handleLogout}>
                Logout
            </button>
        </div>
        )}
    </div>
}